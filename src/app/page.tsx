import type { Metadata } from 'next';

const baseUrl = 'https://farcaster-snake-f7r3.vercel.app';

export const metadata: Metadata = {
  title: "Yılan Oyunu - Farcaster Frame",
  description: "Farcaster frame olarak oynayabileceğin klasik yılan oyunu!",
  openGraph: {
    title: "Yılan Oyunu 🐍",
    description: "Farcaster'da oyna!",
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": `${baseUrl}/api/og`,
    "fc:frame:image:aspect_ratio": "1:1",
    "fc:frame:button:1": "🎮 Oyunu Başlat",
    "fc:frame:post_url": `${baseUrl}/api/frame`,
  },
};

export default function Home() {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#10b981", fontSize: "48px", marginBottom: "10px" }}>
        🐍 Yılan Oyunu
      </h1>

      <p style={{ fontSize: "20px", color: "#333", marginBottom: "30px" }}>
        Farcaster&apos;da frame olarak oyna!
      </p>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "15px" }}>🎮 Nasıl Oynanır:</h2>
        <ul style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
          <li>↑ ↓ ← → butonlarıyla yönlendir</li>
          <li>🔴 Kırmızı yemeği ye ve büyü</li>
          <li>❌ Duvara veya kendine çarpma!</li>
          <li>🏆 En yüksek skoru yap</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#e0f2fe",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ color: "#0284c7", marginBottom: "15px" }}>
          📱 Farcaster&apos;da Oynamak İçin:
        </h3>
        <ol style={{ fontSize: "16px", lineHeight: "1.8", color: "#333" }}>
          <li>Bu sayfanın URL&apos;ini kopyala</li>
          <li>Warpcast&apos;te yeni bir cast oluştur</li>
          <li>URL&apos;i yapıştır ve paylaş</li>
          <li>Frame otomatik görünecek!</li>
        </ol>
      </div>
    </div>
  );
}
