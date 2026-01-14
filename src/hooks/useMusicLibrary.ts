import { useState, useEffect, useCallback } from 'react';
import { Track, Playlist, UserProfile, ListeningStats } from '@/types/music';
import { mockTracks, mockPlaylists } from '@/data/mockData';
import {
  isNative,
  scanMusicFiles,
  readMusicFile,
  saveUserData,
  loadUserData,
} from '@/services/nativeAudio';
import * as musicMetadata from 'music-metadata-browser';

const STORAGE_KEYS = {
  TRACKS: 'spotifynoads_tracks',
  PLAYLISTS: 'spotifynoads_playlists',
  USER_PROFILE: 'spotifynoads_user_profile',
  LISTENING_STATS: 'spotifynoads_listening_stats',
};

// Default cover image for tracks without album art
const DEFAULT_COVER = 'data:image/svg+xml,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <rect width="300" height="300" fill="#1a1a1a"/>
    <circle cx="150" cy="150" r="80" fill="none" stroke="#333" stroke-width="4"/>
    <circle cx="150" cy="150" r="30" fill="#333"/>
    <path d="M150 70 L150 100 M150 200 L150 230 M70 150 L100 150 M200 150 L230 150" stroke="#333" stroke-width="4"/>
  </svg>
`);

export const useMusicLibrary = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedTracks = await loadUserData<Track[]>(STORAGE_KEYS.TRACKS);
        const savedPlaylists = await loadUserData<Playlist[]>(STORAGE_KEYS.PLAYLISTS);
        const savedProfile = await loadUserData<UserProfile>(STORAGE_KEYS.USER_PROFILE);

        if (savedTracks && savedTracks.length > 0) {
          setTracks(savedTracks);
        }
        if (savedPlaylists && savedPlaylists.length > 0) {
          setPlaylists(savedPlaylists);
        }
        if (savedProfile) {
          setUserProfile(savedProfile);
        } else {
          // Create default profile
          const defaultProfile: UserProfile = {
            id: `user_${Date.now()}`,
            name: 'Utente',
            createdAt: new Date(),
          };
          setUserProfile(defaultProfile);
          await saveUserData(STORAGE_KEYS.USER_PROFILE, defaultProfile);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadSavedData();
  }, []);

  // Add tracks from File objects (web file input)
  const addTracksFromFiles = useCallback(async (files: File[]) => {
    const newTracks: Track[] = [];

    for (const file of files) {
      try {
        // Parse metadata from file
        const metadata = await musicMetadata.parseBlob(file);
        
        // Extract cover art if available
        let coverUrl = DEFAULT_COVER;
        if (metadata.common.picture && metadata.common.picture.length > 0) {
          const picture = metadata.common.picture[0];
          const pictureData = new Uint8Array(picture.data);
          const coverBlob = new Blob([pictureData], { type: picture.format });
          coverUrl = URL.createObjectURL(coverBlob);
        }

        // Create object URL for audio playback
        const audioUrl = URL.createObjectURL(file);

        const track: Track = {
          id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: metadata.common.title || file.name.replace('.mp3', ''),
          artist: metadata.common.artist || 'Artista sconosciuto',
          album: metadata.common.album || 'Album sconosciuto',
          duration: Math.floor(metadata.format.duration || 0),
          coverUrl,
          playCount: 0,
          totalListenTime: 0,
          // Store the audio URL for playback
          audioUrl,
        };

        newTracks.push(track);
      } catch (error) {
        console.error('Error parsing file:', file.name, error);
        // Create basic track without metadata
        const audioUrl = URL.createObjectURL(file);
        const track: Track = {
          id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: file.name.replace('.mp3', ''),
          artist: 'Artista sconosciuto',
          album: 'Album sconosciuto',
          duration: 0,
          coverUrl: DEFAULT_COVER,
          playCount: 0,
          totalListenTime: 0,
          audioUrl,
        };
        newTracks.push(track);
      }
    }

    setTracks((prev) => {
      const updated = [...prev, ...newTracks];
      // Note: We can't persist blob URLs, so on reload tracks will be lost
      // For persistence, native storage would be needed
      saveUserData(STORAGE_KEYS.TRACKS, updated.map(t => ({ ...t, audioUrl: undefined, coverUrl: DEFAULT_COVER })));
      return updated;
    });

    return newTracks;
  }, []);

  // Scan for music files (native only)
  const scanForMusic = useCallback(async () => {
    if (!isNative) {
      console.log('Not on native platform');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    try {
      const filePaths = await scanMusicFiles();
      const scannedTracks: Track[] = [];

      for (let i = 0; i < filePaths.length; i++) {
        const track = await readMusicFile(filePaths[i]);
        if (track) {
          scannedTracks.push(track);
        }
        setScanProgress(((i + 1) / filePaths.length) * 100);
      }

      if (scannedTracks.length > 0) {
        setTracks(scannedTracks);
        await saveUserData(STORAGE_KEYS.TRACKS, scannedTracks);
      }
    } catch (error) {
      console.error('Error scanning music:', error);
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  }, []);

  // Update track play count
  const updateTrackPlayCount = useCallback(async (trackId: string) => {
    setTracks((prevTracks) => {
      const updatedTracks = prevTracks.map((track) =>
        track.id === trackId
          ? { ...track, playCount: track.playCount + 1, lastPlayed: new Date() }
          : track
      );
      return updatedTracks;
    });
  }, []);

  // Update track listen time
  const updateTrackListenTime = useCallback(async (trackId: string, seconds: number) => {
    setTracks((prevTracks) => {
      const updatedTracks = prevTracks.map((track) =>
        track.id === trackId
          ? { ...track, totalListenTime: track.totalListenTime + seconds }
          : track
      );
      return updatedTracks;
    });
  }, []);

  // Create playlist
  const createPlaylist = useCallback(async (name: string, trackIds: string[] = []) => {
    const newPlaylist: Playlist = {
      id: `playlist_${Date.now()}`,
      name,
      tracks: trackIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setPlaylists((prev) => {
      const updated = [...prev, newPlaylist];
      saveUserData(STORAGE_KEYS.PLAYLISTS, updated);
      return updated;
    });

    return newPlaylist;
  }, []);

  // Add track to playlist
  const addTrackToPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    setPlaylists((prevPlaylists) => {
      const updated = prevPlaylists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              tracks: [...playlist.tracks, trackId],
              updatedAt: new Date(),
            }
          : playlist
      );
      saveUserData(STORAGE_KEYS.PLAYLISTS, updated);
      return updated;
    });
  }, []);

  // Remove track from playlist
  const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    setPlaylists((prevPlaylists) => {
      const updated = prevPlaylists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              tracks: playlist.tracks.filter((id) => id !== trackId),
              updatedAt: new Date(),
            }
          : playlist
      );
      saveUserData(STORAGE_KEYS.PLAYLISTS, updated);
      return updated;
    });
  }, []);

  // Delete playlist
  const deletePlaylist = useCallback(async (playlistId: string) => {
    setPlaylists((prev) => {
      const updated = prev.filter((p) => p.id !== playlistId);
      saveUserData(STORAGE_KEYS.PLAYLISTS, updated);
      return updated;
    });
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(
    async (updates: Partial<Pick<UserProfile, 'name' | 'imageUrl'>>) => {
      if (!userProfile) return;

      const now = new Date();
      const updatedProfile: UserProfile = {
        ...userProfile,
        ...updates,
      };

      // Track when name/image was changed for 14-day lock
      if (updates.name && updates.name !== userProfile.name) {
        updatedProfile.lastNameChange = now;
      }
      if (updates.imageUrl && updates.imageUrl !== userProfile.imageUrl) {
        updatedProfile.lastImageChange = now;
      }

      setUserProfile(updatedProfile);
      await saveUserData(STORAGE_KEYS.USER_PROFILE, updatedProfile);
    },
    [userProfile]
  );

  // Check if name can be changed (14 day lock)
  const canChangeName = useCallback((): boolean => {
    if (!userProfile?.lastNameChange) return true;
    const daysSinceChange =
      (Date.now() - new Date(userProfile.lastNameChange).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceChange >= 14;
  }, [userProfile]);

  // Check if image can be changed (14 day lock)
  const canChangeImage = useCallback((): boolean => {
    if (!userProfile?.lastImageChange) return true;
    const daysSinceChange =
      (Date.now() - new Date(userProfile.lastImageChange).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceChange >= 14;
  }, [userProfile]);

  // Get days until name change available
  const daysUntilNameChange = useCallback((): number => {
    if (!userProfile?.lastNameChange) return 0;
    const daysSinceChange =
      (Date.now() - new Date(userProfile.lastNameChange).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(14 - daysSinceChange));
  }, [userProfile]);

  // Delete all tracks
  const deleteAllTracks = useCallback(async () => {
    // Revoke all blob URLs
    tracks.forEach(track => {
      if (track.audioUrl) {
        URL.revokeObjectURL(track.audioUrl);
      }
      if (track.coverUrl && track.coverUrl.startsWith('blob:')) {
        URL.revokeObjectURL(track.coverUrl);
      }
    });
    
    setTracks([]);
    setPlaylists([]);
    await saveUserData(STORAGE_KEYS.TRACKS, []);
    await saveUserData(STORAGE_KEYS.PLAYLISTS, []);
  }, [tracks]);

  // Get listening stats
  const getListeningStats = useCallback((): ListeningStats => {
    const totalListenTime = tracks.reduce((acc, t) => acc + t.totalListenTime, 0);
    const topTracks = [...tracks].sort((a, b) => b.playCount - a.playCount).slice(0, 10);
    const storageUsed = tracks.length * 4.2 * 1024 * 1024; // ~4.2 MB per track estimate

    return {
      totalListenTime,
      totalTracks: tracks.length,
      totalPlaylists: playlists.length,
      storageUsed,
      topTracks,
    };
  }, [tracks, playlists]);

  return {
    tracks,
    playlists,
    userProfile,
    isScanning,
    scanProgress,
    isNative,
    scanForMusic,
    addTracksFromFiles,
    updateTrackPlayCount,
    updateTrackListenTime,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    deletePlaylist,
    updateUserProfile,
    canChangeName,
    canChangeImage,
    daysUntilNameChange,
    deleteAllTracks,
    getListeningStats,
  };
};
