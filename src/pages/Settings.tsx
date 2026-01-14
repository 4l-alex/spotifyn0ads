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
  Camera,
  FolderSearch,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { formatListenTime } from '@/data/mockData';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
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
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { isNative, platform } from '@/services/nativeAudio';

export const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const {
    tracks,
    playlists,
    userProfile,
    isScanning,
    scanProgress,
    scanForMusic,
    updateUserProfile,
    canChangeName,
    daysUntilNameChange,
    deleteAllTracks,
    getListeningStats,
  } = useMusicLibrary();

  const stats = getListeningStats();
  const storageUsedMB = stats.storageUsed / (1024 * 1024);

  const handleDeleteAll = async () => {
    await deleteAllTracks();
    setShowDeleteDialog(false);
  };

  const handleNameChange = async (newName: string) => {
    if (canChangeName()) {
      await updateUserProfile({ name: newName });
    }
    setIsEditingName(false);
  };

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
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {userProfile?.imageUrl ? (
                  <img 
                    src={userProfile.imageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-muted-foreground" />
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5"
              >
                <Camera size={12} className="text-primary-foreground" />
              </motion.button>
            </div>
            <div className="flex-1">
              {isEditingName && canChangeName() ? (
                <input
                  type="text"
                  defaultValue={userProfile?.name || 'Utente'}
                  onBlur={(e) => handleNameChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameChange((e.target as HTMLInputElement).value)}
                  className="bg-muted rounded-lg px-3 py-1 text-lg font-semibold text-foreground w-full"
                  autoFocus
                />
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => canChangeName() && setIsEditingName(true)}
                  className="text-left"
                >
                  <p className="text-lg font-semibold text-foreground">
                    {userProfile?.name || 'Utente'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {canChangeName() ? 'Tocca per modificare' : `Modifica bloccata`}
                  </p>
                </motion.button>
              )}
            </div>
          </div>
          {!canChangeName() && (
            <p className="px-4 pb-4 text-xs text-muted-foreground">
              Prossima modifica disponibile tra {daysUntilNameChange()} giorni
            </p>
          )}
        </section>

        {/* Music Scanning - Only show on native */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <FolderSearch size={18} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Scansione Musica
            </h2>
          </div>
          <div className="bg-card rounded-2xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone size={20} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    {isNative 
                      ? `Piattaforma: ${platform === 'android' ? 'Android' : 'iOS'}`
                      : 'Modalità Web (Demo)'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isNative 
                      ? 'Scansiona le cartelle Music, Download e Documents'
                      : 'Installa l\'app nativa per accedere ai file MP3'}
                  </p>
                </div>
              </div>

              {isScanning && (
                <div className="mb-4">
                  <Progress value={scanProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Scansione in corso... {Math.round(scanProgress)}%
                  </p>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={scanForMusic}
                disabled={isScanning || !isNative}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors ${
                  isNative 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <RefreshCw size={18} className={isScanning ? 'animate-spin' : ''} />
                {isScanning ? 'Scansione...' : 'Scansiona file MP3'}
              </motion.button>

              {!isNative && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Per utilizzare questa funzione, esporta il progetto su GitHub e compila con Capacitor
                </p>
              )}
            </div>
          </div>
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
                        {storageUsedMB.toFixed(1)} MB
                      </p>
                      <p className="text-xs text-muted-foreground">Spazio occupato</p>
                    </div>
                    <div className="stat-card">
                      <Music size={20} className="text-primary mb-2" />
                      <p className="text-2xl font-bold text-foreground">{stats.totalTracks}</p>
                      <p className="text-xs text-muted-foreground">Brani totali</p>
                    </div>
                    <div className="stat-card">
                      <ListMusic size={20} className="text-primary mb-2" />
                      <p className="text-2xl font-bold text-foreground">{stats.totalPlaylists}</p>
                      <p className="text-xs text-muted-foreground">Playlist</p>
                    </div>
                    <div className="stat-card">
                      <Clock size={20} className="text-primary mb-2" />
                      <p className="text-2xl font-bold text-foreground">
                        {formatListenTime(stats.totalListenTime)}
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
                      {stats.topTracks.slice(0, 5).map((track, index) => (
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
          {isNative && (
            <p className="text-xs text-primary mt-2">
              ✓ Capacitor attivo su {platform}
            </p>
          )}
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
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground"
              onClick={handleDeleteAll}
            >
              Elimina tutto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
