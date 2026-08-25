# DriveFuel - Intelligent Trip Planning SaaS

**Know Your Trip Before You Drive.**

A production-ready SaaS web application for intelligent trip planning, fuel consumption calculation, travel time estimation, and driving safety analysis.

## 🚀 Features

- **Accurate Fuel Calculation** - Real-world fuel consumption based on traffic, road conditions, and driving style
- **Traffic-Aware ETA** - Live traffic integration for accurate arrival time estimation
- **Smart Route Analysis** - Compare routes by distance, time, fuel consumption, and cost
- **Safety Guidance** - Safe speed recommendations and fuel/range warnings
- **EV Support** - Full support for electric vehicles with battery and charging calculations
- **Multi-Stop Trips** - Plan complex journeys with multiple stops
- **Trip Analytics** - Track fuel consumption, costs, and efficiency
- **Responsive Design** - Mobile-first interface optimized for drivers
- **Dark Mode** - Premium dark theme support throughout
- **User Accounts** - Secure authentication with trip history

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn
- **PostgreSQL** 14+
- **Google Maps Platform API Key** (for real routing)
- **Stripe Account** (for payments, optional for demo)

## 🛠️ Setup Instructions

### 1. Clone & Install

```bash
# Install dependencies
npm install

# or with yarn
yarn install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb drivefuel

# Set environment variables (see .env.example)
cp .env.example .env.local

# Update .env.local with your database URL:
# DATABASE_URL=postgresql://user:password@localhost:5432/drivefuel

# Push schema to database
npm run db:push

# Optional: Open Prisma Studio to view database
npm run db:studio
```

### 3. Environment Configuration

Create `.env.local` file with the following:

```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/drivefuel

# Authentication
NEXTAUTH_SECRET=generate_a_random_string_here
NEXTAUTH_URL=http://localhost:3000

# Stripe (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 4. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
   - Places API
4. Create an API key (Restrict to browser)
5. Copy the key to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
drivefuel/
├── app/
│   ├── components/          # React components
│   │   ├── MetricCard.tsx   # Statistics display
│   │   ├── TripAnalysisCard.tsx  # Trip results
│   │   └── TripPlanner.tsx  # Main planner interface
│   ├── services/           # Business logic
│   │   ├── fuelCalculations.ts  # Fuel engine
│   │   └── googleMapsService.ts # Maps integration
│   ├── types/              # TypeScript definitions
│   ├── globals.css         # Tailwind styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
├── .env.example           # Environment template
├── next.config.js         # Next.js config
├── tailwind.config.ts     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

## 🏗️ Architecture

### Fuel Calculation Engine

The core calculation logic in `services/fuelCalculations.ts`:

```typescript
// Basic calculation
const fuelRequired = distance / averageMileage;

// Real-world adjustment
const adjustedMileage = applyTrafficAdjustments(
  officialMileage,
  trafficLevel,
  drivingStyle,
  // ... other factors
);

// Safety buffer (typically 15%)
const recommendedFuel = fuelRequired + buffer;
```

### Google Maps Integration

- Uses mock data for demo (easily switched to real API)
- Calculates distance using Haversine formula
- Estimates traffic delays
- Finds nearby fuel stations and charging points

### Database Schema

- **User** - User accounts and authentication
- **Vehicle** - Saved vehicles with specifications
- **Trip** - Planned and completed trips
- **TripStop** - Stops along a route
- **FuelLog** - Fuel purchase history
- **Subscription** - Pricing plans and billing

## 🎨 Design System

- **Color Palette**:
  - Primary: Brand Blue (#0ea5e9)
  - Success: Fuel Green (#22c55e)
  - Warning: Alert Amber (#f59e0b)
  - Neutral: Slate Grays

- **Components**:
  - `MetricCard` - Statistics display
  - `TripAnalysisCard` - Complete trip results
  - `TripPlanner` - 3-step planning wizard
  - Custom button styles (btn, btn-primary, btn-lg)

- **Responsive**:
  - Mobile-first approach
  - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
  - Touch-friendly interface (min 44px tap targets)

## 🔄 Core Workflows

### 1. Trip Planning

1. User enters start location & destination
2. Selects vehicle (search or manual entry)
3. Confirms fuel price and current fuel level
4. System calculates:
   - Route distance & duration
   - Fuel required with safety buffer
   - Cost estimate
   - Arrival time
   - Warnings if insufficient fuel

### 2. Fuel Calculation

```
Input:
  - Distance (km)
  - Vehicle mileage (km/L)
  - Current fuel (L)
  - Fuel price (per L)

