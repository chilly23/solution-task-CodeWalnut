import { useState } from 'react';
import { Clock } from 'lucide-react';
import { Toaster } from 'sonner';
import Stopwatch from './Stopwatch';
import Timer from './Timer';
import NavigationContent from '../components/NavigationContent';

function Home() {
  const [activeTab, setactiveTab] = useState<'timers' | 'stopwatch'>('timers');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />

      <div className="fixed top-2 right-3 z-50 text-xs text-black opacity-70 pointer-events-none">
        Edited by Velan, mail: velane929@gmail.com
      </div>
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">timer</h1>
          </div>
          <div className="flex flex-col gap-6">
            <NavigationContent activeTab={activeTab} setActiveTab={setactiveTab} />
          </div>
        </div>
      </div>
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 lg:hidden mb-4">
            <Clock className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">timer</h1>
          </div>
          {activeTab === 'timers' ? <Timer /> : <Stopwatch />}
        </div>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center py-3 px-6">
          <NavigationContent activeTab={activeTab} setActiveTab={setactiveTab} />
        </div>
      </div>
    </div>
  );
}

export default Home;