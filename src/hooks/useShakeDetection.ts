
import { useEffect } from 'react';

interface ShakeDetectionProps {
  onShake: () => void;
  enabled: boolean;
}

export const useShakeDetection = ({ onShake, enabled }: ShakeDetectionProps) => {
  useEffect(() => {
    if (!enabled || !window.DeviceMotionEvent) {
      return;
    }

    let shakeThreshold = 15;
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    
    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;
      
      const { x, y, z } = acceleration;
      if (x === null || y === null || z === null) return;
      
      if (lastX === null || lastY === null || lastZ === null) {
        lastX = x;
        lastY = y;
        lastZ = z;
        return;
      }
      
      const deltaX = Math.abs(lastX - x);
      const deltaY = Math.abs(lastY - y);
      const deltaZ = Math.abs(lastZ - z);
      
      if ((deltaX > shakeThreshold && deltaY > shakeThreshold) || 
          (deltaX > shakeThreshold && deltaZ > shakeThreshold) || 
          (deltaY > shakeThreshold && deltaZ > shakeThreshold)) {
        onShake();
      }
      
      lastX = x;
      lastY = y;
      lastZ = z;
    };
    
    window.addEventListener('devicemotion', handleMotion);
    
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [enabled, onShake]);
};
