// "use client"
// import { useState, useEffect } from "react"
// import useOrders from "@/lib/useOrders"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { MapPin, Package, Navigation, ArrowUpDown } from "lucide-react"
// import OrderCard from "./order-card"
// import DeliveryDetailsModal from "./delivery-details-modal"

// // Mock zones/areas
// const ZONES = [
//   { id: "rajiv-chowk", name: "Rajiv Chowk", pincode: "110001" },
//   { id: "kashmere-gate", name: "Kashmere Gate", pincode: "110006" },
//   { id: "b-block-sanik", name: "B-Block Sanik Farm", pincode: "110041" },
//   { id: "connaught-place", name: "Connaught Place", pincode: "110001" },

// ]

// // Orders are fetched from Supabase via the `useOrders` hook.

// export default function DeliveryDashboard({ onNavigateToMap }: { onNavigateToMap?: (order: any) => void }) {
//   const [selectedZone, setSelectedZone] = useState("rajiv-chowk")
//   const [pincodeFilter, setPincodeFilter] = useState("")
//   const { orders = [], loading, error, refresh } = useOrders()
//   const [selectedOrder, setSelectedOrder] = useState<any>(null)
//   const [showDetailsModal, setShowDetailsModal] = useState(false)
//   const [sortBy, setSortBy] = useState("distance")
//   const [deliveryMode, setDeliveryMode] = useState<"single" | "multi">("multi")

//   // Auto-select first order for details when orders for the zone load
//   useEffect(() => {
//     if (!loading && orders.length > 0) {
//       const zone = ZONES.find((z) => z.id === selectedZone)
//       const zoneOrders = (orders as any[]).filter((o: any) => {
//         // Add null check for delivery_zip_code
//         return o.delivery_zip_code && o.delivery_zip_code === zone?.pincode
//       })
//       if (zoneOrders.length > 0) setSelectedOrder(zoneOrders[0] as any)
//     }
//   }, [loading, orders, selectedZone])

//   // Filter orders by zone and pincode
//   const filteredOrders = (orders as any[]).filter((order: any) => {
//     // In single-person mode, show ALL pending orders sorted by distance
//     if (deliveryMode === "single") {
//       // Only filter by pincode if specified, otherwise show all
//       const matchesPincode = !pincodeFilter || (order.delivery_zip_code && order.delivery_zip_code.includes(pincodeFilter))
//       return matchesPincode
//     }
    
//     // In multi-person mode, filter by selected zone
//     const zone = ZONES.find((z) => z.id === selectedZone)
//     const matchesZone = order.delivery_zip_code && order.delivery_zip_code === zone?.pincode
//     const matchesPincode = !pincodeFilter || (order.delivery_zip_code && order.delivery_zip_code.includes(pincodeFilter))
    
//     return matchesZone && matchesPincode
//   })

//   const sortedOrders = [...filteredOrders].sort((a: any, b: any) => {
//     // In single-person mode, always sort by optimized route (distance)
//     if (deliveryMode === "single") {
//       return (a.distance || 0) - (b.distance || 0)
//     }
    
//     // In multi-person mode, use selected sort option
//     switch (sortBy) {
//       case "distance":
//         return (a.distance || 0) - (b.distance || 0)
//       case "time":
//         return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//       case "amount":
//         return (b.total || 0) - (a.total || 0)
//       default:
//         return (a.distance || 0) - (b.distance || 0)
//     }
//   })

//   const handleSelectOrder = (order: any) => {
//     setSelectedOrder(order)
//     setShowDetailsModal(true)
//   }

//   const handleDeliveryComplete = (orderId: string) => {
//     // Optimistic: close modal and refresh list from server
//     setShowDetailsModal(false)
//     // If possible, select next pending order in the sorted list
//     const nextOrder = (sortedOrders as any[]).find((o: any) => o.id !== orderId && o.status === "pending")
//     if (nextOrder) {
//       setSelectedOrder(nextOrder)
//       setShowDetailsModal(true)
//     }
//     // Update status on server then refresh
//     ;(async () => {
//       try {
//         await fetch(`/api/orders/${orderId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ status: "delivered", updated_at: new Date().toISOString() }),
//         })
//       } catch {
//         // ignore - we'll refresh anyway
//       } finally {
//         refresh()
//       }
//     })()
//   }

