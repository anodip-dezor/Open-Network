// src/components/TrainingAnimation.jsx
import { useEffect } from 'react';
import * as TWEEN from '@tweenjs/tween.js';

function TrainingAnimation({ updateWeights }) {
  useEffect(() => {
    const animate = (time) => {
      requestAnimationFrame(animate);
      TWEEN.update(time);
    };
    requestAnimationFrame(animate);

    const interval = setInterval(() => {
      updateWeights(); // Function to update weights randomly or based on logic
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [updateWeights]);

  return null;
}

export default TrainingAnimation;
