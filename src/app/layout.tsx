import { WalletProvider } from '@/providers/wallet-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://farcaster-snake-f7r3.vercel.app/frame-start.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:button:1" content="Oyunu Baslat" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:post_url" content="https://farcaster-snake-f7r3.vercel.app/api/frame" />
      </head>
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}