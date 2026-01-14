import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Music, Mic2, Disc3, Users } from 'lucide-react';
import { mockTracks, mockAlbums, mockArtists } from '@/data/mockData';
import { TrackItem } from '@/components/TrackItem';

const categories = [
  { id: 'pop', name: 'Pop', color: 'from-pink-500 to-rose-600', icon: Music },
  { id: 'rock', name: 'Rock', color: 'from-red-500 to-orange-600', icon: Mic2 },
  { id: 'hiphop', name: 'Hip Hop', color: 'from-purple-500 to-violet-600', icon: Disc3 },
  { id: 'jazz', name: 'Jazz', color: 'from-amber-500 to-yellow-600', icon: Users },
  { id: 'electronic', name: 'Elettronica', color: 'from-cyan-500 to-blue-600', icon: Disc3 },
  { id: 'classical', name: 'Classica', color: 'from-emerald-500 to-teal-600', icon: Music },
];

export const Search = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return { tracks: [], albums: [], artists: [] };
    
    const lowerQuery = query.toLowerCase();
    
    return {
      tracks: mockTracks.filter(
        (t) =>
          t.title.toLowerCase().includes(lowerQuery) ||
          t.artist.toLowerCase().includes(lowerQuery) ||
          t.album.toLowerCase().includes(lowerQuery)
      ),
      albums: mockAlbums.filter(
        (a) =>
          a.name.toLowerCase().includes(lowerQuery) ||
          a.artist.toLowerCase().includes(lowerQuery)
      ),
      artists: mockArtists.filter((a) =>
        a.name.toLowerCase().includes(lowerQuery)
      ),
    };
  }, [query]);

  const hasResults =
    searchResults.tracks.length > 0 ||
    searchResults.albums.length > 0 ||
    searchResults.artists.length > 0;

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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
                              className="w-24 h-24 rounded-full object-cover"
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
                              className="w-32 h-32 rounded-xl object-cover mb-2"
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
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="section-title">Esplora per genere</h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={category.id}
                      whileTap={{ scale: 0.95 }}
                      className={`relative h-24 rounded-xl bg-gradient-to-br ${category.color} overflow-hidden cursor-pointer`}
                    >
                      <span className="absolute left-4 top-4 text-lg font-bold text-white">
                        {category.name}
                      </span>
                      <Icon 
                        size={60} 
                        className="absolute -right-2 -bottom-2 text-white/20 rotate-12" 
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
