import { PlayerProvider } from '@/contexts/PlayerContext';
import { Player } from '@/components/Player';
import { FullPlayer } from '@/components/FullPlayer';

export default function App() {
  return (
    <PlayerProvider>
      <div className="max-w-md mx-auto mt-10">
        <Player />
        <FullPlayer />
      </div>
    </PlayerProvider>
  );
}
