import { motion } from 'framer-motion';
import { Play, MoreVertical } from 'lucide-react';
import { Track } from '@/types/music';
import { formatDuration } from '@/data/mockData';
import { usePlayer } from '@/contexts/PlayerContext';

interface TrackItemProps {
  track: Track;
  index?: number;
  showIndex?: boolean;
  onLongPress?: () => void;
}

export const TrackItem = ({ track, index, showIndex = false, onLongPress }: TrackItemProps) => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const isCurrentTrack = currentTrack?.id === track.id;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => playTrack(track)}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress?.();
      }}
      className="track-card group"
    >
      {showIndex && index !== undefined && (
        <div className="w-6 text-center text-muted-foreground text-sm">
          {isCurrentTrack && isPlaying ? (
            <div className="flex items-center justify-center gap-0.5">
              <motion.div
                animate={{ height: [4, 12, 4] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-0.5 bg-primary rounded-full"
              />
              <motion.div
                animate={{ height: [8, 4, 8] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                className="w-0.5 bg-primary rounded-full"
              />
              <motion.div
                animate={{ height: [4, 10, 4] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                className="w-0.5 bg-primary rounded-full"
              />
            </div>
          ) : (
            <span>{index + 1}</span>
          )}
        </div>
      )}
      
      <div className="relative">
        <img
          src={track.coverUrl}
          alt={track.album}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Play size={20} fill="white" className="text-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-primary' : 'text-foreground'}`}>
          {track.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {track.artist}
        </p>
      </div>
      
      <span className="text-xs text-muted-foreground">
        {formatDuration(track.duration)}
      </span>
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onLongPress?.();
        }}
        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MoreVertical size={18} className="text-muted-foreground" />
      </motion.button>
    </motion.div>
  );
};
