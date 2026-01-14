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

const STORAGE_KEYS = {
  TRACKS: 'spotifynoads_tracks',
  PLAYLISTS: 'spotifynoads_playlists',
  USER_PROFILE: 'spotifynoads_user_profile',
  LISTENING_STATS: 'spotifynoads_listening_stats',
};

export const useMusicLibrary = () => {
  const [tracks, setTracks] = useState<Track[]>(mockTracks);
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
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

  // Scan for music files
  const scanForMusic = useCallback(async () => {
    if (!isNative) {
      console.log('Not on native platform, using mock data');
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
      saveUserData(STORAGE_KEYS.TRACKS, updatedTracks);
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
      saveUserData(STORAGE_KEYS.TRACKS, updatedTracks);
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
    setTracks([]);
    setPlaylists([]);
    await saveUserData(STORAGE_KEYS.TRACKS, []);
    await saveUserData(STORAGE_KEYS.PLAYLISTS, []);
  }, []);

  // Get listening stats
  const getListeningStats = useCallback((): ListeningStats => {
    const totalListenTime = tracks.reduce((acc, t) => acc + t.totalListenTime, 0);
    const topTracks = [...tracks].sort((a, b) => b.playCount - a.playCount).slice(0, 10);
    const storageUsed = tracks.length * 4.2 * 1024 * 1024; // ~4.2 MB per track

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