//   const pendingCount = sortedOrders.filter((o: any) => o.status === "pending").length
//   const deliveredCount = (orders as any[]).filter((o: any) => o.status === "delivered").length
//   const totalDistance = sortedOrders.filter((o: any) => o.status === "pending").reduce((sum: number, o: any) => sum + (o.distance || 0), 0)

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Delivery Dashboard</h1>
//             <p className="text-slate-600">Loading live orders...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Delivery Dashboard</h1>
//             <p className="text-slate-600">Error loading orders: {String(error?.message || error)}</p>
//             <button onClick={() => refresh()} className="mt-4 px-3 py-2 bg-blue-600 text-white rounded">
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-4 md:mb-6">
//           <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-1">Delivery Dashboard</h1>
//         </div>

//         {/* Delivery Mode Selection - Moved to Top */}
//         <Card className="bg-white border-slate-200 mb-6">
//           <CardContent className="pt-6">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-sm font-medium text-slate-900 mb-2">Delivery Mode</h3>
//                 <Badge variant="outline" className="text-xs">
//                   {deliveryMode === "single" ? "Route Optimized" : "Multi-Person"}
//                 </Badge>
//               </div>
//               <Tabs value={deliveryMode} onValueChange={(v) => setDeliveryMode(v as "single" | "multi")} className="w-full">
//                 <TabsList className="grid grid-cols-2 w-full bg-slate-100">
//                   <TabsTrigger
//                     value="single"
//                     className="text-sm data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                   >
//                     <Package className="w-4 h-4 mr-2" />
//                     Single Person
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="multi"
//                     className="text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white"
//                   >
//                     <Navigation className="w-4 h-4 mr-2" />
//                     Multi Person
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>
//               {deliveryMode === "single" && (
//                 <p className="text-xs text-slate-600 bg-green-50 p-3 rounded-md border border-green-200">
//                   📍 All orders sorted by optimal route distance for efficient single-person delivery
//                 </p>
//               )}
//               {deliveryMode === "multi" && (
//                 <p className="text-xs text-slate-600 bg-purple-50 p-3 rounded-md border border-purple-200">
//                   👥 View orders by zone. Select a delivery zone below to see orders for that area
//                 </p>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Stats - Compact for Mobile */}
//         <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
//           <Card className="bg-white border-slate-200">
//             <CardContent className="p-3 md:pt-6">
//               <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
//                 <div className="text-center md:text-left">
//                   <p className="text-xs md:text-sm text-slate-600 mb-1">Pending Order</p>
//                   <p className="text-xl md:text-3xl font-bold text-slate-900">{pendingCount}</p>
//                 </div>
//                 <Package className="w-5 h-5 md:w-10 md:h-10 text-blue-500 mt-1 md:mt-0" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white border-slate-200">
//             <CardContent className="p-3 md:pt-6">
//               <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
//                 <div className="text-center md:text-left">
//                   <p className="text-xs md:text-sm text-slate-600 mb-1">Completed Today</p>
//                   <p className="text-xl md:text-3xl font-bold text-slate-900">{deliveredCount}</p>
//                 </div>
//                 <Navigation className="w-5 h-5 md:w-10 md:h-10 text-green-500 mt-1 md:mt-0" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white border-slate-200">
//             <CardContent className="p-3 md:pt-6">
//               <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
//                 <div className="text-center md:text-left">
//                   <p className="text-xs md:text-sm text-slate-600 mb-1">Remaining Distance</p>
//                   <p className="text-xl md:text-3xl font-bold text-slate-900">{totalDistance.toFixed(1)}<span className="text-sm md:text-base">km</span></p>
//                 </div>
//                 <MapPin className="w-5 h-5 md:w-10 md:h-10 text-orange-500 mt-1 md:mt-0" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Zone Selection and Filter - Only shown in Multi-Person Mode */}
//         {deliveryMode === "multi" && (
//           <Card className="bg-white border-slate-200 mb-6">
//             <CardHeader>
//               <CardTitle className="text-slate-900">Select Delivery Zone</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <Tabs value={selectedZone} onValueChange={setSelectedZone} className="w-full">
//                   <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-slate-100">
//                     {ZONES.map((zone) => (
//                       <TabsTrigger
//                         key={zone.id}
//                         value={zone.id}
//                         className="text-xs md:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white"
//                       >
//                         {zone.name}
//                       </TabsTrigger>
//                     ))}
//                   </TabsList>
//                 </Tabs>

