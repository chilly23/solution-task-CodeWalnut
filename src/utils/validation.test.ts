import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateTimerForm } from './validation';

// mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

beforeEach(() => {
  vi.clearAllMocks();
});

const validdata = {
  title: 'my timer',
  description: '',
  hours: 0,
  minutes: 1,
  seconds: 0,
};

describe('validateTimerForm', () => {
  it('returns true for valid data', () => {
    expect(validateTimerForm(validdata)).toBe(true);
  });

  it('fails when title is empty', () => {
    expect(validateTimerForm({ ...validdata, title: '' })).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Title is required');
  });

  it('fails when title is only whitespace', () => {
    expect(validateTimerForm({ ...validdata, title: '   ' })).toBe(false);
  });

  it('fails when title exceeds 50 chars', () => {
    expect(validateTimerForm({ ...validdata, title: 'a'.repeat(51) })).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Title must be less than 50 characters');
  });

  it('fails when all time values are 0', () => {
    expect(validateTimerForm({ ...validdata, hours: 0, minutes: 0, seconds: 0 })).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Please set a time greater than 0');
  });

  it('fails with negative time values', () => {
    expect(validateTimerForm({ ...validdata, minutes: -1 })).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Time values cannot be negative');
  });

  it('fails when minutes > 59', () => {
    expect(validateTimerForm({ ...validdata, minutes: 60 })).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Minutes and seconds must be between 0 and 59');
  });

  it('fails when seconds > 59', () => {
    expect(validateTimerForm({ ...validdata, seconds: 60 })).toBe(false);
  });

  it('fails when total exceeds 24 hours', () => {
    expect(validateTimerForm({ ...validdata, hours: 25 })).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Timer cannot exceed 24 hours');
  });

  it('passes with exactly 24 hours', () => {
    expect(validateTimerForm({ ...validdata, hours: 24, minutes: 0, seconds: 0 })).toBe(true);
  });
});
