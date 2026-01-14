import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Track } from '@/types/music';
import { parseMp3 } from '@/lib/parseMp3';

type RepeatMode = 'off' | 'one' | 'all';

interface PlayerContextProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // 0-100
  currentTime: number; // secondi
  shuffle: boolean;
  repeat: RepeatMode;
  isFullPlayerOpen: boolean;

  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  seek: (percentage: number) => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  addTrackFromFile: (file: File) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const PlayerProvider = ({ children }: ProviderProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);

  // Aggiorna audio quando cambia il currentTrack
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = URL.createObjectURL(currentTrack.file);
    if (isPlaying) audio.play();

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrack, isPlaying]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (!queue.length) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    let nextIndex = currentIndex + 1;
    if (shuffle) nextIndex = Math.floor(Math.random() * queue.length);
    if (nextIndex >= queue.length) nextIndex = repeat === 'all' ? 0 : queue.length - 1;
    playTrack(queue[nextIndex]);
  };

  const prevTrack = () => {
    if (!queue.length) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    let prevIndex = currentIndex - 1;
    if (shuffle) prevIndex = Math.floor(Math.random() * queue.length);
    if (prevIndex < 0) prevIndex = repeat === 'all' ? queue.length - 1 : 0;
    playTrack(queue[prevIndex]);
  };

  const toggleShuffle = () => setShuffle(!shuffle);
  const toggleRepeat = () => {
    if (repeat === 'off') setRepeat('all');
    else if (repeat === 'all') setRepeat('one');
    else setRepeat('off');
  };

  const seek = (percentage: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const time = (percentage / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    setProgress(percentage);
  };

  const openFullPlayer = () => setIsFullPlayerOpen(true);
  const closeFullPlayer = () => setIsFullPlayerOpen(false);

  const handleTrackEnd = () => {
    if (repeat === 'one') {
      audioRef.current!.currentTime = 0;
      audioRef.current!.play();
    } else {
      nextTrack();
    }
  };

  const addTrackFromFile = async (file: File) => {
    const track = await parseMp3(file);
    setQueue(prev => [...prev, track]);
    playTrack(track);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        currentTime,
        shuffle,
        repeat,
        isFullPlayerOpen,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        toggleShuffle,
        toggleRepeat,
        seek,
        openFullPlayer,
        closeFullPlayer,
        addTrackFromFile,
      }}
    >
      {children}
      <audio ref={audioRef} hidden />
    </PlayerContext.Provider>
  );
};
