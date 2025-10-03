import type { Metadata } from 'next';

const baseUrl = 'https://farcaster-snake-jdv6.vercel.app';

export const metadata: Metadata = {
  title: 'Yilan Oyunu - Farcaster Frame',
  description: 'Farcaster frame olarak oynayabilecegin klasik yilan oyunu!',
  openGraph: {
    title: 'Yilan Oyunu',
    description: 'Farcaster frame oyunu',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://farcaster-snake-jdv6.vercel.app/frame-start.png',
    'fc:frame:image:aspect_ratio': '1:1',
    'fc:frame:button:1': 'Oyunu Baslat',
    'fc:frame:button:1:action': 'post',
    'fc:frame:post_url': 'https://farcaster-snake-jdv6.vercel.app/api/frame',
  },
};

export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#10b981', fontSize: '48px', marginBottom: '10px' }}>Yilan Oyunu</h1>
      <p style={{ fontSize: '20px', color: '#333', marginBottom: '30px' }}>Farcaster frame olarak oyna!</p>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>Nasil Oynanir:</h2>
        <ul style={{ fontSize: '18px', lineHeight: '1.8', color: '#555' }}>
          <li>Yukarı Asagi Sol Sag butonlariyla yonlendir</li>
          <li>Kirmizi yemegi ye ve buyu</li>
          <li>Duvara veya kendine carpma!</li>
          <li>En yuksek skoru yap</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e0f2fe', borderRadius: '8px' }}>
        <h3 style={{ color: '#0284c7', marginBottom: '15px' }}>Farcaster Oynamak Icin:</h3>
        <ol style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
          <li>Bu sayfanin URL ini kopyala</li>
          <li>Warpcast te yeni bir cast olustur</li>
          <li>URL i yapistir ve paylas</li>
          <li>Frame otomatik gorunecek!</li>
        </ol>
      </div>
    </div>
  );
}