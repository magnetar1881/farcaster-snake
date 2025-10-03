import { NextRequest, NextResponse } from 'next/server';

interface GameState {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: { x: number; y: number };
  score: number;
  gameOver: boolean;
}

const GRID_SIZE = 20;

function initGame(): GameState {
  return {
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: { x: 1, y: 0 },
    score: 0,
    gameOver: false
  };
}

function generateFood(snake: { x: number; y: number }[]): { x: number; y: number } {
  let newFood: { x: number; y: number };
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

function moveSnake(state: GameState, newDirection?: { x: number; y: number }): GameState {
  if (state.gameOver) return state;

  const direction = newDirection || state.direction;
  
  if (newDirection && (
    (newDirection.x === -state.direction.x && newDirection.y === state.direction.y) ||
    (newDirection.y === -state.direction.y && newDirection.x === state.direction.x)
  )) {
    return state;
  }

  const newHead = {
    x: state.snake[0].x + direction.x,
    y: state.snake[0].y + direction.y
  };

  if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
    return { ...state, gameOver: true };
  }

  if (state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
    return { ...state, gameOver: true };
  }

  const newSnake = [newHead, ...state.snake];
  let newFood = state.food;
  let newScore = state.score;

  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    newScore += 10;
    newFood = generateFood(newSnake);
  } else {
    newSnake.pop();
  }

  return {
    snake: newSnake,
    food: newFood,
    direction,
    score: newScore,
    gameOver: false
  };
}

function renderGameImage(state: GameState): string {
  const cellSize = 20;
  const width = GRID_SIZE * cellSize;
  const height = GRID_SIZE * cellSize;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${width}" height="${height}" fill="#1a1a1a"/>`;

  for (let i = 0; i <= GRID_SIZE; i++) {
    svg += `<line x1="${i * cellSize}" y1="0" x2="${i * cellSize}" y2="${height}" stroke="#333" stroke-width="1"/>`;
    svg += `<line x1="0" y1="${i * cellSize}" x2="${width}" y2="${i * cellSize}" stroke="#333" stroke-width="1"/>`;
  }

  state.snake.forEach((segment, index) => {
    const color = index === 0 ? '#10b981' : '#34d399';
    svg += `<rect x="${segment.x * cellSize + 1}" y="${segment.y * cellSize + 1}" width="${cellSize - 2}" height="${cellSize - 2}" fill="${color}" rx="2"/>`;
  });

  svg += `<circle cx="${state.food.x * cellSize + cellSize / 2}" cy="${state.food.y * cellSize + cellSize / 2}" r="${cellSize / 2 - 2}" fill="#ef4444"/>`;
  svg += `<text x="10" y="30" font-family="Arial" font-size="24" font-weight="bold" fill="#fff">Skor: ${state.score}</text>`;

  if (state.gameOver) {
    svg += `<rect width="${width}" height="${height}" fill="rgba(0,0,0,0.7)"/>`;
    svg += `<text x="${width / 2}" y="${height / 2 - 20}" font-family="Arial" font-size="32" font-weight="bold" fill="#ef4444" text-anchor="middle">OYUN BİTTİ!</text>`;
    svg += `<text x="${width / 2}" y="${height / 2 + 20}" font-family="Arial" font-size="24" fill="#fff" text-anchor="middle">Final Skor: ${state.score}</text>`;
  }

  svg += '</svg>';
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { untrustedData } = body;
    const buttonIndex = untrustedData?.buttonIndex;
    const state = untrustedData?.state ? JSON.parse(untrustedData.state) : null;

    let gameState: GameState;

    if (!state || buttonIndex === 5) {
      gameState = initGame();
    } else {
      let direction = state.direction;

      switch (buttonIndex) {
        case 1:
          direction = { x: 0, y: -1 };
          break;
        case 2:
          direction = { x: 0, y: 1 };
          break;
        case 3:
          direction = { x: -1, y: 0 };
          break;
        case 4:
          direction = { x: 1, y: 0 };
          break;
      }

      gameState = moveSnake(state, direction);
    }

    const imageUrl = renderGameImage(gameState);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          <meta property="fc:frame:button:1" content="↑" />
          <meta property="fc:frame:button:2" content="↓" />
          <meta property="fc:frame:button:3" content="←" />
          <meta property="fc:frame:button:4" content="→" />
          ${gameState.gameOver ? '<meta property="fc:frame:button:5" content="🔄 Yeniden" />' : ''}
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
          <meta property="fc:frame:state" content='${JSON.stringify(gameState)}' />
        </head>
        <body>
          <h1>Yılan Oyunu 🐍</h1>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Frame error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}