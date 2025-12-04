import { useState, useRef, useCallback } from 'react';

interface RecordedFrame {
  time: number;
  data: any;
}

interface RecorderState {
  isRecording: boolean;
  isPlaying: boolean;
  frames: RecordedFrame[];
  currentFrame: number;
}

export const useSimulationRecorder = () => {
  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    isPlaying: false,
    frames: [],
    currentFrame: 0
  });

  const startTimeRef = useRef<number>(0);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRecording: true,
      frames: [],
      currentFrame: 0
    }));
    startTimeRef.current = Date.now();
  }, []);

  const stopRecording = useCallback(() => {
    setState(prev => ({ ...prev, isRecording: false }));
  }, []);

  const recordFrame = useCallback((data: any) => {
    if (!state.isRecording) return;

    const time = (Date.now() - startTimeRef.current) / 1000;
    setState(prev => ({
      ...prev,
      frames: [...prev.frames, { time, data }]
    }));
  }, [state.isRecording]);

  const startPlayback = useCallback(() => {
    if (state.frames.length === 0) return;

    setState(prev => ({ ...prev, isPlaying: true, currentFrame: 0 }));

    let frameIndex = 0;
    playbackIntervalRef.current = setInterval(() => {
      if (frameIndex >= state.frames.length) {
        stopPlayback();
        return;
      }

      setState(prev => ({ ...prev, currentFrame: frameIndex }));
      frameIndex++;
    }, 1000 / 60); // 60 FPS playback
  }, [state.frames]);

  const stopPlayback = useCallback(() => {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const clearRecording = useCallback(() => {
    stopPlayback();
    setState({
      isRecording: false,
      isPlaying: false,
      frames: [],
      currentFrame: 0
    });
  }, [stopPlayback]);

  const getCurrentFrameData = useCallback(() => {
    if (state.currentFrame >= state.frames.length) return null;
    return state.frames[state.currentFrame]?.data;
  }, [state.currentFrame, state.frames]);

  const exportRecording = useCallback(() => {
    const data = JSON.stringify(state.frames, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `simulation-recording-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [state.frames]);

  return {
    isRecording: state.isRecording,
    isPlaying: state.isPlaying,
    frameCount: state.frames.length,
    currentFrame: state.currentFrame,
    startRecording,
    stopRecording,
    recordFrame,
    startPlayback,
    stopPlayback,
    clearRecording,
    getCurrentFrameData,
    exportRecording
  };
};
