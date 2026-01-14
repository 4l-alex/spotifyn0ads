import { motion } from 'framer-motion';
import { Play, Clock, TrendingUp } from 'lucide-react';
import { mockTracks, mockPlaylists, formatDuration } from '@/data/mockData';
import { TrackItem } from '@/components/TrackItem';
import { usePlayer } from '@/contexts/PlayerContext';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const Home = () => {
  const { playTrack, setQueue } = usePlayer();
  
  // Get top played tracks
  const topTracks = [...mockTracks].sort((a, b) => b.playCount - a.playCount).slice(0, 6);
  
  // Recent / recommended (simulated)
  const recommendedTracks = mockTracks.slice(0, 4);

  const handlePlayAll = () => {
    setQueue(mockTracks, 0);
    playTrack(mockTracks[0]);
  };

  return (
    <div className="min-h-screen pb-36 safe-top">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-background via-background/95 to-transparent pb-4 pt-6 px-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Buongiorno</p>
            <h1 className="text-2xl font-bold text-foreground">Benvenuto</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAll}
            className="spotify-button flex items-center gap-2 text-sm py-2 px-4"
          >
            <Play size={18} fill="currentColor" />
            Riproduci
          </motion.button>
        </div>
      </header>

      <main className="px-4 space-y-8">
        {/* Quick Play Section */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-2 gap-3">
            {mockPlaylists.slice(0, 4).map((playlist) => (
              <motion.div
                key={playlist.id}
                variants={item}
                whileTap={{ scale: 0.98 }}
                className="flex items-center bg-card/60 rounded-lg overflow-hidden cursor-pointer hover:bg-card transition-colors"
              >
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-14 h-14 object-cover"
                />
                <span className="flex-1 px-3 text-sm font-semibold text-foreground truncate">
                  {playlist.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Top Tracks Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="section-title mb-0">Più ascoltati</h2>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-1"
          >
            {topTracks.map((track, index) => (
              <motion.div key={track.id} variants={item}>
                <TrackItem track={track} index={index} showIndex />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Recommended Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-primary" />
            <h2 className="section-title mb-0">Consigliati per te</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {recommendedTracks.map((track) => (
              <motion.div
                key={track.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => playTrack(track)}
                className="flex-shrink-0 w-36 cursor-pointer group"
              >
                <div className="relative mb-3">
                  <img
                    src={track.coverUrl}
                    alt={track.album}
                    className="w-36 h-36 rounded-xl object-cover shadow-lg"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-2 right-2 bg-primary rounded-full p-3 shadow-lg"
                  >
                    <Play size={18} fill="black" className="text-primary-foreground" />
                  </motion.div>
                </div>
                <p className="text-sm font-semibold text-foreground truncate">
                  {track.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artist}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recently Played */}
        <section>
          <h2 className="section-title">Ascoltati di recente</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-1"
          >
            {mockTracks.slice(4, 8).map((track) => (
              <motion.div key={track.id} variants={item}>
                <TrackItem track={track} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
};
