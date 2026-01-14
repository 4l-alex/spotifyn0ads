import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, ListMusic, Disc, Users, Plus, Play } from 'lucide-react';
import { TrackItem } from '@/components/TrackItem';
import { usePlayer } from '@/contexts/PlayerContext';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { useNavigate } from 'react-router-dom';

type Tab = 'tracks' | 'playlists' | 'albums' | 'artists';

const tabs: { id: Tab; label: string; icon: typeof Music }[] = [
  { id: 'tracks', label: 'Brani', icon: Music },
  { id: 'playlists', label: 'Playlist', icon: ListMusic },
  { id: 'albums', label: 'Album', icon: Disc },
  { id: 'artists', label: 'Artisti', icon: Users },
];

export const Library = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tracks');
  const { playTrack, setQueue } = usePlayer();
  const { tracks, playlists } = useMusicLibrary();
  const navigate = useNavigate();

  // Extract unique albums and artists from tracks
  const albums = tracks.reduce((acc, track) => {
    const existing = acc.find(a => a.name === track.album && a.artist === track.artist);
    if (existing) {
      existing.tracks.push(track.id);
    } else {
      acc.push({
        id: `album_${track.album}_${track.artist}`,
        name: track.album,
        artist: track.artist,
        coverUrl: track.coverUrl,
        tracks: [track.id],
      });
    }
    return acc;
  }, [] as { id: string; name: string; artist: string; coverUrl: string; tracks: string[] }[]);

  const artists = tracks.reduce((acc, track) => {
    const existing = acc.find(a => a.name === track.artist);
    if (existing) {
      existing.tracks.push(track.id);
    } else {
      acc.push({
        id: `artist_${track.artist}`,
        name: track.artist,
        imageUrl: track.coverUrl,
        tracks: [track.id],
      });
    }
    return acc;
  }, [] as { id: string; name: string; imageUrl: string; tracks: string[] }[]);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks, 0);
      playTrack(tracks[0]);
    }
  };

  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Music size={32} className="text-muted-foreground" />
      </div>
      <p className="text-muted-foreground mb-4">{message}</p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/settings')}
        className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-2 text-sm font-semibold"
      >
        <Plus size={18} />
        Aggiungi brani
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen pb-36 safe-top">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl pt-6 pb-2 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">La tua libreria</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/settings')}
            className="icon-button"
          >
            <Plus size={24} />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </header>

      <main className="px-4 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'tracks' && (
            <motion.div
              key="tracks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {tracks.length === 0 ? (
                renderEmptyState('Nessun brano nella libreria')
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      {tracks.length} brani
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayAll}
                      className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-semibold"
                    >
                      <Play size={16} fill="currentColor" />
                      Riproduci tutto
                    </motion.button>
                  </div>
                  <div className="space-y-1">
                    {tracks.map((track, index) => (
                      <TrackItem key={track.id} track={track} index={index} showIndex />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'playlists' && (
            <motion.div
              key="playlists"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {playlists.length === 0 ? (
                renderEmptyState('Nessuna playlist creata')
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      {playlists.length} playlist
                    </p>
                  </div>
                  <div className="space-y-3">
                    {playlists.map((playlist) => (
                      <motion.div
                        key={playlist.id}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-3 rounded-xl bg-card/50 cursor-pointer hover:bg-card transition-colors"
                      >
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <ListMusic size={24} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{playlist.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {playlist.tracks.length} brani
                          </p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="bg-primary rounded-full p-3"
                        >
                          <Play size={18} fill="black" className="text-primary-foreground ml-0.5" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'albums' && (
            <motion.div
              key="albums"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {albums.length === 0 ? (
                renderEmptyState('Nessun album nella libreria')
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      {albums.length} album
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {albums.map((album) => (
                      <motion.div
                        key={album.id}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer"
                      >
                        <div className="relative mb-3">
                          <img
                            src={album.coverUrl}
                            alt={album.name}
                            className="w-full aspect-square rounded-xl object-cover shadow-lg bg-muted"
                          />
                        </div>
                        <p className="font-semibold text-foreground truncate">{album.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {album.artist} • {album.tracks.length} brani
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'artists' && (
            <motion.div
              key="artists"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {artists.length === 0 ? (
                renderEmptyState('Nessun artista nella libreria')
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      {artists.length} artisti
                    </p>
                  </div>
                  <div className="space-y-3">
                    {artists.map((artist) => (
                      <motion.div
                        key={artist.id}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-card/50 transition-colors"
                      >
                        <img
                          src={artist.imageUrl}
                          alt={artist.name}
                          className="w-16 h-16 rounded-full object-cover bg-muted"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{artist.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {artist.tracks.length} brani
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
