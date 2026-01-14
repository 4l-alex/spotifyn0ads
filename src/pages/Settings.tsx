import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Palette, 
  BarChart3, 
  Trash2, 
  ChevronRight,
  Moon,
  Sun,
  HardDrive,
  Music,
  ListMusic,
  Clock,
  TrendingUp,
  AlertTriangle,
  Camera
} from 'lucide-react';
import { mockTracks, mockPlaylists, formatListenTime } from '@/data/mockData';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [profileName, setProfileName] = useState('Utente');
  const [isEditingName, setIsEditingName] = useState(false);

  // Calculate stats
  const totalTracks = mockTracks.length;
  const totalPlaylists = mockPlaylists.length;
  const totalListenTime = mockTracks.reduce((acc, t) => acc + t.totalListenTime, 0);
  const storageUsed = totalTracks * 4.2; // ~4.2 MB per track average

  const topTracks = [...mockTracks]
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 5);

  return (
    <div className="min-h-screen pb-36 safe-top">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl pt-6 pb-4 px-4">
        <h1 className="text-2xl font-bold text-foreground">Impostazioni</h1>
      </header>

      <main className="px-4 space-y-6">
        {/* Profile Section */}
        <section className="bg-card rounded-2xl overflow-hidden">
          <div className="p-4 flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <User size={32} className="text-muted-foreground" />
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5"
              >
                <Camera size={12} className="text-primary-foreground" />
              </motion.button>
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  className="bg-muted rounded-lg px-3 py-1 text-lg font-semibold text-foreground w-full"
                  autoFocus
                />
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditingName(true)}
                  className="text-left"
                >
                  <p className="text-lg font-semibold text-foreground">{profileName}</p>
                  <p className="text-sm text-muted-foreground">Tocca per modificare</p>
                </motion.button>
              )}
            </div>
          </div>
          <p className="px-4 pb-4 text-xs text-muted-foreground">
            Prossima modifica disponibile tra 14 giorni
          </p>
        </section>

        {/* Appearance */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Palette size={18} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Aspetto
            </h2>
          </div>
          <div className="bg-card rounded-2xl overflow-hidden">
            <div className="settings-item">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                <span className="text-foreground">Tema scuro</span>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowStats(!showStats)}
            className="w-full"
          >
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={18} className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Statistiche
              </h2>
              <motion.div
                animate={{ rotate: showStats ? 90 : 0 }}
                className="ml-auto"
              >
                <ChevronRight size={18} className="text-muted-foreground" />
              </motion.div>
            </div>
          </motion.button>

          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-card rounded-2xl p-4 space-y-4">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="stat-card">
                      <HardDrive size={20} className="text-primary mb-2" />
                      <p className="text-2xl font-bold text-foreground">
                        {storageUsed.toFixed(1)} MB
                      </p>
                      <p className="text-xs text-muted-foreground">Spazio occupato</p>
                    </div>
                    <div className="stat-card">
                      <Music size={20} className="text-primary mb-2" />
                      <p className="text-2xl font-bold text-foreground">{totalTracks}</p>
                      <p className="text-xs text-muted-foreground">Brani totali</p>
                    </div>
                    <div className="stat-card">
                      <ListMusic size={20} className="text-primary mb-2" />
                      <p className="text-2xl font-bold text-foreground">{totalPlaylists}</p>
                      <p className="text-xs text-muted-foreground">Playlist</p>
                    </div>
                    <div className="stat-card">
                      <Clock size={20} className="text-primary mb-2" />
                      <p className="text-2xl font-bold text-foreground">
                        {formatListenTime(totalListenTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">Tempo di ascolto</p>
                    </div>
                  </div>

                  {/* Top Tracks */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Brani più ascoltati
                      </span>
                    </div>
                    <div className="space-y-2">
                      {topTracks.map((track, index) => (
                        <div
                          key={track.id}
                          className="flex items-center gap-3 py-2"
                        >
                          <span className="w-5 text-center text-sm text-muted-foreground font-medium">
                            {index + 1}
                          </span>
                          <img
                            src={track.coverUrl}
                            alt={track.album}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {track.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {track.playCount} ascolti • {formatListenTime(track.totalListenTime)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Library Management */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Trash2 size={18} className="text-destructive" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Gestione libreria
            </h2>
          </div>
          <div className="bg-card rounded-2xl overflow-hidden">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDeleteDialog(true)}
              className="settings-item w-full text-left border-none"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-destructive" />
                <span className="text-destructive">Cancella tutti i brani</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </motion.button>
          </div>
        </section>

        {/* App Info */}
        <section className="text-center py-8">
          <p className="text-sm text-muted-foreground">SpotifyNoads v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">
            Nessuna pubblicità • Completamente offline
          </p>
        </section>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Cancellare tutti i brani?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Questa azione è irreversibile. Tutti i brani, le playlist e le
              statistiche verranno eliminati definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-foreground border-none">
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground">
              Elimina tutto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
