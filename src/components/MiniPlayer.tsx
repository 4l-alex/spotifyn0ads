import { motion } from 'framer-motion';
import { Play, Pause, SkipForward } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import { formatDuration } from '@/data/mockData';

export const MiniPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    progress,
    openFullPlayer 
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-16 left-0 right-0 z-30 mx-2 mb-2 rounded-xl mini-player overflow-hidden"
      onClick={openFullPlayer}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted">
        <motion.div 
          className="h-full bg-primary"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="flex items-center gap-3 p-3 pt-4">
        {/* Album cover */}
        <motion.img
          src={currentTrack.coverUrl}
          alt={currentTrack.album}
          className="w-12 h-12 rounded-lg object-cover"
          whileTap={{ scale: 0.95 }}
        />

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {currentTrack.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.artist}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="icon-button p-2"
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" />
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={nextTrack}
            className="icon-button p-2"
          >
            <SkipForward size={22} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
