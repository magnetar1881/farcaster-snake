import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('https://farcaster-snake-f7r3.vercel.app/frame-start.png');
}