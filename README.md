# Vunalet - Harvesting the Future 🌱

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

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vunalet
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# App Configuration
NEXT_PUBLIC_APP_NAME=Vunalet
NEXT_PUBLIC_APP_DESCRIPTION=Harvesting the future through sustainable agriculture
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

- **Project Link**: [https://github.com/your-username/vunalet](https://github.com/your-username/vunalet)
- **Hackathon**: [Lisk ZAR Stablecoin Payments Hackathon](https://www.hackersdao.com/lisk-zar-stablecoin-payments-hackathon)

---

Built with ❤️ for Nigerian farmers and sustainable agriculture.
