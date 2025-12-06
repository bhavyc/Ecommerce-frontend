import { useState, useEffect } from "react";

// Countdown Timer Component
const Timer = ({ targetDate, onExpire }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    if (difference <= 0) return null;

    return {
      hrs: Math.floor((difference / (1000 * 60 * 60)) % 24),
      mins: Math.floor((difference / 1000 / 60) % 60),
      secs: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const t = calculateTimeLeft();
      if (!t) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
      setTimeLeft(t);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-gray-500">Expired</span>;

  return (
    <span className="font-mono bg-red-100 text-red-600 px-1 rounded">
      {timeLeft.hrs}h {timeLeft.mins}m {timeLeft.secs}s
    </span>
  );
};
export default Timer;