import { useState, useEffect } from 'react';



// Custom hook to calculate relative time
const useTimeAgo = (timestamp) => {
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    const calculateRelativeTime = () => {
      const now = new Date();
      const createdAt = new Date(timestamp);
      const diffInSeconds = Math.floor((now - createdAt) / 1000);

      if (diffInSeconds < 60) {
        setRelativeTime(`${diffInSeconds}s`); // Less than 60 seconds
      } else if (diffInSeconds < 3600) {
        setRelativeTime(`${Math.floor(diffInSeconds / 60)}m`); // Less than 60 minutes
      } else if (diffInSeconds < 86400) {
        setRelativeTime(`${Math.floor(diffInSeconds / 3600)}h`); // Less than 24 hours
      } else if (diffInSeconds < 604800) {
        setRelativeTime(`${Math.floor(diffInSeconds / 86400)}d`); // Less than 7 days
      } else if (diffInSeconds < 2419200) {
        setRelativeTime(`${Math.floor(diffInSeconds / 604800)}w`); // Less than 4 weeks
      } else {
        setRelativeTime(`${Math.floor(diffInSeconds / 2419200)}mo`); // More than 4 weeks
      }
    };

    // Calculate relative time on mount
    calculateRelativeTime();
  }, [timestamp]);

  return relativeTime;
};

export default useTimeAgo;
