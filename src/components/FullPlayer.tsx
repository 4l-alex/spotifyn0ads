import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { 
  ChevronDown, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import { formatDuration } from '@/data/mockData';
import { useState } from 'react';

export const FullPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack,
    progress,
    currentTime,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
    seek,
    isFullPlayerOpen,
    closeFullPlayer
  } = usePlayer();

  const [liked, setLiked] = useState(false);

  if (!currentTrack) return null;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      closeFullPlayer();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    seek(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <AnimatePresence>
      {isFullPlayerOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          onDragEnd={handleDragEnd}
          className="fixed inset-0 z-50 full-player flex flex-col safe-top safe-bottom"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 pt-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={closeFullPlayer}
              className="icon-button"
            >
              <ChevronDown size={28} />
            </motion.button>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                In riproduzione
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5">
                {currentTrack.album}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="icon-button"
            >
              <MoreHorizontal size={24} />
            </motion.button>
          </div>

          {/* Album Art */}
          <div className="flex-1 flex items-center justify-center px-8 py-4">
            <motion.img
              src={currentTrack.coverUrl}
              alt={currentTrack.album}
              className="w-full max-w-sm aspect-square rounded-2xl shadow-2xl object-cover"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              key={currentTrack.id}
            />
          </div>

          {/* Track Info */}
          <div className="px-8">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold text-foreground truncate">
                  {currentTrack.title}
                </h2>
                <p className="text-lg text-muted-foreground truncate">
                  {currentTrack.artist}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setLiked(!liked)}
                className="icon-button ml-4"
              >
                <Heart 
                  size={24} 
                  className={liked ? 'text-primary' : ''} 
                  fill={liked ? 'currentColor' : 'none'} 
                />
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 mt-8">
            <div 
              className="progress-bar h-1.5 cursor-pointer"
              onClick={handleProgressClick}
            >
              <motion.div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{formatDuration(Math.floor(currentTime))}</span>
              <span>{formatDuration(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="px-8 mt-6 mb-8">
            <div className="flex items-center justify-between">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleShuffle}
                className={`icon-button ${shuffle ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Shuffle size={22} />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={prevTrack}
                className="icon-button"
              >
                <SkipBack size={32} fill="currentColor" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="icon-button-primary"
              >
                {isPlaying ? (
                  <Pause size={32} fill="currentColor" />
                ) : (
                  <Play size={32} fill="currentColor" className="ml-1" />
                )}
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={nextTrack}
                className="icon-button"
              >
                <SkipForward size={32} fill="currentColor" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleRepeat}
                className={`icon-button ${repeat !== 'off' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {repeat === 'one' ? <Repeat1 size={22} /> : <Repeat size={22} />}
              </motion.button>
            </div>
          </div>

          {/* Swipe indicator */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
