# Setup & Configuration Guide

## Initial Setup

### 1. Project Structure Overview

\`\`\`
delivery-app-v1/
├── app/                    # Next.js app directory
├── components/             # React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static files
├── styles/                 # Global styles
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
\`\`\`

### 2. Configuration Files

#### `next.config.mjs`
\`\`\`javascript
// Handles Next.js configuration
- TypeScript error ignoring
- Image optimization settings
\`\`\`

#### `tsconfig.json`
\`\`\`json
// TypeScript configuration
- Path aliases (@/*)
- Compiler options
- Module resolution
\`\`\`

#### `package.json`
\`\`\`json
// Project metadata and dependencies
- Scripts for dev/build/start
- All npm packages
- Version information
\`\`\`

---

## Customization Guide

### Change App Title & Metadata

Edit `app/layout.tsx`:
\`\`\`typescript
export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
}
\`\`\`

### Change Color Scheme

Edit `app/globals.css`:
\`\`\`css
:root {
  --primary: oklch(0.205 0 0);      /* Change primary color */
  --accent: oklch(0.97 0 0);        /* Change accent color */
  --background: oklch(1 0 0);       /* Change background */
}
\`\`\`

### Add New Delivery Zones

Edit `components/delivery-dashboard.tsx`:
\`\`\`typescript
const ZONES = [
  { id: "zone-id", name: "Zone Name", pincode: "110001" },
  // Add more zones here
]
\`\`\`

### Modify Mock Data

Edit `components/delivery-dashboard.tsx`:
\`\`\`typescript
const MOCK_ORDERS = [
  {
    id: "1",
    order_number: "ORD-001",
    customer_name: "Name",
    // Modify fields as needed
  },
]
\`\`\`

---

## Integration Guide

### Connect to Supabase

1. **Install Supabase client**:
\`\`\`bash
npm install @supabase/supabase-js
\`\`\`

2. **Create `.env.local`**:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
\`\`\`

3. **Create Supabase client** (`lib/supabase.ts`):
\`\`\`typescript
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
\`\`\`

4. **Fetch orders**:
\`\`\`typescript
const { data: orders } = await supabase
  .from('orders')
  .select('*')
  .eq('status', 'pending')
\`\`\`

### Connect to Google Maps

1. **Get API Key**: [Google Cloud Console](https://console.cloud.google.com)

2. **Add to `.env.local`**:
\`\`\`env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
\`\`\`

3. **Add script to `app/layout.tsx`**:
\`\`\`typescript
<script 
  src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
/>
\`\`\`

4. **Use in components**:
\`\`\`typescript
const map = new google.maps.Map(mapElement, {
  center: { lat: 28.6139, lng: 77.209 },
  zoom: 13,
})
\`\`\`

---

## Development Tips

### Hot Reload
Changes to files automatically reload in browser during development.

### Debug Mode
Add console logs to track execution:
\`\`\`typescript
console.log("[v0] Debug message:", variable)
\`\`\`

### Component Testing
Test components in isolation by creating test files:
\`\`\`typescript
// components/order-card.test.tsx
import { render } from '@testing-library/react'
import OrderCard from './order-card'

test('renders order card', () => {
  render(<OrderCard order={mockOrder} />)
})
\`\`\`

### Performance Optimization
- Use React.memo for expensive components
- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component

---

## Deployment Checklist

- [ ] Update metadata in `app/layout.tsx`
- [ ] Configure environment variables
- [ ] Test all features locally
- [ ] Build project: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Push to GitHub
- [ ] Deploy to Vercel/hosting platform
- [ ] Test deployed version
- [ ] Set up monitoring/analytics

---

## Common Tasks

### Add a New Page

1. Create file: `app/new-page/page.tsx`
2. Add component:
\`\`\`typescript
export default function NewPage() {
  return <div>New Page</div>
}
\`\`\`

### Add a New Component

1. Create file: `components/new-component.tsx`
2. Export component:
\`\`\`typescript
export default function NewComponent() {
  return <div>Component</div>
}
\`\`\`

### Add Styling

Use Tailwind CSS classes:
\`\`\`typescript
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Styled content
</div>
\`\`\`

### Add Icons

Use Lucide React:
\`\`\`typescript
import { MapPin, Clock, Navigation } from 'lucide-react'

<MapPin className="w-4 h-4" />
\`\`\`

---

## Performance Monitoring

### Check Build Size
\`\`\`bash
npm run build
# Check .next/static folder size
\`\`\`

### Lighthouse Audit
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit
4. Fix issues

---

## Security Best Practices

- Never commit `.env.local` to git
- Use environment variables for sensitive data
- Validate user input on backend
- Use HTTPS in production
- Keep dependencies updated: `npm update`

---

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Last Updated**: October 2025
