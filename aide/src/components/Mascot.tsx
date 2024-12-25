import { useState, useEffect } from 'react';

interface MascotProps {
  mood?: 'idle' | 'thinking' | 'happy' | 'confused';
}

export const Mascot = ({ mood = 'idle' }: MascotProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [mood]);

  const getMoodEmoji = () => {
    switch (mood) {
      case 'thinking':
        return '🤔';
      case 'happy':
        return '😊';
      case 'confused':
        return '😕';
      default:
        return '🤖';
    }
  };

  return (
    <div
      className={`mascot ${isAnimating ? 'animate' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div className="mascot-emoji">{getMoodEmoji()}</div>
    </div>
  );
};

export default Mascot;
