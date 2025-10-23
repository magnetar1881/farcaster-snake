'use client';

import { useEffect, useState, useCallback } from 'react';
import sdk from '@farcaster/frame-sdk';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const GRID_SIZE = 20;
const CELL_SIZE = 15;

interface Position {
  x: number;
  y: number;
}

export default function GamePage() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnectWallet = async () => {
    try {
      const result = await sdk.actions.openUrl('https://wallet.coinbase.com');
      console.log('Wallet acildi:', result);
    } catch (error) {
      console.error('Wallet hatasi:', error);
    }
  };

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      sdk.actions.ready();
      setIsSDKLoaded(true);
    };
    
    load();
  }, []);

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setFood({ x: 5, y: 5 });
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return;

    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };

    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      setGameOver(true);
      return;
    }

    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];

    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(score + 10);
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, gameStarted, score, generateFood]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const handleKeyPress = (newDirection: Position) => {
    if (
      (newDirection.x === -direction.x && newDirection.y === direction.y) ||
      (newDirection.y === -direction.y && newDirection.x === direction.x)
    ) {
      return;
    }
    setDirection(newDirection);
  };

  if (!isSDKLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#fff'
      }}>
        Yukleniyor...
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#10b981', fontSize: '32px', marginBottom: '10px' }}>🐍 Yilan Oyunu</h1>
          <div style={{ color: '#fbbf24', fontSize: '24px', fontWeight: 'bold' }}>Skor: {score}</div>
          
          {/* Wallet Butonu */}
          <div style={{ marginTop: '15px' }}>
            {isConnected ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ color: '#10b981', fontSize: '14px' }}>
                  🟢 Cuzdan: {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <button
                  onClick={() => disconnect()}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cuzdan Baglantisini Kes
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                style={{
                  backgroundColor: '#0052ff',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                💰 Cuzdan Bagla
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            backgroundColor: '#0a0a0a',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '2px solid rgba(255,255,255,0.2)'
          }}
        >
          {snake.map((segment, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 1,
                height: CELL_SIZE - 1,
                backgroundColor: index === 0 ? '#10b981' : '#34d399',
                borderRadius: index === 0 ? '4px' : '2px',
                transition: 'all 75ms'
              }}
            />
          ))}

          <div
            style={{
              position: 'absolute',
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
              backgroundColor: '#ef4444',
              borderRadius: '50%'
            }}
          />

          {gameOver && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#ef4444', fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                Oyun Bitti!
              </div>
              <div style={{ color: '#fff', fontSize: '18px', marginBottom: '20px' }}>
                Final Skor: {score}
              </div>
              <button
                onClick={resetGame}
                style={{
                  backgroundColor: '#10b981',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Tekrar Oyna
              </button>
            </div>
          )}

          {!gameStarted && !gameOver && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderRadius: '8px'
            }}>
              <button
                onClick={resetGame}
                style={{
                  backgroundColor: '#10b981',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Oyunu Baslat
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => handleKeyPress({ x: 0, y: -1 })}
            disabled={!gameStarted || gameOver}
            style={{
              backgroundColor: gameStarted && !gameOver ? '#3b82f6' : '#4b5563',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '20px',
              cursor: gameStarted && !gameOver ? 'pointer' : 'not-allowed'
            }}
          >
            ↑
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleKeyPress({ x: -1, y: 0 })}
              disabled={!gameStarted || gameOver}
              style={{
                backgroundColor: gameStarted && !gameOver ? '#3b82f6' : '#4b5563',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '20px',
                cursor: gameStarted && !gameOver ? 'pointer' : 'not-allowed'
              }}
            >
              ←
            </button>
            <button
              onClick={() => handleKeyPress({ x: 0, y: 1 })}
              disabled={!gameStarted || gameOver}
              style={{
                backgroundColor: gameStarted && !gameOver ? '#3b82f6' : '#4b5563',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '20px',
                cursor: gameStarted && !gameOver ? 'pointer' : 'not-allowed'
              }}
            >
              ↓
            </button>
            <button
              onClick={() => handleKeyPress({ x: 1, y: 0 })}
              disabled={!gameStarted || gameOver}
              style={{
                backgroundColor: gameStarted && !gameOver ? '#3b82f6' : '#4b5563',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '20px',
                cursor: gameStarted && !gameOver ? 'pointer' : 'not-allowed'
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}