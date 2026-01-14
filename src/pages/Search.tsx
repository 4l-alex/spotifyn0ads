import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Music, Plus } from 'lucide-react';
import { TrackItem } from '@/components/TrackItem';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { useNavigate } from 'react-router-dom';

export const Search = () => {
  const [query, setQuery] = useState('');
  const { tracks } = useMusicLibrary();
  const navigate = useNavigate();

  // Extract unique albums and artists from tracks
  const albums = useMemo(() => {
    return tracks.reduce((acc, track) => {
      const existing = acc.find(a => a.name === track.album && a.artist === track.artist);
      if (!existing) {
        acc.push({
          id: `album_${track.album}_${track.artist}`,
          name: track.album,
          artist: track.artist,
          coverUrl: track.coverUrl,
        });
      }
      return acc;
    }, [] as { id: string; name: string; artist: string; coverUrl: string }[]);
  }, [tracks]);

  const artists = useMemo(() => {
    return tracks.reduce((acc, track) => {
      const existing = acc.find(a => a.name === track.artist);
      if (!existing) {
        acc.push({
          id: `artist_${track.artist}`,
          name: track.artist,
          imageUrl: track.coverUrl,
        });
      }
      return acc;
    }, [] as { id: string; name: string; imageUrl: string }[]);
  }, [tracks]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return { tracks: [], albums: [], artists: [] };
    
    const lowerQuery = query.toLowerCase();
    
    return {
      tracks: tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(lowerQuery) ||
          t.artist.toLowerCase().includes(lowerQuery) ||
          t.album.toLowerCase().includes(lowerQuery)
      ),
      albums: albums.filter(
        (a) =>
          a.name.toLowerCase().includes(lowerQuery) ||
          a.artist.toLowerCase().includes(lowerQuery)
      ),
      artists: artists.filter((a) =>
        a.name.toLowerCase().includes(lowerQuery)
      ),
    };
  }, [query, tracks, albums, artists]);

  const hasResults =
    searchResults.tracks.length > 0 ||
    searchResults.albums.length > 0 ||
    searchResults.artists.length > 0;

  // Empty state when no tracks
  if (tracks.length === 0) {
    return (
      <div className="min-h-screen pb-36 safe-top flex flex-col">
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl pt-6 pb-4 px-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Cerca</h1>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6"
          >
            <SearchIcon size={48} className="text-muted-foreground" />
          </motion.div>
          
          <h2 className="text-xl font-bold text-foreground mb-2">
            Nessun brano da cercare
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xs">
            Aggiungi i tuoi file MP3 per poterli cercare
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
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl pt-6 pb-4 px-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Cerca</h1>
        
        <div className="relative">
          <SearchIcon 
            size={20} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Brani, artisti o album"
            className="search-input w-full pl-12 pr-10"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
              >
                <X size={18} className="text-muted-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="px-4">
        <AnimatePresence mode="wait">
          {query ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {hasResults ? (
                <div className="space-y-6">
                  {/* Artists */}
                  {searchResults.artists.length > 0 && (
                    <section>
                      <h2 className="section-title text-base">Artisti</h2>
                      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                        {searchResults.artists.map((artist) => (
                          <motion.div
                            key={artist.id}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2 cursor-pointer"
                          >
                            <img
                              src={artist.imageUrl}
                              alt={artist.name}
                              className="w-24 h-24 rounded-full object-cover bg-muted"
                            />
                            <span className="text-sm font-medium text-foreground">
                              {artist.name}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Albums */}
                  {searchResults.albums.length > 0 && (
                    <section>
                      <h2 className="section-title text-base">Album</h2>
                      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                        {searchResults.albums.map((album) => (
                          <motion.div
                            key={album.id}
                            whileTap={{ scale: 0.95 }}
                            className="flex-shrink-0 w-32 cursor-pointer"
                          >
                            <img
                              src={album.coverUrl}
                              alt={album.name}
                              className="w-32 h-32 rounded-xl object-cover mb-2 bg-muted"
                            />
                            <p className="text-sm font-medium text-foreground truncate">
                              {album.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {album.artist}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Tracks */}
                  {searchResults.tracks.length > 0 && (
                    <section>
                      <h2 className="section-title text-base">Brani</h2>
                      <div className="space-y-1">
                        {searchResults.tracks.map((track) => (
                          <TrackItem key={track.id} track={track} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <SearchIcon size={48} className="text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground">
                    Nessun risultato per "{query}"
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Prova con parole diverse
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="section-title">Sfoglia la libreria</h2>
              <p className="text-muted-foreground text-sm mb-6">
                {tracks.length} brani disponibili
              </p>
              
              {/* Show first few tracks as suggestions */}
              <div className="space-y-1">
                {tracks.slice(0, 8).map((track) => (
                  <TrackItem key={track.id} track={track} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
