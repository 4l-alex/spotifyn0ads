import { motion } from 'framer-motion';
import { Play, Clock, TrendingUp, Music, Plus } from 'lucide-react';
import { formatDuration } from '@/data/mockData';
import { TrackItem } from '@/components/TrackItem';
import { usePlayer } from '@/contexts/PlayerContext';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { useNavigate } from 'react-router-dom';

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
  const { tracks, playlists } = useMusicLibrary();
  const navigate = useNavigate();
  
  // Get top played tracks
  const topTracks = [...tracks].sort((a, b) => b.playCount - a.playCount).slice(0, 6);
  
  // Recent / recommended (last added)
  const recentTracks = tracks.slice(-4).reverse();

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks, 0);
      playTrack(tracks[0]);
    }
  };

  // Empty state
  if (tracks.length === 0) {
    return (
      <div className="min-h-screen pb-36 safe-top flex flex-col">
        <header className="pt-6 pb-4 px-4">
          <p className="text-muted-foreground text-sm">Buongiorno</p>
          <h1 className="text-2xl font-bold text-foreground">Benvenuto</h1>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6"
          >
            <Music size={48} className="text-muted-foreground" />
          </motion.div>
          
          <h2 className="text-xl font-bold text-foreground mb-2">
            Nessun brano nella libreria
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xs">
            Aggiungi i tuoi file MP3 per iniziare ad ascoltare la tua musica preferita
          </p>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/settings')}
            className="spotify-button flex items-center gap-2"
          >
            <Plus size={20} />
            Aggiungi brani
          </motion.button>
        </main>
      </div>
    );
  }

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
        {/* Quick Play Section - Playlists */}
        {playlists.length > 0 && (
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
          >
            <div className="grid grid-cols-2 gap-3">
              {playlists.slice(0, 4).map((playlist) => (
                <motion.div
                  key={playlist.id}
                  variants={item}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center bg-card/60 rounded-lg overflow-hidden cursor-pointer hover:bg-card transition-colors"
                >
                  <div className="w-14 h-14 bg-muted flex items-center justify-center">
                    <Music size={20} className="text-muted-foreground" />
                  </div>
                  <span className="flex-1 px-3 text-sm font-semibold text-foreground truncate">
                    {playlist.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Top Tracks Section */}
        {topTracks.length > 0 && (
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
        )}

        {/* Recently Added Section */}
        {recentTracks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-primary" />
              <h2 className="section-title mb-0">Aggiunti di recente</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {recentTracks.map((track) => (
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
                      className="w-36 h-36 rounded-xl object-cover shadow-lg bg-muted"
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
        )}

        {/* All Tracks Section */}
        <section>
          <h2 className="section-title">Tutti i brani</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-1"
          >
            {tracks.slice(0, 10).map((track) => (
              <motion.div key={track.id} variants={item}>
                <TrackItem track={track} />
              </motion.div>
            ))}
          </motion.div>
          {tracks.length > 10 && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/library')}
              className="w-full mt-4 py-3 text-center text-sm font-medium text-primary"
            >
              Vedi tutti i {tracks.length} brani →
            </motion.button>
          )}
        </section>
      </main>
    </div>
  );
};