//                 <div className="flex gap-2 flex-wrap">
//                   <Input
//                     placeholder="Filter by pincode..."
//                     value={pincodeFilter}
//                     onChange={(e) => setPincodeFilter(e.target.value)}
//                     className="border-slate-300 flex-1 min-w-[200px]"
//                   />
//                   <Button variant="outline" onClick={() => setPincodeFilter("")} className="border-slate-300">
//                     Clear
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Orders List with Sorting */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div className="flex items-center gap-2">
//               <h2 className="text-lg md:text-xl font-bold text-slate-900">
//                 {deliveryMode === "single" ? "All Orders (Route Optimized)" : `Orders for ${ZONES.find((z) => z.id === selectedZone)?.name}`}
//               </h2>
//               <Badge className="bg-blue-100 text-blue-800 border-blue-300">{sortedOrders.length} orders</Badge>
//             </div>
//             {deliveryMode === "multi" && (
//               <div className="flex items-center gap-2">
//                 <ArrowUpDown className="w-4 h-4 text-slate-600" />
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="distance">Sort by Distance</option>
//                   <option value="time">Sort by Order Time</option>
//                   <option value="amount">Sort by Amount</option>
//                 </select>
//               </div>
//             )}
//             {deliveryMode === "single" && (
//               <Badge className="bg-green-100 text-green-800 border-green-300 text-xs md:text-sm">
//                 🚀 Optimized Route
//               </Badge>
//             )}
//           </div>

//           {sortedOrders.length === 0 ? (
//             <Card className="bg-white border-slate-200">
//               <CardContent className="pt-12 pb-12 text-center">
//                 <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
//                 <p className="text-slate-600">No orders available for this zone</p>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {sortedOrders.map((order, index) => (
//                 <OrderCard
//                   key={order.id}
//                   order={order}
//                   priority={index + 1}
//                       onSelect={() => handleSelectOrder(order)}
//                       onNavigate={() => onNavigateToMap && onNavigateToMap(order)}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delivery Details Modal */}
//       {selectedOrder && (
//         <DeliveryDetailsModal
//           order={selectedOrder}
//           isOpen={showDetailsModal}
//           onClose={() => setShowDetailsModal(false)}
//           onDeliveryComplete={() => handleDeliveryComplete(selectedOrder.id)}
//         />
//       )}
//     </div>
//   )
// }





"use client"
import { useState, useEffect } from "react"
import useOrders from "@/lib/useOrders"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, Navigation, ArrowUpDown, User, LogOut, ChevronDown } from "lucide-react"
import OrderCard from "./order-card"
import DeliveryDetailsModal from "./delivery-details-modal"

// Mock zones/areas
const ZONES = [
  { id: "rajiv-chowk", name: "Rajiv Chowk", pincode: "110001" },
  { id: "kashmere-gate", name: "Kashmere Gate", pincode: "110006" },
  { id: "b-block-sanik", name: "B-Block Sanik Farm", pincode: "110041" },
  { id: "connaught-place", name: "Connaught Place", pincode: "110001" },
]

