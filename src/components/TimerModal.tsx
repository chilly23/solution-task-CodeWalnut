import { useState, useEffect } from 'react';
import { x, clock } from 'lucide-react';
import { useTimerStore } from '../store/useTimerStore';
import { validateTimerForm } from '../utils/validation';
import { Timer } from '../types/timer';
import { ModalButtons } from './ModalButtons';

// re-export Clock and X from lucide
import { X, Clock } from 'lucide-react';

interface TimerModalProps {
  isopen: boolean;
  onclose: () => void;
  timer?: Timer; // if provided, we are in edit mode
}

export const TimerModal = ({ isopen, onclose, timer }: TimerModalProps) => {
  const isediting = !!timer;

  const [title, settitle] = useState('');
  const [description, setdescription] = useState('');
  const [hours, sethours] = useState(0);
  const [minutes, setminutes] = useState(0);
  const [seconds, setseconds] = useState(0);
  const [touched, settouched] = useState({
    title: false,
    hours: false,
    minutes: false,
    seconds: false,
  });

  const { addTimer, editTimer } = useTimerStore();

  useEffect(() => {
    if (isopen) {
      if (timer) {
        settitle(timer.title);
        setdescription(timer.description);
        sethours(Math.floor(timer.duration / 3600));
        setminutes(Math.floor((timer.duration % 3600) / 60));
        setseconds(timer.duration % 60);
      } else {
        settitle('');
        setdescription('');
        sethours(0);
        setminutes(0);
        setseconds(0);
      }
      settouched({ title: false, hours: false, minutes: false, seconds: false });
    }
  }, [isopen, timer]);

  if (!isopen) return null;

  const handlereset = () => {
    settouched({ title: false, hours: false, minutes: false, seconds: false });
  };

  const handleclose = () => {
    handlereset();
    onclose();
  };

  const handlesubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateTimerForm({ title, description, hours, minutes, seconds })) return;

    const totalseconds = hours * 3600 + minutes * 60 + seconds;

    if (isediting && timer) {
      editTimer(timer.id, {
        title: title.trim(),
        description: description.trim(),
        duration: totalseconds,
      });
    } else {
      addTimer({
        title: title.trim(),
        description: description.trim(),
        duration: totalseconds,
        remainingTime: totalseconds,
        isRunning: false,
      });
    }
    handleclose();
  };

  const istimevalid = hours > 0 || minutes > 0 || seconds > 0;
  const istitlevalid = title.trim().length > 0 && title.length <= 50;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold">
              {isediting ? 'Edit Timer' : 'Add New Timer'}
            </h2>
          </div>
          <button
            onClick={handleclose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlesubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              onBlur={() => settouched({ ...touched, title: true })}
              maxLength={50}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                touched.title && !istitlevalid ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="enter timer title"
            />
            {touched.title && !istitlevalid && (
              <p className="mt-1 text-sm text-red-500">
                title is required and must be less than 50 characters
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">{title.length}/50 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="enter timer description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'hours', value: hours, set: sethours, max: 23 },
                { label: 'minutes', value: minutes, set: setminutes, max: 59 },
                { label: 'seconds', value: seconds, set: setseconds, max: 59 },
              ].map(({ label, value, set, max }) => (
                <div key={label}>
                  <label className="block text-sm text-gray-600 mb-1 capitalize">{label}</label>
                  <input
                    type="number"
                    min="0"
                    max={max}
                    value={value}
                    onChange={(e) => set(Math.min(max, parseInt(e.target.value) || 0))}
                    onBlur={() => settouched((prev) => ({ ...prev, [label]: true }))}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              ))}
            </div>
            {touched.hours && touched.minutes && touched.seconds && !istimevalid && (
              <p className="mt-2 text-sm text-red-500">please set a duration greater than 0</p>
            )}
          </div>

          <ModalButtons
            oncancel={handleclose}
            isvalid={istitlevalid && istimevalid}
            submitlabel={isediting ? 'save changes' : 'add timer'}
          />
        </form>
      </div>
    </div>
  );
};
