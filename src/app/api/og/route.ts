import { NextResponse } from 'next/server';

export async function GET() {
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <rect width="400" height="400" fill="#1a1a1a"/>
      
      <text x="200" y="80" font-family="Arial" font-size="48" font-weight="bold" fill="url(#grad1)" text-anchor="middle">
        🐍 YILAN
      </text>
      
      <text x="200" y="130" font-family="Arial" font-size="32" fill="#fff" text-anchor="middle">
        OYUNU
      </text>
      
      <rect x="120" y="180" width="30" height="30" fill="#10b981" rx="4"/>
      <rect x="150" y="180" width="30" height="30" fill="#34d399" rx="2"/>
      <rect x="180" y="180" width="30" height="30" fill="#34d399" rx="2"/>
      <rect x="210" y="180" width="30" height="30" fill="#34d399" rx="2"/>
      
      <circle cx="265" cy="195" r="12" fill="#ef4444"/>
      
      <text x="200" y="260" font-family="Arial" font-size="24" fill="#fff" text-anchor="middle">
        Oynamak için
      </text>
      <text x="200" y="290" font-family="Arial" font-size="24" fill="#10b981" text-anchor="middle">
        "Oyunu Başlat"
      </text>
      
      <text x="200" y="340" font-family="Arial" font-size="20" fill="#888" text-anchor="middle">
        ↑ ↓ ← → ile kontrol et
      </text>
    </svg>
  `;

  const base64 = Buffer.from(svg).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64}`;

  return new NextResponse(dataUrl, {
    headers: { 'Content-Type': 'text/plain' },
  });
}