export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  playCount: number;
  lastPlayed?: Date;
  totalListenTime: number; // in seconds
  audioUrl?: string; // blob URL for web playback
}

export interface Playlist {
  id: string;
  name: string;
  coverUrl?: string;
  tracks: string[]; // track IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  coverUrl: string;
  tracks: string[];
  year?: number;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  tracks: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  imageUrl?: string;
  lastNameChange?: Date;
  lastImageChange?: Date;
  createdAt: Date;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // 0-100
  currentTime: number; // in seconds
  volume: number; // 0-100
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  queue: Track[];
  queueIndex: number;
}

export interface ListeningStats {
  totalListenTime: number;
  totalTracks: number;
  totalPlaylists: number;
  storageUsed: number; // in bytes
  topTracks: Track[];
}
