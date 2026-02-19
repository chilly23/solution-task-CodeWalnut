import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

interface Lap {
  id: number;
  time: number;
  split: number;
}

function Stopwatch() {
  const [elapsed, setelapsed] = useState(0);
  const [isRunning, setisRunning] = useState(false);
  const [laps, setlaps] = useState<Lap[]>([]);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const lastLapTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = window.setInterval(() => {
        setelapsed(accumulatedRef.current + (Date.now() - startTimeRef.current));
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      accumulatedRef.current = elapsed;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const handletoggle = () => setisRunning((prev) => !prev);

  const handlerestart = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setisRunning(false);
    setelapsed(0);
    setlaps([]);
    accumulatedRef.current = 0;
    lastLapTimeRef.current = 0;
  };

  const handlelap = () => {
    if (!isRunning) return;
    const split = elapsed - lastLapTimeRef.current;
    lastLapTimeRef.current = elapsed;
    setlaps((prev) => [{ id: prev.length + 1, time: elapsed, split }, ...prev]);
  };

  const formatsw = (ms: number) => {
    const totalcs = Math.floor(ms / 10);
    const cs = totalcs % 100;
    const totalsec = Math.floor(totalcs / 100);
    const sec = totalsec % 60;
    const min = Math.floor(totalsec / 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(min)}:${pad(sec)}.${pad(cs)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
        <div className="text-6xl font-mono font-bold text-gray-800 mb-2 tracking-tight">
          {formatsw(elapsed)}
        </div>
        <p className="text-sm text-gray-400">
          {isRunning ? 'running' : elapsed === 0 ? 'ready' : 'paused'}
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={handlerestart}
          className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="restart"
        >
          <RotateCcw className="w-6 h-6" />
        </button>

        <button
          onClick={handletoggle}
          className={`p-4 rounded-full transition-colors ${
            isRunning
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
          title={isRunning ? 'pause' : 'start'}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        <button
          onClick={handlelap}
          disabled={!isRunning}
          className={`p-4 rounded-full transition-colors ${
            isRunning
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title="lap"
        >
          <Flag className="w-6 h-6" />
        </button>
      </div>

      {laps.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-3 px-4 py-2 bg-gray-50 border-b text-sm font-medium text-gray-500">
            <span>lap</span>
            <span className="text-center">split</span>
            <span className="text-right">total</span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {laps.map((lap) => (
              <div key={lap.id} className="grid grid-cols-3 px-4 py-3 border-b last:border-0 text-sm">
                <span className="text-gray-600 font-medium">lap {lap.id}</span>
                <span className="text-center font-mono text-gray-700">{formatsw(lap.split)}</span>
                <span className="text-right font-mono text-gray-500">{formatsw(lap.time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stopwatch;
