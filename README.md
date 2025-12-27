# Grow - Modern Analytics Dashboard

A feature-rich, interactive analytics dashboard built with Next.js 16, featuring real-time data visualization, customizable widgets, and a sleek dark mode interface.

## ✨ Features

- 📊 **Interactive Widgets** - Customizable dashboard with drag-and-drop grid layout
- 📈 **Real-Time Charts** - Beautiful data visualizations using Recharts
- 🎨 **Dark/Light Mode** - Seamless theme switching with next-themes
- 🎯 **Responsive Design** - Fully responsive across all devices
- ⚡ **Performance Optimized** - Lazy loading and code splitting
- 🔧 **Modular Components** - Reusable UI components with Radix UI
- 🎭 **Modern UI** - Built with Tailwind CSS v4 and shadcn/ui

## 🚀 Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI, shadcn/ui
- **Charts:** Recharts
- **State Management:** Zustand
- **Grid Layout:** React Grid Layout
- **Icons:** Lucide React
- **Data Fetching:** SWR

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd Grow

# Install dependencies
npm install
```

## 🛠️ Getting Started

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📁 Project Structure

```
Grow/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── dashboard/    # Dashboard-specific components
│   │   ├── layout/       # Layout components (Header, Shell)
│   │   ├── modals/       # Modal components
│   │   ├── widgets/      # Widget components (Charts, Stats)
│   │   └── ui/           # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── store/            # Zustand state management
├── public/               # Static assets
└── package.json          # Dependencies
```

## 🎯 Key Components

### Dashboard Grid
- Customizable drag-and-drop layout
- Resizable widgets
- Persistent layout configuration

### Widgets
- **Line Chart Widget** - Real-time data visualization
- **Stats Cards** - Key metrics display
- **Interactive Charts** - Multiple chart types supported

### Theme System
- Dark/Light mode toggle
- System preference detection
- Persistent theme selection

## 🔧 Configuration

The project uses several configuration files:

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler options
- `components.json` - shadcn/ui configuration

## 📝 Development

### Adding New Widgets

1. Create widget component in `src/components/widgets/`
2. Register widget in dashboard grid
3. Add widget configuration to store

### Styling Guidelines

- Use Tailwind utility classes
- Follow component-based architecture
- Maintain consistent spacing and colors
- Use CSS variables for theming

## 🚀 Deployment

The application is optimized for deployment on Vercel:

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy to Vercel
vercel

# Or build and deploy manually
npm run build
npm start
```

### Environment Variables

For production deployment, configure the following environment variables:
- `NEXT_PUBLIC_API_URL` - Your API endpoint URL
- `NODE_ENV` - Set to `production`

## 📊 Performance

- **Lazy Loading**: Components are dynamically loaded for optimal performance
- **Code Splitting**: Automatic code splitting for faster page loads
- **Optimized Images**: Next.js Image component for optimized image loading
- **Caching**: SWR for efficient data fetching and caching


## 📄 License

This project is private and proprietary.

## 👤 Author

**Akarsh**
- Email: akarsh7376@gmail.com
- GitHub: [@Beast-1-3](https://github.com/Beast-1-3)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Recharts](https://recharts.org/) - Composable charting library
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components

---

Built with ❤️ using Next.js and TypeScript
