import { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, duration = 2000, onClose }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, duration - 300);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className={`toast ${isLeaving ? 'leaving' : ''}`}>
      {message}
    </div>
  );
}
