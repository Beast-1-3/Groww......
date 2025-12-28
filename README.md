# 📊 FinBoard

**FinBoard** is a high-performance, professional finance dashboard built for real-time market monitoring. It features a secure server-side proxy for API key management, a premium high-density UI, and an intelligent data mapping system.



##  Key Features

###  Secure API Proxy
- **Zero-Exposure**: API keys are injected on the server side and never reach the client's browser.
- **Auto-Injection**: Support for **Alpha Vantage** and **Finnhub** out of the box.
- **CORS Bypass**: Integrated proxy resolves common CORS issues when fetching from professional financial APIs.

###  Intelligent Data Widgets
- **Card**: High-visibility metric display with real-time trend calculations and "Live" status indicators.
- **Table**: Professional, high-density data tables with zebra striping, monospace typography, and integrated search/pagination.
- **Chart**: Vibrant, responsive line and area charts with intelligent data sampling (handles 1,000+ points smoothly) and custom tooltips.

### 🛠️ Widget Engine
- **Field Explorer**: Interactive JSON navigator to map any API response to your widgets without writing code.
- **Root Path Support**: Seamlessly navigate nested data objects (like Alpha Vantage's Time Series).
- **Edit Mode**: Instant refresh and live reconfiguration of any widget on the dashboard.

##  Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS (with HSL theme variables)
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Zustand

## 🏁 Getting Started

### 1. Prerequisite API Keys
Sign up for free keys at:
- [Finnhub.io](https://finnhub.io/)
- [AlphaVantage.co](https://www.alphavantage.co/)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
FINNHUB_API_KEY=your_key_here
ALPHA_VANTAGE_API_KEY=your_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌎 Deployment

When deploying (e.g., to Vercel), add your `FINNHUB_API_KEY` and `ALPHA_VANTAGE_API_KEY` as **Environment Variables** in your project settings. The server-side proxy will automatically detect and use them.


