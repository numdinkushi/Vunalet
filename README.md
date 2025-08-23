# Vunalet - Harvesting the Future 🌱

**🌐 Live Demo**: [https://vunalet.vercel.app/](https://vunalet.vercel.app/)

Vunalet is a revolutionary farm-to-consumer marketplace that connects local farmers directly with consumers, eliminating middlemen and ensuring fresh, sustainable produce reaches your table.

## 🚀 Features

- **Direct Connection**: Connect farmers directly with consumers
- **Quality Assured**: Certified organic produce with quality guarantees
- **Fresh Delivery**: Farm-to-table delivery ensuring maximum freshness
- **3D Animations**: Beautiful 3D background animations using Three.js
- **Modern UI**: Built with Next.js, Tailwind CSS, and Framer Motion
- **Authentication**: Secure authentication with Clerk
- **Responsive Design**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js, @react-three/fiber
- **Authentication**: Clerk
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React

## 📁 Project Structure

```
vunalet/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with ClerkProvider
│   ├── page.tsx           # Home page
│   ├── products/          # Products page
│   ├── farmers/           # Farmers page
│   ├── about/             # About page
│   └── dashboard/         # Farmer dashboard
├── components/            # Modular components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── pages/            # Page-specific components
│   ├── ui/               # Reusable UI components
│   └── 3d/              # 3D components
├── middleware.ts         # Clerk middleware
└── package.json
```

## 🎨 Design System

### Colors
- **Primary**: Vunalet Green (hsl(147, 40%, 20%))
- **Secondary**: Light Green (hsl(147, 40%, 95%))
- **Accent**: Medium Green (hsl(147, 40%, 40%))

### Typography
- **Font**: Geist Sans (Modern, clean, readable)
- **Weights**: Regular, Medium, Semibold, Bold

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Clerk account (for authentication)
- Cloudinary account (for image storage)
- Convex account (for database)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd vunalet
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory with the following variables:

```env
# Clerk Authentication
# Get these from https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Cloudinary Configuration
# Get these from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Convex Configuration
# This will be auto-generated when you run 'npx convex dev'
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud

# App Configuration
NEXT_PUBLIC_APP_NAME=Vunalet
NEXT_PUBLIC_APP_DESCRIPTION=Harvesting the future through sustainable agriculture

# Stablecoin API Configuration (for Lisk ZAR payments)
# Get these from your stablecoin service provider
NEXT_PRIVATE_API_KEY=your_stablecoin_api_key_here
STABLECOIN_API_KEY=your_stablecoin_api_key_here
STABLECOIN_API_URL=https://your-stablecoin-api-url.com
```

**Required Services:**
- **Clerk**: [https://dashboard.clerk.com/](https://dashboard.clerk.com/) (Authentication)
- **Cloudinary**: [https://cloudinary.com/console](https://cloudinary.com/console) (Image Storage)
- **Convex**: [https://dashboard.convex.dev/](https://dashboard.convex.dev/) (Database)
- **Stablecoin API**: Your stablecoin service provider (Payments)

4. **Initialize Convex Database:**
```bash
npx convex dev
```
This will:
- Provision a new Convex deployment
- Save the deployment URL to `.env.local`
- Start the Convex development server

5. **Initialize Categories in Database:**
```bash
npm run init:categories
```
This populates the categories table with predefined data and Cloudinary image URLs.

6. **Start the development server:**
```bash
npm run dev
```

7. **Open the application:**
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Expected Result
After completing these steps, you should have:
- ✅ A running Next.js application
- ✅ Connected Convex database with categories
- ✅ Image upload functionality via Cloudinary
- ✅ Authentication system via Clerk
- ✅ Farmer dashboard with product management
- ✅ Buyer dashboard with order tracking

## 📱 Pages

### Home Page (`/`)
- Hero section with 3D animations
- Features showcase
- Statistics section
- Call-to-action buttons

### Products Page (`/products`)
- Product grid with search and filters
- Product cards with images and details
- Add to cart functionality

### Farmers Page (`/farmers`)
- Farmer profiles and ratings
- Farm details and specialties
- Contact information

### About Page (`/about`)
- Company mission and values
- Team member profiles
- Company story

### Dashboard (`/dashboard`)
- Farmer dashboard with statistics
- Recent orders
- Product management

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Migration Scripts

These scripts help manage the database schema and data migration:

#### Image Migration Script
Migrate local category images to Cloudinary and generate updated category data:
```bash
npm run migrate:images
```
This script will:
- Upload local category images from `public/assets/categories/` to Cloudinary
- Generate JSON output with Cloudinary URLs for each category
- Output can be used to update the `initializeCategories` function in `convex/categories.ts`

#### Category Initialization Script
Initialize categories in the Convex database with Cloudinary images:
```bash
npm run init:categories
```
This script will:
- Call the `initializeCategories` mutation in Convex
- Populate the categories table with predefined data
- Set up proper category relationships for products

#### Environment Variables Required
Make sure your `.env` file includes:
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

#### Manual Migration (Alternative)
If you prefer to run migrations manually through the UI:
1. Start the development server: `npm run dev`
2. Navigate to `/admin/migrate` in your browser
3. Use the DatabaseMigrator component to run migrations
4. Use the CategoryInitializer component to initialize categories

### Component Structure

All components are modular and follow a consistent structure:

```typescript
'use client';

import { motion } from 'framer-motion';
import { ComponentProps } from './types';

export function ComponentName({ props }: ComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Component content */}
    </motion.div>
  );
}
```

## 🎯 Hackathon Context

This project was built for the **Lisk ZAR Stablecoin Payments Hackathon** hosted by HackersDAO and Lisk Africa. The goal is to solve the middleman problem between farmers and buyers in Nigeria's agricultural sector.

### Problem Statement
- Farmers often lose profits to middlemen
- Consumers pay higher prices for produce
- Lack of direct connection between producers and consumers
- Limited access to fresh, quality produce

### Solution
Vunalet provides a direct marketplace where:
- Farmers can list their products directly
- Consumers can buy fresh produce at fair prices
- Quality is assured through verification systems
- Payments are processed securely

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **HackersDAO** for organizing the hackathon
- **Lisk Africa** for supporting the project
- **Next.js** team for the amazing framework
- **Clerk** for authentication services
- **Framer Motion** for smooth animations
- **Three.js** for 3D graphics

## 📞 Contact

- **Project Link**: https://github.com/numdinkushi/Vunalet
- **Hackathon**: [Lisk ZAR Stablecoin Payments Hackathon](https://www.hackersdao.com/lisk-zar-stablecoin-payments-hackathon)

---

Built with ❤️ for South African farmers and sustainable agriculture.
