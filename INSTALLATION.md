# Installation Guide - Delivery Boy App v1

## Quick Start (5 minutes)

### 1. Extract the Project
\`\`\`bash
unzip delivery-app-v1.zip
cd delivery-app-v1
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

### 4. Open Browser
Visit `http://localhost:3000`

---

## Detailed Installation

### System Requirements
- **OS**: Windows, macOS, or Linux
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm/bun)
- **RAM**: 2GB minimum
- **Disk Space**: 500MB

### Step-by-Step Installation

#### Step 1: Install Node.js
If you don't have Node.js installed:

**Windows/macOS**:
1. Visit [nodejs.org](https://nodejs.org)
2. Download LTS version
3. Run the installer and follow prompts
4. Verify installation:
\`\`\`bash
node --version
npm --version
\`\`\`

**Linux (Ubuntu/Debian)**:
\`\`\`bash
sudo apt update
sudo apt install nodejs npm
\`\`\`

#### Step 2: Extract Project Files
\`\`\`bash
# Navigate to your projects folder
cd ~/projects

# Extract the ZIP file
unzip delivery-app-v1.zip

# Enter project directory
cd delivery-app-v1
\`\`\`

#### Step 3: Install Dependencies
\`\`\`bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install

# Or using bun
bun install
\`\`\`

This will install all required packages listed in `package.json`.

#### Step 4: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

You should see:
\`\`\`
> next dev

  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
\`\`\`

#### Step 5: Access the Application
Open your browser and go to: `http://localhost:3000`

---

## Troubleshooting

### Issue: "npm: command not found"
**Solution**: Node.js is not installed. Download from [nodejs.org](https://nodejs.org)

### Issue: "Port 3000 already in use"
**Solution**:
\`\`\`bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
\`\`\`

### Issue: "Module not found" errors
**Solution**:
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Issue: "Build fails with TypeScript errors"
**Solution**:
\`\`\`bash
# Clear Next.js cache
rm -rf .next
npm run build
\`\`\`

### Issue: "Slow performance"
**Solution**:
\`\`\`bash
# Use production build
npm run build
npm start
\`\`\`

---

## Available Scripts

\`\`\`bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
\`\`\`

---

## Environment Variables

Create a `.env.local` file in the root directory (optional):

\`\`\`env
# Example environment variables
NEXT_PUBLIC_APP_NAME=Delivery Boy App
NEXT_PUBLIC_API_URL=http://localhost:3000/api
\`\`\`

---

## Next Steps

1. **Explore the Dashboard**: Navigate through different tabs
2. **Test Features**: Try selecting zones, viewing orders, and tracking
3. **Customize**: Modify colors, zones, and mock data
4. **Integrate Backend**: Connect to your Supabase or API
5. **Deploy**: Push to Vercel or your preferred platform

---

## Getting Help

- Check the main [README.md](./README.md)
- Review component files for implementation details
- Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Check React docs: [react.dev](https://react.dev)

---

## Uninstallation

To remove the project:

\`\`\`bash
# Navigate out of project directory
cd ..

# Remove project folder
rm -rf delivery-app-v1

# Or on Windows
rmdir /s delivery-app-v1
\`\`\`

---

**Happy Coding! 🚀**
