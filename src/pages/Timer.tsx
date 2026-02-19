import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TimerList } from '../components/TimerList';
import { TimerModal } from '../components/TimerModal';

function Timer() {
  const [isModalOpen, setisModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => setisModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg mb-6"
      >
        <Plus className="w-5 h-5" />
        add timer
      </button>

      <TimerList />

      <TimerModal isopen={isModalOpen} onclose={() => setisModalOpen(false)} />
    </div>
  );
}

export default Timer;
