import { useRef, useEffect, useCallback } from 'react';

export const useAnimationFrame = (callback: (elapsedTime: number) => void, isPlaying: boolean) => {
    const requestRef = useRef<number>();
    const startTimeRef = useRef<number>();

    const animate = useCallback((time: number) => {
        if (startTimeRef.current === undefined) {
            startTimeRef.current = time;
        }
        const elapsedTime = time - startTimeRef.current!;
        callback(elapsedTime);
        requestRef.current = requestAnimationFrame(animate);
    }, [callback]);

    useEffect(() => {
        if (isPlaying) {
            startTimeRef.current = undefined; // Reset start time on play
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current !== undefined) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = undefined;
            }
        }
        return () => {
            if (requestRef.current !== undefined) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isPlaying, animate]);
};
