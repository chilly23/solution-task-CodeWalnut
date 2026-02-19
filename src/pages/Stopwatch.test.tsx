import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Stopwatch from '../pages/Stopwatch';

describe('Stopwatch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial state', () => {
    render(<Stopwatch />);
    expect(screen.getByText('00:00.00')).toBeTruthy();
    expect(screen.getByText('ready')).toBeTruthy();
  });

  it('starts when play is clicked', () => {
    render(<Stopwatch />);
    fireEvent.click(screen.getByTitle('start'));
    expect(screen.getByText('running')).toBeTruthy();
  });

  it('pauses when pause is clicked', () => {
    render(<Stopwatch />);
    fireEvent.click(screen.getByTitle('start'));
    fireEvent.click(screen.getByTitle('pause'));
    expect(screen.getByText('paused')).toBeTruthy();
  });

  it('resets when restart is clicked', () => {
    render(<Stopwatch />);
    fireEvent.click(screen.getByTitle('start'));
    fireEvent.click(screen.getByTitle('restart'));
    expect(screen.getByText('00:00.00')).toBeTruthy();
    expect(screen.getByText('ready')).toBeTruthy();
  });

  it('records a lap when lap is clicked while running', () => {
    render(<Stopwatch />);
    fireEvent.click(screen.getByTitle('start'));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.click(screen.getByTitle('lap'));
    expect(screen.getByText('lap 1')).toBeTruthy();
  });

  it('does not record a lap when not running', () => {
    render(<Stopwatch />);
    fireEvent.click(screen.getByTitle('lap'));
    expect(screen.queryByText('lap 1')).toBeNull();
  });

  it('lap button is disabled when not running', () => {
    render(<Stopwatch />);
    const lapbtn = screen.getByTitle('lap');
    expect(lapbtn).toBeDisabled();
  });
});
