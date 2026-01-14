import { useCallback, useEffect, useRef } from 'react';
import { Track } from '@/types/music';
import {
  initAudio,
  getAudioElement,
  playAudio,
  pauseAudio,
  resumeAudio,
  seekAudio,
  setVolume,
  setupMediaSession,
  updateMediaSessionState,
  getFileUrl,
  isNative,
} from '@/services/nativeAudio';

interface UseNativePlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onTrackEnd: () => void;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const useNativePlayer = ({
  currentTrack,
  isPlaying,
  onTimeUpdate,
  onTrackEnd,
  onPlay,
  onPause,
  onNext,
  onPrevious,
}: UseNativePlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isNativeTrack = useRef(false);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = initAudio();

    const audio = audioRef.current;
    
    // Event listeners
    const handleTimeUpdate = () => {
      if (audio) {
        onTimeUpdate(audio.currentTime, audio.duration || 0);
      }
    };

    const handleEnded = () => {
      onTrackEnd();
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onTimeUpdate, onTrackEnd]);

  // Load and play track
  useEffect(() => {
    const loadTrack = async () => {
      if (!currentTrack || !audioRef.current) return;

      // Check if this is a native file path
      if (isNative && currentTrack.id.includes('/')) {
        isNativeTrack.current = true;
        const fileUrl = await getFileUrl(currentTrack.id);
        if (fileUrl) {
          audioRef.current.src = fileUrl;
        }
      } else {
        // For mock data, we don't have actual audio files
        isNativeTrack.current = false;
        // In production, you would set the actual audio source
      }

      // Setup media session for lockscreen controls
      setupMediaSession(currentTrack, {
        onPlay,
        onPause,
        onNext,
        onPrevious,
        onSeek: (time) => {
          if (audioRef.current) {
            audioRef.current.currentTime = time;
          }
        },
      });
    };

    loadTrack();
  }, [currentTrack, onPlay, onPause, onNext, onPrevious]);

  // Handle play/pause state
  useEffect(() => {
    if (!audioRef.current || !isNativeTrack.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
      updateMediaSessionState('playing');
    } else {
      audioRef.current.pause();
      updateMediaSessionState('paused');
    }
  }, [isPlaying]);

  // Seek function
  const seek = useCallback((percentage: number) => {
    if (audioRef.current && isNativeTrack.current) {
      seekAudio(percentage);
    }
  }, []);

  // Volume control
  const changeVolume = useCallback((volume: number) => {
    setVolume(volume);
  }, []);

  return {
    seek,
    changeVolume,
    isNativeTrack: isNativeTrack.current,
  };
};
