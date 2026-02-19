import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalButtons } from '../components/ModalButtons';

describe('ModalButtons', () => {
  it('renders cancel and submit buttons', () => {
    render(<ModalButtons oncancel={vi.fn()} isvalid={true} />);
    expect(screen.getByText('cancel')).toBeTruthy();
    expect(screen.getByText('submit')).toBeTruthy();
  });

  it('shows custom submit label', () => {
    render(<ModalButtons oncancel={vi.fn()} isvalid={true} submitlabel="add timer" />);
    expect(screen.getByText('add timer')).toBeTruthy();
  });

  it('submit button is disabled when isvalid is false', () => {
    render(<ModalButtons oncancel={vi.fn()} isvalid={false} />);
    expect(screen.getByText('submit')).toBeDisabled();
  });

  it('submit button is enabled when isvalid is true', () => {
    render(<ModalButtons oncancel={vi.fn()} isvalid={true} />);
    expect(screen.getByText('submit')).not.toBeDisabled();
  });

  it('calls oncancel when cancel is clicked', () => {
    const oncancel = vi.fn();
    render(<ModalButtons oncancel={oncancel} isvalid={true} />);
    fireEvent.click(screen.getByText('cancel'));
    expect(oncancel).toHaveBeenCalled();
  });
});
