import { Track, Playlist, Album, Artist } from '@/types/music';

// Empty arrays - no mock data, user will add their own music
export const mockTracks: Track[] = [];
export const mockPlaylists: Playlist[] = [];
export const mockAlbums: Album[] = [];
export const mockArtists: Artist[] = [];

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatListenTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};
