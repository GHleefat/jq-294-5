import { useRef, useCallback, useEffect } from "react";
import { useGameStore } from "../store/gameStore";

export function useGameLoop() {
  const updateGameTick = useGameStore((s) => s.updateGameTick);
  const isPaused = useGameStore((s) => s.isPaused);
  const isGameOver = useGameStore((s) => s.isGameOver);
  const lastFrameRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const loop = useCallback(
    (timestamp: number) => {
      if (lastFrameRef.current === 0) {
        lastFrameRef.current = timestamp;
      }
      const delta = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;

      if (delta > 0 && delta < 200) {
        updateGameTick(delta);
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [updateGameTick]
  );

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      lastFrameRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [loop, isPaused, isGameOver]);
}
