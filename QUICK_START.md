# DriveFuel Quick Start Guide

Get DriveFuel running locally in 5 minutes.

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Setup Environment (2 min)

Create `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add:

```env
# Get from Google Cloud Console
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# Local database
DATABASE_URL=postgresql://postgres:password@localhost:5432/drivefuel

# Generate a random secret
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## Step 3: Setup Database (1 min)

```bash
# Create the database
createdb drivefuel

# Push schema
npm run db:push
```

## Step 4: Run Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 What to Try First

1. **Homepage** - See the beautiful landing page
2. **Plan a Trip** - Click "Plan My Trip" button
3. **Enter Locations**:
   - Start: Islamabad
   - End: Lahore
4. **Select Vehicle** - Choose Toyota Corolla (14 km/L)
5. **Analyze** - Click "Analyze Trip"
6. **View Results** - See complete fuel analysis

## 📊 Expected Results (Islamabad → Lahore)

- **Distance**: ~374 km
- **Fuel Required**: ~26.7 L
- **Estimated Cost**: ~PKR 7,209
- **Travel Time**: ~4h 45m
- **ETA**: Shows arrival time

## 🐛 Troubleshooting

### PostgreSQL Connection Error

```bash
# Start PostgreSQL service
# macOS: brew services start postgresql
# Linux: sudo service postgresql start
# Windows: Use pgAdmin or PostgreSQL installer

# Test connection
psql -U postgres -d drivefuel
```

### API Key Error

- Get free API key from https://console.cloud.google.com
- Enable: Maps, Directions, Geocoding, Places APIs
- Add to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### Port 3000 Already in Use

```bash
# Run on different port
npm run dev -- -p 3001
```

## 📁 Important Files to Know

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page with landing & trip planner |
| `app/components/TripPlanner.tsx` | Main 3-step planning wizard |
| `app/components/TripAnalysisCard.tsx` | Trip results display |
| `app/services/fuelCalculations.ts` | Core fuel engine |
| `app/services/googleMapsService.ts` | Maps & routing |
| `prisma/schema.prisma` | Database models |

## 🚀 Next Steps

1. **Customize Colors** - Edit `tailwind.config.ts`
2. **Add Your Logo** - Replace favicon in `public/`
3. **Connect Real API** - Uncomment Google Maps calls in services
4. **Add Authentication** - Implement NextAuth providers
5. **Deploy** - Push to Vercel or Docker

## 📚 Learn More

- **Fuel Calculation** - See `fuelCalculations.ts` for algorithm
- **Database** - Run `npm run db:studio` to view Prisma Studio
- **Styling** - Check `globals.css` for design tokens
- **Types** - See `app/types/index.ts` for data models

## 💡 Pro Tips

- Use Chrome DevTools for mobile testing (Ctrl+Shift+M)
- Check browser console for calculation logs
- Database Studio: `npm run db:studio`
- Type checking: `npx tsc --noEmit`

## 🔗 Useful Resources

- [Google Cloud Console](https://console.cloud.google.com)
- [PostgreSQL Download](https://www.postgresql.org/download/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] .env.local created with all keys
- [ ] Database created and synced
- [ ] Dev server running on http://localhost:3000
- [ ] Homepage loads without errors
- [ ] Trip planner modal opens
- [ ] Trip analysis calculates correctly

You're ready to build! 🚀
