import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Track } from '@/types/music';
import * as musicMetadata from 'music-metadata-browser';

// Check if running on native platform
export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

// Audio element for playback
let audioElement: HTMLAudioElement | null = null;

// Initialize audio element
export const initAudio = (): HTMLAudioElement => {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.preload = 'auto';
    
    // Enable background playback on iOS
    if (platform === 'ios') {
      (audioElement as any).webkitPreservesPitch = true;
    }
  }
  return audioElement;
};

// Get audio element
export const getAudioElement = (): HTMLAudioElement | null => audioElement;

// Play audio from URL or file path
export const playAudio = async (src: string): Promise<void> => {
  const audio = initAudio();
  audio.src = src;
  await audio.play();
};

// Pause audio
export const pauseAudio = (): void => {
  audioElement?.pause();
};

// Resume audio
export const resumeAudio = async (): Promise<void> => {
  await audioElement?.play();
};

// Seek to position (0-100)
export const seekAudio = (percentage: number): void => {
  if (audioElement) {
    audioElement.currentTime = (percentage / 100) * audioElement.duration;
  }
};

// Get current time
export const getCurrentTime = (): number => {
  return audioElement?.currentTime || 0;
};

// Get duration
export const getDuration = (): number => {
  return audioElement?.duration || 0;
};

// Set volume (0-100)
export const setVolume = (volume: number): void => {
  if (audioElement) {
    audioElement.volume = volume / 100;
  }
};

// Scan for MP3 files on device
export const scanMusicFiles = async (): Promise<string[]> => {
  if (!isNative) {
    console.log('Not running on native platform, using mock data');
    return [];
  }

  try {
    const musicPaths: string[] = [];
    
    // Common music directories
    const directories = [
      'Music',
      'Download',
      'Downloads',
      'Documents/Music',
    ];

    for (const dir of directories) {
      try {
        const result = await Filesystem.readdir({
          path: dir,
          directory: Directory.ExternalStorage,
        });

        for (const file of result.files) {
          if (file.name.toLowerCase().endsWith('.mp3')) {
            musicPaths.push(`${dir}/${file.name}`);
          }
        }
      } catch (e) {
        // Directory might not exist, skip
        console.log(`Could not read directory: ${dir}`);
      }
    }

    return musicPaths;
  } catch (error) {
    console.error('Error scanning music files:', error);
    return [];
  }
};

// Read MP3 file and extract metadata
export const readMusicFile = async (filePath: string): Promise<Track | null> => {
  if (!isNative) {
    return null;
  }

  try {
    // Read file as base64
    const file = await Filesystem.readFile({
      path: filePath,
      directory: Directory.ExternalStorage,
    });

    // Convert base64 to Blob
    const base64Data = file.data as string;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/mpeg' });

    // Parse metadata
    const metadata = await musicMetadata.parseBlob(blob);

    // Extract cover art if available
    let coverUrl = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop';
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0];
      // Convert Buffer to Uint8Array for Blob compatibility
      const pictureData = new Uint8Array(picture.data);
      const coverBlob = new Blob([pictureData], { type: picture.format });
      coverUrl = URL.createObjectURL(coverBlob);
    }

    const track: Track = {
      id: filePath,
      title: metadata.common.title || filePath.split('/').pop()?.replace('.mp3', '') || 'Unknown',
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      duration: Math.floor(metadata.format.duration || 0),
      coverUrl,
      playCount: 0,
      totalListenTime: 0,
    };

    return track;
  } catch (error) {
    console.error('Error reading music file:', error);
    return null;
  }
};

// Get file URL for playback
export const getFileUrl = async (filePath: string): Promise<string | null> => {
  if (!isNative) {
    return null;
  }

  try {
    const result = await Filesystem.getUri({
      path: filePath,
      directory: Directory.ExternalStorage,
    });
    
    // On Android, use Capacitor's WebView URL
    if (platform === 'android') {
      return Capacitor.convertFileSrc(result.uri);
    }
    
    return result.uri;
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null;
  }
};

// Save user data to preferences
export const saveUserData = async (key: string, value: any): Promise<void> => {
  await Preferences.set({
    key,
    value: JSON.stringify(value),
  });
};

// Load user data from preferences
export const loadUserData = async <T>(key: string): Promise<T | null> => {
  const result = await Preferences.get({ key });
  if (result.value) {
    return JSON.parse(result.value) as T;
  }
  return null;
};

// Media Session API for lockscreen controls
export const setupMediaSession = (
  track: Track,
  callbacks: {
    onPlay: () => void;
    onPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onSeek?: (time: number) => void;
  }
): void => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: [
        { src: track.coverUrl, sizes: '96x96', type: 'image/png' },
        { src: track.coverUrl, sizes: '128x128', type: 'image/png' },
        { src: track.coverUrl, sizes: '192x192', type: 'image/png' },
        { src: track.coverUrl, sizes: '256x256', type: 'image/png' },
        { src: track.coverUrl, sizes: '384x384', type: 'image/png' },
        { src: track.coverUrl, sizes: '512x512', type: 'image/png' },
      ],
    });

    navigator.mediaSession.setActionHandler('play', callbacks.onPlay);
    navigator.mediaSession.setActionHandler('pause', callbacks.onPause);
    navigator.mediaSession.setActionHandler('previoustrack', callbacks.onPrevious);
    navigator.mediaSession.setActionHandler('nexttrack', callbacks.onNext);
    
    if (callbacks.onSeek) {
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          callbacks.onSeek!(details.seekTime);
        }
      });
    }
  }
};

// Update playback state for media session
export const updateMediaSessionState = (
  state: 'playing' | 'paused' | 'none',
  position?: number,
  duration?: number
): void => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = state;
    
    if (position !== undefined && duration !== undefined) {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: 1,
        position,
      });
    }
  }
};
