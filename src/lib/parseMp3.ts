import { parseBlob } from 'music-metadata-browser';
import { Track } from '@/types/music';

export async function parseMp3(file: File): Promise<Track> {
  const metadata = await parseBlob(file);

  const picture = metadata.common.picture?.[0];

  let coverUrl: string | null = null;

  if (picture) {
    const blob = new Blob([picture.data], { type: picture.format });
    coverUrl = URL.createObjectURL(blob);
  }

  return {
    id: crypto.randomUUID(),
    title: metadata.common.title ?? file.name,
    artist: metadata.common.artist ?? 'Unknown',
    album: metadata.common.album ?? 'Unknown',
    duration: metadata.format.duration ?? 0,
    cover: coverUrl,
    file, // mantiene il File per riproduzione
  };
}
