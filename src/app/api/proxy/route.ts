import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
        return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
    }

    try {
        const url = new URL(targetUrl);

        // Auto-append API keys based on the domain
        if (url.hostname.includes('finnhub.io')) {
            const apiKey = process.env.FINNHUB_API_KEY;
            if (apiKey) url.searchParams.set('token', apiKey);
        } else if (url.hostname.includes('alphavantage.co')) {
            const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
            if (apiKey) url.searchParams.set('apikey', apiKey);
        }

        const response = await fetch(url.toString(), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch external data', details: error.message },
            { status: 500 }
        );
    }
}
