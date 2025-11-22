"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Zap, AlertCircle } from "lucide-react"

export default function MapView({ orders, selectedZone, selectedOrder }: { orders?: any[]; selectedZone?: string; selectedOrder?: any }) {
  const [optimizedRoute, setOptimizedRoute] = useState<any[]>([])
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 }) // Delhi coordinates
  const [zoom, setZoom] = useState(13)

  // Normalize orders input
  const ordersList = orders ?? []

  // Determine if orders contain coordinates we can use for real map markers
  const hasCoords = ordersList && ordersList.some((o: any) => (o.latitude || o.lat) && (o.longitude || o.lng))

  const mapRef = useRef<HTMLDivElement | null>(null)
  const googleMapRef = useRef<any>(null)
  const directionsRendererRef = useRef<any>(null)
  const directionsServiceRef = useRef<any>(null)
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null)

  // Debugging: surface key/coords state to console to help diagnose why map may not load
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log("MapView: debug", {
        ordersCount: ordersList.length,
        hasCoords,
        googleKeyPresent: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        googleScript: !!document.querySelector('script[src*="maps.googleapis.com"]'),
        windowGoogle: typeof window !== 'undefined' ? !!(window as any).google : false,
      })
    } catch (e) {
      // ignore
    }
  }, [ordersList, hasCoords])

  // Helper to get browser geolocation as a promise
  const getCurrentPosition = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null)
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, maximumAge: 10000 }
      )
    })
  }

  // When selectedOrder changes, compute directions from current location (if available) to order
  useEffect(() => {
    if (!selectedOrder) return
    const lat = selectedOrder.latitude ?? selectedOrder.lat
    const lng = selectedOrder.longitude ?? selectedOrder.lng
    if (!lat || !lng) return

    const maybeCompute = async () => {
      // ensure google maps loaded and map exists
      if (!(window as any).google || !(window as any).google.maps || !googleMapRef.current) return

      // get current position if not already
      if (!currentPosition) {
        const pos = await getCurrentPosition()
        if (pos) setCurrentPosition(pos)
      }

      const googleMaps = (window as any).google.maps

      // create service/renderer if needed
      if (!directionsServiceRef.current) directionsServiceRef.current = new googleMaps.DirectionsService()
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new googleMaps.DirectionsRenderer({ suppressMarkers: false })
        directionsRendererRef.current.setMap(googleMapRef.current)
      }

      const origin = currentPosition ?? { lat: mapCenter.lat, lng: mapCenter.lng }
      const destination = { lat: Number(lat), lng: Number(lng) }

      directionsServiceRef.current.route(
        {
          origin,
          destination,
          travelMode: googleMaps.TravelMode.DRIVING,
        },
        (result: any, status: any) => {
          if (status === googleMaps.DirectionsStatus.OK || status === "OK") {
            directionsRendererRef.current.setDirections(result)
          } else {
            // fallback: fit bounds to origin/destination
            const bounds = new googleMaps.LatLngBounds()
            bounds.extend(origin)
            bounds.extend(destination)
            googleMapRef.current.fitBounds(bounds)
          }
        }
      )
    }

    maybeCompute()
  }, [selectedOrder, currentPosition, googleMapRef.current])

  useEffect(() => {
    if (ordersList.length === 0) {
      setOptimizedRoute([])
      return
    }

    // Simple nearest neighbor algorithm for route optimization
    const optimized = []
  const remaining = [...ordersList]
    let current = remaining[0]
    optimized.push(current)
    remaining.splice(0, 1)

    while (remaining.length > 0) {
      let nearest = remaining[0]
      let minDistance = Math.abs(nearest.distance - current.distance)

      for (let i = 1; i < remaining.length; i++) {
        const distance = Math.abs(remaining[i].distance - current.distance)
        if (distance < minDistance) {
          minDistance = distance
          nearest = remaining[i]
        }
      }

      optimized.push(nearest)
      current = nearest
      remaining.splice(remaining.indexOf(nearest), 1)
    }

    setOptimizedRoute(optimized)
  }, [ordersList])

  // If we have coordinates and an API key, load Google Maps and render markers
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return

  // Load map if API key present. We no longer require coordinates to render the base map
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!key) return

    const loadMap = () => {
      if (!mapRef.current) return

      // Initialize map if not already
      if (!googleMapRef.current && (window as any).google && (window as any).google.maps) {
        const center = { lat: mapCenter.lat, lng: mapCenter.lng }
        googleMapRef.current = new (window as any).google.maps.Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
        })
      }

      // Clear existing markers/polylines
      if (!googleMapRef.current) return
      const googleMaps = (window as any).google.maps

      // Remove previous overlays if any (simple approach: recreate map)
      // For stability, create a new map instance so we don't need to track overlays
      const center = { lat: mapCenter.lat, lng: mapCenter.lng }
      googleMapRef.current = new googleMaps.Map(mapRef.current, { center, zoom, disableDefaultUI: true })

      const markers: any[] = []
      const path: any[] = []

      optimizedRoute.forEach((order: any) => {
        const lat = order.latitude ?? order.lat
        const lng = order.longitude ?? order.lng
        if (!lat || !lng) return
        const position = { lat: Number(lat), lng: Number(lng) }
        path.push(position)
        const marker = new googleMaps.Marker({ position, map: googleMapRef.current, title: order.order_number || order.id })
        markers.push(marker)
      })

      if (path.length > 1) {
        const routeLine = new googleMaps.Polyline({ path, geodesic: true, strokeColor: "#3b82f6", strokeOpacity: 0.8, strokeWeight: 4 })
        routeLine.setMap(googleMapRef.current)
      }

      if (path.length > 0) {
        const bounds = new googleMaps.LatLngBounds()
        path.forEach((p) => bounds.extend(p))
        googleMapRef.current.fitBounds(bounds)
      }
    }

    // If google is already available, load map, otherwise inject script
    if ((window as any).google && (window as any).google.maps) {
      loadMap()
      return
    }

    const scriptId = "google-maps-js"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`
      script.async = true
      script.defer = true
      script.onload = () => loadMap()
      document.head.appendChild(script)
    } else {
      // script exists but maybe not loaded yet
      const checkInterval = setInterval(() => {
        if ((window as any).google && (window as any).google.maps) {
          clearInterval(checkInterval)
          loadMap()
        }
      }, 200)
    }
  }, [hasCoords, optimizedRoute, mapCenter, zoom])

  const calculateRouteSummary = () => {
    const totalDistance = optimizedRoute.reduce((sum: number, order: any) => sum + (order.distance || 0), 0)
    const estimatedTime = Math.ceil((totalDistance / 30) * 60) // 30 km/h average speed
    return { totalDistance, estimatedTime }
  }

  const { totalDistance, estimatedTime } = calculateRouteSummary()

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card className="bg-white border-slate-200 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-slate-900">Delivery Route Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
            {/* If an API key is present, render the Google Map container (markers appear only when coords exist); otherwise show SVG placeholder */}
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
              <div ref={mapRef} className="w-full h-full" />
            ) : (
              <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
              {/* Background */}
              <rect width="800" height="400" fill="#f0f9ff" />

              {/* Grid lines */}
              <g stroke="#e2e8f0" strokeWidth="1" opacity="0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="400" />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 100} x2="800" y2={i * 100} />
                ))}
              </g>

              {/* Route lines */}
              {optimizedRoute.length > 1 && (
                <g stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.6">
                  {optimizedRoute.map((order, index) => {
                    if (index === optimizedRoute.length - 1) return null
                    const x1 = 100 + ((index * 150) % 600)
                    const y1 = 100 + Math.floor(index / 4) * 100
                    const x2 = 100 + (((index + 1) * 150) % 600)
                    const y2 = 100 + Math.floor((index + 1) / 4) * 100
                    return <line key={`route${index}`} x1={x1} y1={y1} x2={x2} y2={y2} />
                  })}
                </g>
              )}

              {/* Order markers */}
              {optimizedRoute.map((order, index) => {
                const x = 100 + ((index * 150) % 600)
                const y = 100 + Math.floor(index / 4) * 100
                const isUrgent = new Date().getTime() - new Date(order.created_at).getTime() > 30 * 60000

                return (
                  <g key={order.id}>
                    {/* Marker circle */}
                    <circle cx={x} cy={y} r="20" fill={isUrgent ? "#ef4444" : "#3b82f6"} opacity="0.9" />
                    {/* Priority number */}
                    <text x={x} y={y} textAnchor="middle" dy="0.3em" fill="white" fontSize="14" fontWeight="bold">
                      {index + 1}
                    </text>
                  </g>
                )
              })}

              {/* Start point */}
              {optimizedRoute.length > 0 && (
                <g>
                  <circle cx="100" cy="100" r="25" fill="none" stroke="#22c55e" strokeWidth="3" />
                  <text x="100" y="105" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">
                    START
                  </text>
                </g>
              )}
              </svg>
            )}

            {/* No orders message */}
              {optimizedRoute.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5">
                <MapPin className="w-12 h-12 text-slate-400 mb-2" />
                <p className="text-slate-600">No orders to display on map</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Route Summary */}
      {optimizedRoute.length > 0 && (
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Optimized Route Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-600 mb-1">Total Distance</p>
                <p className="text-2xl font-bold text-blue-600">{totalDistance.toFixed(1)} km</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-slate-600 mb-1">Estimated Time</p>
                <p className="text-2xl font-bold text-orange-600">{formatTime(estimatedTime)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-slate-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-green-600">{optimizedRoute.length}</p>
              </div>
            </div>

            {/* Route sequence */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900 mb-3">Delivery Sequence:</p>
              <div className="flex flex-wrap gap-2">
                {optimizedRoute.map((order, index) => {
                  const isUrgent = new Date().getTime() - new Date(order.created_at).getTime() > 30 * 60000
                  return (
                    <Badge
                      key={order.id}
                      className={`${
                        isUrgent
                          ? "bg-red-100 text-red-800 border-red-300"
                          : "bg-blue-100 text-blue-800 border-blue-300"
                      } border flex items-center gap-1`}
                    >
                      {index + 1}. {order.order_number}
                      {isUrgent && <Zap className="w-3 h-3" />}
                    </Badge>
                  )
                })}
              </div>
            </div>

            {/* Optimization info */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Route optimized using nearest neighbor algorithm. Follow the numbered sequence for most efficient
                delivery.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