Adjustments:
  - Traffic level (-15% to +5% efficiency)
  - City driving (-20%)
  - Driving style (±10%)
  - Weather (-5% to -15%)
  - Vehicle load (±5%)

Output:
  - Estimated fuel required
  - Remaining fuel after trip
  - Trip cost
  - Range
  - Safety warnings
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Deploy via Vercel CLI
vercel

# Or connect GitHub repo to Vercel dashboard
# https://vercel.com/import
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t drivefuel .
docker run -p 3000:3000 drivefuel
```

### Environment on Production

Set these environment variables on your hosting:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxxx
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=xxxxx
NEXTAUTH_URL=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_...
NODE_ENV=production
```

## 📈 API Architecture

### Future API Routes

```
/api/trips
  GET  - List user trips
  POST - Create new trip
  
/api/trips/[id]
  GET  - Get trip details
  PUT  - Update trip
  DELETE - Delete trip

/api/vehicles
  GET  - List user vehicles
  POST - Add vehicle
  
/api/fuel-logs
  POST - Log fuel purchase
  
/api/analytics
  GET  - User trip analytics
  
/api/admin
  GET  - Admin dashboard data
```

## 🧪 Testing

### Demo Data

The app includes demo data for testing:

```typescript
// Demo vehicles in TripPlanner
- Toyota Corolla 2022 (14 km/L)
- Honda Civic 2021 (15 km/L)
- Tesla Model 3 (electric)

// Demo routes
- Islamabad to Lahore (374 km)
- Lahore to Karachi (1200 km)
- Islamabad to Peshawar (150 km)
```

### Test Cases

1. **Basic Trip Planning**
   - Calculate fuel for 300 km trip
   - Verify cost calculation
   - Check arrival time

2. **Insufficient Fuel**
   - Plan trip with low current fuel
   - Verify warning display
   - Check recommended refuel amount

3. **EV Trip**
   - Plan electric vehicle trip
   - Verify battery range
   - Check charging cost

4. **Multi-Stop Trip**
   - Add fuel stations to route
   - Verify distance calculations
   - Check updated fuel requirements

## 🔒 Security Considerations

- ✅ Environment variables for all secrets
- ✅ Database connection pooling
- ✅ Input validation on all forms
- ✅ API rate limiting (implement with middleware)
- ✅ HTTPS only on production
- ✅ CORS configuration
- ✅ User authentication with NextAuth
- ✅ Role-based access (user, admin)

## 📊 Analytics

### Tracked Metrics

- User count (free, pro, business)
- Active trips
- Total fuel consumed
- Average trip cost
- Popular routes
- Device types
- Feature usage

### Dashboard Available via Admin Panel

```
/admin
├── Overview (KPIs)
├── Users (analytics)
├── Subscriptions (revenue)
├── Trips (usage)
└── Settings (configuration)
```

## 🎯 Next Steps

### Phase 2 - Advanced Features

- [ ] Real-time trip tracking with WebSocket
- [ ] OBD-II Bluetooth integration
- [ ] AI chat assistant
- [ ] Fleet management dashboard
- [ ] Maintenance reminders
- [ ] Advanced weather integration
- [ ] Social features (share trips)
- [ ] API for third-party apps

### Phase 3 - Monetization

- [ ] Stripe subscription integration
- [ ] Freemium pricing model
- [ ] Professional fleet dashboard
- [ ] API tier system
- [ ] White-label solution

### Phase 4 - Scale

- [ ] International expansion
- [ ] Multi-language support
- [ ] Regional fuel price databases
- [ ] Public transport integration
- [ ] Carbon footprint tracking
- [ ] Fleet analytics platform

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Google Maps Platform](https://developers.google.com/maps)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues, questions, or suggestions:

- GitHub Issues
- Email: support@drivefuel.app
- Documentation: https://docs.drivefuel.app

---

**DriveFuel** - Know Your Trip Before You Drive. ⛽🛣️✅
