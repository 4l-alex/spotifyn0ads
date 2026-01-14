import { Track, Playlist, Album, Artist } from '@/types/music';

export const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 203,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    playCount: 127,
    totalListenTime: 25781,
  },
  {
    id: '2',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    playCount: 89,
    totalListenTime: 18067,
  },
  {
    id: '3',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    album: 'F*CK LOVE 3',
    duration: 141,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    playCount: 156,
    totalListenTime: 21996,
  },
  {
    id: '4',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    album: 'Dreamland',
    duration: 238,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    playCount: 72,
    totalListenTime: 17136,
  },
  {
    id: '5',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 178,
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    playCount: 94,
    totalListenTime: 16732,
  },
  {
    id: '6',
    title: 'Peaches',
    artist: 'Justin Bieber',
    album: 'Justice',
    duration: 198,
    coverUrl: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop',
    playCount: 61,
    totalListenTime: 12078,
  },
  {
    id: '7',
    title: 'Montero',
    artist: 'Lil Nas X',
    album: 'MONTERO',
    duration: 137,
    coverUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    playCount: 83,
    totalListenTime: 11371,
  },
  {
    id: '8',
    title: 'Kiss Me More',
    artist: 'Doja Cat ft. SZA',
    album: 'Planet Her',
    duration: 208,
    coverUrl: 'https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=300&h=300&fit=crop',
    playCount: 67,
    totalListenTime: 13936,
  },
  {
    id: '9',
    title: 'Drivers License',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 242,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    playCount: 108,
    totalListenTime: 26136,
  },
  {
    id: '10',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=300&h=300&fit=crop',
    playCount: 91,
    totalListenTime: 19565,
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: 'pl1',
    name: 'Chill Vibes',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    tracks: ['1', '4', '6', '10'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-20'),
  },
  {
    id: 'pl2',
    name: 'Workout Mix',
    coverUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    tracks: ['2', '3', '5', '7'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-18'),
  },
  {
    id: 'pl3',
    name: 'Road Trip',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    tracks: ['1', '2', '3', '8', '9'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-22'),
  },
];

export const mockAlbums: Album[] = [
  {
    id: 'alb1',
    name: 'After Hours',
    artist: 'The Weeknd',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    tracks: ['1', '10'],
    year: 2020,
  },
  {
    id: 'alb2',
    name: 'Future Nostalgia',
    artist: 'Dua Lipa',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    tracks: ['2'],
    year: 2020,
  },
  {
    id: 'alb3',
    name: 'SOUR',
    artist: 'Olivia Rodrigo',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    tracks: ['5', '9'],
    year: 2021,
  },
];

export const mockArtists: Artist[] = [
  {
    id: 'art1',
    name: 'The Weeknd',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    tracks: ['1', '10'],
  },
  {
    id: 'art2',
    name: 'Dua Lipa',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    tracks: ['2'],
  },
  {
    id: 'art3',
    name: 'Olivia Rodrigo',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    tracks: ['5', '9'],
  },
  {
    id: 'art4',
    name: 'Justin Bieber',
    imageUrl: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop',
    tracks: ['3', '6'],
  },
];

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
