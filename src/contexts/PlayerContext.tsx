import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Track, PlayerState } from '@/types/music';
import { mockTracks } from '@/data/mockData';

interface PlayerContextType extends PlayerState {
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (progress: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  isFullPlayerOpen: boolean;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(mockTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [currentTime, setCurrentTime] = useState(71);
  const [volume, setVolume] = useState(80);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
  const [queue, setQueueState] = useState<Track[]>(mockTracks);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);

  // Simulate progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= currentTrack.duration) {
            nextTrack();
            return 0;
          }
          setProgress((newTime / currentTrack.duration) * 100);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    const index = queue.findIndex((t) => t.id === track.id);
    if (index !== -1) {
      setQueueIndex(index);
    }
  }, [queue]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    
    let nextIndex: number;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (repeat === 'one') {
      nextIndex = queueIndex;
    } else {
      nextIndex = (queueIndex + 1) % queue.length;
      if (nextIndex === 0 && repeat === 'off') {
        setIsPlaying(false);
        return;
      }
    }
    
    setQueueIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setProgress(0);
    setCurrentTime(0);
  }, [queue, queueIndex, shuffle, repeat]);

  const prevTrack = useCallback(() => {
    if (queue.length === 0) return;
    
    // If more than 3 seconds in, restart current track
    if (currentTime > 3) {
      setProgress(0);
      setCurrentTime(0);
      return;
    }
    
    const prevIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
    setQueueIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setProgress(0);
    setCurrentTime(0);
  }, [queue, queueIndex, currentTime]);

  const seek = useCallback((newProgress: number) => {
    if (!currentTrack) return;
    setProgress(newProgress);
    setCurrentTime((newProgress / 100) * currentTrack.duration);
  }, [currentTrack]);

  const toggleShuffle = useCallback(() => {
    setShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const setQueue = useCallback((tracks: Track[], startIndex = 0) => {
    setQueueState(tracks);
    setQueueIndex(startIndex);
    if (tracks[startIndex]) {
      setCurrentTrack(tracks[startIndex]);
      setProgress(0);
      setCurrentTime(0);
    }
  }, []);

  const openFullPlayer = useCallback(() => setIsFullPlayerOpen(true), []);
  const closeFullPlayer = useCallback(() => setIsFullPlayerOpen(false), []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        currentTime,
        volume,
        shuffle,
        repeat,
        queue,
        queueIndex,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        toggleShuffle,
        toggleRepeat,
        setQueue,
        isFullPlayerOpen,
        openFullPlayer,
        closeFullPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
