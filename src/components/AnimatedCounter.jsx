import { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Extract the number and suffix
  // e.g. "1,200+" -> number: 1200, suffix: "+"
  // e.g. "100%" -> number: 100, suffix: "%"
  const cleanNumber = value.replace(/[^0-9]/g, '');
  const target = parseInt(cleanNumber, 10) || 0;
  
  // Find non-numeric suffix
  const suffix = value.replace(/[0-9,]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeProgress * target);
      
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [hasStarted, target]);

  // Format with commas if target is high
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(count)}{suffix}
    </span>
  );
}
