// app/api/orders/route.ts
import { NextResponse } from "next/server"

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = 
  process.env.SUPABASE_SERVICE_KEY || 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const ORDERS_TABLE = process.env.SUPABASE_ORDERS_TABLE || "orders"
const ORDER_ITEMS_TABLE = process.env.SUPABASE_ORDER_ITEMS_TABLE || "order_items"

// Transform order data to match expected format
function transformOrder(order: any) {
  return {
    ...order,
    // Map fields to expected names
    delivery_zip_code: order.delivery_zip_code || order.zip_code,
    delivery_address: order.delivery_address || order.address,
    delivery_city: order.delivery_city || order.city,
    delivery_state: order.delivery_state || order.state,
    customer_name: order.customer_name || order.name,
    customer_phone: order.customer_phone || order.phone,
    customer_email: order.customer_email || order.email,
    order_number: order.order_number || order.id,
    // Add distance if not present (you can calculate this or set default)
    distance: order.distance || Math.random() * 10 + 1, // Random for now, replace with actual calculation
  }
}

async function proxyGetOrders() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error("Supabase credentials missing")
  }

  const url = `${SUPABASE_URL}/rest/v1/${ORDERS_TABLE}?select=*&order=created_at.desc`
  
  console.log('🔍 Fetching from Supabase:', url)
  
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      Accept: "application/json",
    },
    cache: 'no-store',
  })

  console.log('📡 Supabase response status:', res.status)
  
  return res
}

async function proxyCreateOrder(payload: unknown) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error("Supabase credentials missing")
  }

  const p = payload as any
  const orderBody = p.order || {}
  const items = p.items || []

  // Insert order
  const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/${ORDERS_TABLE}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(orderBody),
  })

  if (!orderRes.ok) {
    const txt = await orderRes.text()
    console.error('❌ Order creation failed:', txt)
    return { ok: false, status: orderRes.status, text: txt }
  }

  const inserted = await orderRes.json()
  const createdOrder = Array.isArray(inserted) ? inserted[0] : inserted

  // Insert order_items if provided
  if (items.length > 0 && createdOrder?.id) {
    const itemsWithOrder = items.map((it: any) => ({ ...it, order_id: createdOrder.id }))
    
    const itemsRes = await fetch(`${SUPABASE_URL}/rest/v1/${ORDER_ITEMS_TABLE}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(itemsWithOrder),
    })

    if (!itemsRes.ok) {
      const txt = await itemsRes.text()
      console.error('❌ Order items creation failed:', txt)
      return { ok: false, status: itemsRes.status, text: txt }
    }
  }

  console.log('✅ Order created successfully:', createdOrder.id)
  return { ok: true, order: transformOrder(createdOrder) }
}

export async function GET() {
  console.log('📥 GET /api/orders called')
  
  // Check configuration
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Supabase not configured')
    console.error('SUPABASE_URL:', SUPABASE_URL ? '✓ Set' : '✗ Missing')
    console.error('SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? '✓ Set' : '✗ Missing')
    
    return NextResponse.json(
      { 
        error: "Supabase not configured on server",
        details: {
          supabase_url: !!SUPABASE_URL,
          supabase_key: !!SUPABASE_SERVICE_KEY
        }
      }, 
      { status: 500 }
    )
  }

  try {
    const res = await proxyGetOrders()
    const data = await res.json()
    
    console.log('✅ Orders fetched:', Array.isArray(data) ? data.length : 'invalid data')
    
    if (!res.ok) {
      console.error('❌ Supabase error:', data)
      return NextResponse.json({ error: data }, { status: res.status })
    }

    // Transform all orders to match expected format
    const transformedData = Array.isArray(data) ? data.map(transformOrder) : []
    
    console.log('🔄 Transformed orders:', transformedData.length)
    if (transformedData.length > 0) {
      console.log('📦 Sample transformed order:', transformedData[0])
    }

    return NextResponse.json(transformedData, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ Exception in GET /api/orders:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(request: Request) {
  console.log('📥 POST /api/orders called')
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Supabase not configured')
    return NextResponse.json({ error: "Supabase not configured on server" }, { status: 500 })
  }

  try {
    const payload = await request.json()
    console.log('📦 Order payload received')
    
    const result = await proxyCreateOrder(payload)
    
    if (!result.ok) {
      return NextResponse.json({ error: result.text }, { status: result.status || 500 })
    }

    return NextResponse.json(result.order || { success: true }, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ Exception in POST /api/orders:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}