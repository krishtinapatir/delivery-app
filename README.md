# Delivery Boy App - v1

A comprehensive delivery management system built with Next.js, React, and TypeScript. This app provides delivery boys with an intuitive dashboard to manage deliveries, optimize routes, and track orders in real-time.

## Features

### 🚚 Delivery Dashboard
- **Zone-based Order Management**: Select delivery zones (Rajiv Chowk, Kashmere Gate, B-Block Sanik Farm, etc.)
- **Smart Filtering**: Filter orders by pincode
- **Order Sorting**: Sort by distance, order time, or amount
- **Real-time Stats**: View pending deliveries, completed orders, and remaining distance
- **Priority Indicators**: Urgent orders highlighted for orders older than 30 minutes

### 🗺️ Route Optimization
- **Optimized Route Planning**: Uses nearest neighbor algorithm for efficient delivery routes
- **Visual Route Map**: SVG-based map visualization with delivery sequence
- **Distance Calculation**: Automatic distance calculation and ETA estimation
- **Route Summary**: Total distance, estimated time, and delivery sequence

### 📍 Live Tracking
- **Real-time Location Updates**: Simulated GPS tracking with location markers
- **Status Timeline**: Detailed delivery timeline with status updates
- **ETA Calculation**: Automatic ETA based on distance and average speed
- **Delivery Status**: Pending → In Progress → Nearby → Delivered

### 👥 Customer Tracking
- **Order Search**: Search orders by order number
- **Delivery Partner Info**: View delivery partner details and ratings
- **Timeline View**: Complete delivery timeline with timestamps
- **Contact Options**: Call or message delivery partner

### 📋 Delivery Details
- **Customer Information**: Full customer details and contact information
- **Location Details**: Delivery address with distance and ETA
- **Order Items**: Itemized order breakdown with pricing
- **Delivery Confirmation**: OTP verification, delivery notes, and photo upload

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Validation**: Zod
- **Language**: TypeScript

## Installation

### Prerequisites
- Node.js 18+ or higher
- npm, yarn, pnpm, or bun

### Step 1: Clone or Download the Project

\`\`\`bash
# If you have the ZIP file, extract it
unzip delivery-app-v1.zip
cd delivery-app-v1
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install

# Or using bun
bun install
\`\`\`

### Step 3: Run the Development Server

\`\`\`bash
# Using npm
npm run dev

# Or using yarn
yarn dev

# Or using pnpm
pnpm dev

# Or using bun
bun dev
\`\`\`

### Step 4: Open in Browser

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Project Structure

\`\`\`
delivery-app-v1/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main dashboard page
│   ├── globals.css             # Global styles
│   └── tracking/
│       └── page.tsx            # Customer tracking page
├── components/
│   ├── delivery-dashboard.tsx  # Main dashboard component
│   ├── order-card.tsx          # Order card component
│   ├── delivery-details-modal.tsx # Delivery details modal
│   ├── map-view.tsx            # Route optimization map
│   ├── live-tracking.tsx       # Live tracking component
│   ├── customer-tracking.tsx   # Customer tracking component
│   └── ui/                     # shadcn/ui components
├── hooks/
│   ├── use-mobile.ts           # Mobile detection hook
│   └── use-toast.ts            # Toast notification hook
├── lib/
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.mjs             # Next.js config
└── postcss.config.mjs          # PostCSS config
\`\`\`

## Usage

### Delivery Dashboard
1. Navigate to the home page (http://localhost:3000)
2. Select a delivery zone from the tabs
3. View all pending orders for that zone
4. Click "Start Delivery" on any order to view details
5. Complete delivery by filling in delivery notes and confirming

### Route Optimization
1. Click the "Map View" tab
2. View the optimized delivery route
3. See total distance and estimated time
4. Follow the numbered sequence for most efficient delivery

### Live Tracking
1. Click the "Live Tracking" tab
2. Click "Start Tracking" to begin simulated GPS tracking
3. View real-time location updates and status changes
4. Check the delivery timeline for all status updates

### Customer Tracking
1. Navigate to http://localhost:3000/tracking
2. Enter an order number (try: ORD-001 or ORD-002)
3. View order status, delivery partner info, and timeline

## Mock Data

The app uses mock data for demonstration. To integrate with a real backend:

1. **Replace mock orders** in `components/delivery-dashboard.tsx` with API calls
2. **Connect to Supabase** for real order data
3. **Integrate Google Maps API** for real map visualization
4. **Add real GPS tracking** using device geolocation API
5. **Implement WebSocket** for real-time updates

## Customization

### Change Colors
Edit the design tokens in `app/globals.css`:
\`\`\`css
--color-primary: #3b82f6;
--color-accent: #f97316;
--color-success: #22c55e;
\`\`\`

### Add New Zones
Edit the `ZONES` array in `components/delivery-dashboard.tsx`:
\`\`\`typescript
const ZONES = [
  { id: "zone-id", name: "Zone Name", pincode: "110001" },
  // Add more zones...
]
\`\`\`

### Modify Order Fields
Update the order interface in components to match your data structure.

## Building for Production

\`\`\`bash
# Build the app
npm run build

# Start production server
npm start
\`\`\`

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click "Deploy"

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean
- Heroku
- Railway

## API Integration Guide

### Connecting to Supabase

\`\`\`typescript
// Create a Supabase client
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Fetch orders
const { data: orders } = await supabase
  .from('orders')
  .select('*')
  .eq('status', 'pending')
\`\`\`

### Connecting to Google Maps API

\`\`\`typescript
// Add Google Maps script to layout.tsx
<script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`} />

// Use in components
const map = new google.maps.Map(mapElement, options)
\`\`\`

## Troubleshooting

### Port Already in Use
\`\`\`bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
\`\`\`

### Dependencies Issues
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Build Errors
\`\`\`bash
# Clear Next.js cache
rm -rf .next
npm run build
\`\`\`

## Future Enhancements

- [ ] Real GPS tracking integration
- [ ] WebSocket for real-time updates
- [ ] Google Maps API integration
- [ ] Supabase backend integration
- [ ] Push notifications
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Analytics dashboard
- [ ] Performance metrics

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Built with**: Next.js 16, React 19, TypeScript, Tailwind CSS