export default function DeliveryDashboard({ 
  user, 
  onLogout,
  onNavigateToMap 
}: { 
  user: any
  onLogout?: () => void
  onNavigateToMap?: (order: any) => void 
}) {
  const [selectedZone, setSelectedZone] = useState("rajiv-chowk")
  const [pincodeFilter, setPincodeFilter] = useState("")
  const { orders = [], loading, error, refresh } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [sortBy, setSortBy] = useState("distance")
  const [deliveryMode, setDeliveryMode] = useState<"single" | "multi">("multi")
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Auto-select first order for details when orders for the zone load
  useEffect(() => {
    if (!loading && orders.length > 0) {
      const zone = ZONES.find((z) => z.id === selectedZone)
      const zoneOrders = (orders as any[]).filter((o: any) => {
        return o.delivery_zip_code && o.delivery_zip_code === zone?.pincode
      })
      if (zoneOrders.length > 0) setSelectedOrder(zoneOrders[0] as any)
    }
  }, [loading, orders, selectedZone])

  // Filter orders by zone and pincode
  const filteredOrders = (orders as any[]).filter((order: any) => {
    if (deliveryMode === "single") {
      const matchesPincode = !pincodeFilter || (order.delivery_zip_code && order.delivery_zip_code.includes(pincodeFilter))
      return matchesPincode
    }
    
    const zone = ZONES.find((z) => z.id === selectedZone)
    const matchesZone = order.delivery_zip_code && order.delivery_zip_code === zone?.pincode
    const matchesPincode = !pincodeFilter || (order.delivery_zip_code && order.delivery_zip_code.includes(pincodeFilter))
    
    return matchesZone && matchesPincode
  })

  const sortedOrders = [...filteredOrders].sort((a: any, b: any) => {
    if (deliveryMode === "single") {
      return (a.distance || 0) - (b.distance || 0)
    }
    
    switch (sortBy) {
      case "distance":
        return (a.distance || 0) - (b.distance || 0)
      case "time":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case "amount":
        return (b.total || 0) - (a.total || 0)
      default:
        return (a.distance || 0) - (b.distance || 0)
    }
  })

  const handleSelectOrder = (order: any) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const handleDeliveryComplete = (orderId: string) => {
    setShowDetailsModal(false)
    const nextOrder = (sortedOrders as any[]).find((o: any) => o.id !== orderId && o.status === "pending")
    if (nextOrder) {
      setSelectedOrder(nextOrder)
      setShowDetailsModal(true)
    }
    ;(async () => {
      try {
        await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "delivered", updated_at: new Date().toISOString() }),
        })
      } catch {
        // ignore
      } finally {
        refresh()
      }
    })()
  }

  const handleLogout = () => {
    setShowProfileMenu(false)
    onLogout?.()
  }

  const pendingCount = sortedOrders.filter((o: any) => o.status === "pending").length
  const deliveredCount = (orders as any[]).filter((o: any) => o.status === "delivered").length
  const totalDistance = sortedOrders.filter((o: any) => o.status === "pending").reduce((sum: number, o: any) => sum + (o.distance || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Delivery Dashboard</h1>
            <p className="text-slate-600">Loading live orders...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Delivery Dashboard</h1>
            <p className="text-slate-600">Error loading orders: {String(error?.message || error)}</p>
            <button onClick={() => refresh()} className="mt-4 px-3 py-2 bg-blue-600 text-white rounded">
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Profile */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-1">Delivery Dashboard</h1>
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-900 hidden sm:inline">
                {user?.name?.split(" ")[0]}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-blue-100">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-4 space-y-4">
                  <div className="space-y-3">
                    {/* Full Name */}
                    <div className="border-b border-slate-200 pb-3">
                      <p className="text-xs font-semibold text-slate-600 uppercase">Full Name</p>
                      <p className="text-sm text-slate-900 font-medium mt-1">{user?.name}</p>
                    </div>

                    {/* Email */}
                    <div className="border-b border-slate-200 pb-3">
                      <p className="text-xs font-semibold text-slate-600 uppercase">Email Address</p>
                      <p className="text-sm text-slate-900 font-medium mt-1">{user?.email}</p>
                    </div>

                    {/* Phone */}
                    {user?.phone && (
                      <div className="border-b border-slate-200 pb-3">
                        <p className="text-xs font-semibold text-slate-600 uppercase">Phone Number</p>
                        <p className="text-sm text-slate-900 font-medium mt-1">{user?.phone}</p>
                      </div>
                    )}

                    {/* Street Address */}
                    {user?.address && (
                      <div className="border-b border-slate-200 pb-3">
                        <p className="text-xs font-semibold text-slate-600 uppercase">Street Address</p>
                        <p className="text-sm text-slate-900 font-medium mt-1">{user?.address}</p>
                      </div>
                    )}

                    {/* City */}
                    {user?.city && (
                      <div className="border-b border-slate-200 pb-3">
                        <p className="text-xs font-semibold text-slate-600 uppercase">City</p>
                        <p className="text-sm text-slate-900 font-medium mt-1">{user?.city}</p>
                      </div>
                    )}

                    {/* Pincode */}
                    {user?.pincode && (
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase">Pincode</p>
                        <p className="text-sm text-slate-900 font-medium mt-1">{user?.pincode}</p>
                      </div>
                    )}
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-lg transition-colors border border-red-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Close profile menu when clicking outside */}
        {showProfileMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowProfileMenu(false)}
          />
        )}

        {/* Delivery Mode Selection */}
        <Card className="bg-white border-slate-200 mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-900 mb-2">Delivery Mode</h3>
                <Badge variant="outline" className="text-xs">
                  {deliveryMode === "single" ? "Route Optimized" : "Multi-Person"}
                </Badge>
              </div>
              <Tabs value={deliveryMode} onValueChange={(v) => setDeliveryMode(v as "single" | "multi")} className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-slate-100">
                  <TabsTrigger
                    value="single"
                    className="text-sm data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Single Person
                  </TabsTrigger>
                  <TabsTrigger
                    value="multi"
                    className="text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Multi Person
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {deliveryMode === "single" && (
                <p className="text-xs text-slate-600 bg-green-50 p-3 rounded-md border border-green-200">
                  📍 All orders sorted by optimal route distance for efficient single-person delivery
                </p>
              )}
              {deliveryMode === "multi" && (
                <p className="text-xs text-slate-600 bg-purple-50 p-3 rounded-md border border-purple-200">
                  👥 View orders by zone. Select a delivery zone below to see orders for that area
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-3 md:pt-6">
              <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
                <div className="text-center md:text-left">
                  <p className="text-xs md:text-sm text-slate-600 mb-1">Pending Order</p>
                  <p className="text-xl md:text-3xl font-bold text-slate-900">{pendingCount}</p>
                </div>
                <Package className="w-5 h-5 md:w-10 md:h-10 text-blue-500 mt-1 md:mt-0" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-3 md:pt-6">
              <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
                <div className="text-center md:text-left">
                  <p className="text-xs md:text-sm text-slate-600 mb-1">Completed Today</p>
                  <p className="text-xl md:text-3xl font-bold text-slate-900">{deliveredCount}</p>
                </div>
                <Navigation className="w-5 h-5 md:w-10 md:h-10 text-green-500 mt-1 md:mt-0" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-3 md:pt-6">
              <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
                <div className="text-center md:text-left">
                  <p className="text-xs md:text-sm text-slate-600 mb-1">Remaining Distance</p>
                  <p className="text-xl md:text-3xl font-bold text-slate-900">{totalDistance.toFixed(1)}<span className="text-sm md:text-base">km</span></p>
                </div>
                <MapPin className="w-5 h-5 md:w-10 md:h-10 text-orange-500 mt-1 md:mt-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone Selection and Filter */}
        {deliveryMode === "multi" && (
          <Card className="bg-white border-slate-200 mb-6">
            <CardHeader>
              <CardTitle className="text-slate-900">Select Delivery Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Tabs value={selectedZone} onValueChange={setSelectedZone} className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-slate-100">
                    {ZONES.map((zone) => (
                      <TabsTrigger
                        key={zone.id}
                        value={zone.id}
                        className="text-xs md:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                      >
                        {zone.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="flex gap-2 flex-wrap">
                  <Input
                    placeholder="Filter by pincode..."
                    value={pincodeFilter}
                    onChange={(e) => setPincodeFilter(e.target.value)}
                    className="border-slate-300 flex-1 min-w-[200px]"
                  />
                  <Button variant="outline" onClick={() => setPincodeFilter("")} className="border-slate-300">
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                {deliveryMode === "single" ? "All Orders (Route Optimized)" : `Orders for ${ZONES.find((z) => z.id === selectedZone)?.name}`}
              </h2>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">{sortedOrders.length} orders</Badge>
            </div>
            {deliveryMode === "multi" && (
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="distance">Sort by Distance</option>
                  <option value="time">Sort by Order Time</option>
                  <option value="amount">Sort by Amount</option>
                </select>
              </div>
            )}
            {deliveryMode === "single" && (
              <Badge className="bg-green-100 text-green-800 border-green-300 text-xs md:text-sm">
                🚀 Optimized Route
              </Badge>
            )}
          </div>

          {sortedOrders.length === 0 ? (
            <Card className="bg-white border-slate-200">
              <CardContent className="pt-12 pb-12 text-center">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No orders available for this zone</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedOrders.map((order, index) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  priority={index + 1}
                  onSelect={() => handleSelectOrder(order)}
                  onNavigate={() => onNavigateToMap && onNavigateToMap(order)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delivery Details Modal */}
      {selectedOrder && (
        <DeliveryDetailsModal
          order={selectedOrder}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onDeliveryComplete={() => handleDeliveryComplete(selectedOrder.id)}
        />
      )}
    </div>
  )
}