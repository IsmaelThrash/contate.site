import React, { useEffect, useRef } from 'react';

/**
 * MouseSpotlight Component
 * Renders a subtle, high-performance radial spotlight that follows the user's cursor.
 * Uses requestAnimationFrame and CSS transform to avoid React re-renders.
 */
export const MouseSpotlight = () => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    let animationFrameId = null;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const handlePointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updatePosition = () => {
      // Suave interpolação (lerp) para movimento elegante e sem trancos
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX - 350}px, ${currentY - 350}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        ref={spotlightRef}
        className="w-[700px] h-[700px] rounded-full absolute top-0 left-0 opacity-40 dark:opacity-60 blur-[110px] will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(59, 130, 246, 0.12) 40%, transparent 75%)',
          transform: 'translate3d(-1000px, -1000px, 0)'
        }}
      />
    </div>
  );
};

export default MouseSpotlight;
