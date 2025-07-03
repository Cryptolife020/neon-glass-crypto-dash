
import { useEffect, useRef } from 'react';

interface LottieAnimationProps {
  src: string;
  width: string;
  height: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  background?: string;
  speed?: number;
}

const LottieAnimation = ({
  src,
  width,
  height,
  className = '',
  loop = true,
  autoplay = true,
  background = 'transparent',
  speed = 1
}: LottieAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadLottie = async () => {
      try {
        // Dynamically import the Lottie player
        const { DotLottiePlayer } = await import('@dotlottie/player-component');
        
        if (containerRef.current) {
          const player = new DotLottiePlayer({
            container: containerRef.current,
            src,
            background,
            speed,
            loop,
            autoplay,
          });

          // Set dimensions
          containerRef.current.style.width = width;
          containerRef.current.style.height = height;
        }
      } catch (error) {
        console.error('Error loading Lottie animation:', error);
      }
    };

    loadLottie();
  }, [src, width, height, loop, autoplay, background, speed]);

  return <div ref={containerRef} className={className} />;
};

export default LottieAnimation; 
