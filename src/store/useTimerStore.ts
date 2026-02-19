import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { Timer } from '../types/timer';

const loadstate = (): Timer[] => {
  try {
    const raw = localStorage.getItem('timers');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const savestate = (timers: Timer[]) => {
  try {
    localStorage.setItem('timers', JSON.stringify(timers));
  } catch {
    // ignore write errors
  }
};

const initialState = {
  timers: loadstate() as Timer[],
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    addTimer: (state, action) => {
      state.timers.push({
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      });
      savestate(state.timers);
    },
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter((t) => t.id !== action.payload);
      savestate(state.timers);
    },
    toggleTimer: (state, action) => {
      const t = state.timers.find((t) => t.id === action.payload);
      if (t) {
        t.isRunning = !t.isRunning;
        savestate(state.timers);
      }
    },
    updateTimer: (state, action) => {
      const t = state.timers.find((t) => t.id === action.payload);
      if (t && t.isRunning) {
        t.remainingTime -= 1;
        if (t.remainingTime <= 0) {
          t.remainingTime = 0;
          t.isRunning = false;
        }
        savestate(state.timers);
      }
    },
    restartTimer: (state, action) => {
      const t = state.timers.find((t) => t.id === action.payload);
      if (t) {
        t.remainingTime = t.duration;
        t.isRunning = false;
        savestate(state.timers);
      }
    },
    editTimer: (state, action) => {
      const t = state.timers.find((t) => t.id === action.payload.id);
      if (t) {
        Object.assign(t, action.payload.updates);
        t.remainingTime = action.payload.updates.duration ?? t.duration;
        t.isRunning = false;
        savestate(state.timers);
      }
    },
  },
});

const timerStore = configureStore({
  reducer: timerSlice.reducer,
});

export { timerStore };

export const { addTimer, deleteTimer, toggleTimer, updateTimer, restartTimer, editTimer } =
  timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  return {
    timers,
    addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    updateTimer: (id: string) => dispatch(updateTimer(id)),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) => dispatch(editTimer({ id, updates })),
  };
};
