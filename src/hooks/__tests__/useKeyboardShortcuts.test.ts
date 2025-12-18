import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call action when shortcut is pressed', () => {
    const action = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts([
        {
          key: 'k',
          ctrlKey: true,
          action,
        },
      ])
    );

    // Simulate keydown event
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });
    
    window.dispatchEvent(event);
    
    expect(action).toHaveBeenCalled();
  });

  it('should not call action when shortcut is not pressed', () => {
    const action = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts([
        {
          key: 'k',
          ctrlKey: true,
          action,
        },
      ])
    );

    // Simulate different key
    const event = new KeyboardEvent('keydown', {
      key: 'x',
      ctrlKey: true,
      bubbles: true,
    });
    
    window.dispatchEvent(event);
    
    expect(action).not.toHaveBeenCalled();
  });

  it('should handle multiple shortcuts', () => {
    const action1 = vi.fn();
    const action2 = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts([
        {
          key: 'k',
          ctrlKey: true,
          action: action1,
        },
        {
          key: 'Escape',
          action: action2,
        },
      ])
    );

    // Test first shortcut
    const event1 = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event1);
    expect(action1).toHaveBeenCalled();

    // Test second shortcut
    const event2 = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    window.dispatchEvent(event2);
    expect(action2).toHaveBeenCalled();
  });

  it('should not trigger when disabled', () => {
    const action = vi.fn();
    
    renderHook(() =>
      useKeyboardShortcuts(
        [
          {
            key: 'k',
            ctrlKey: true,
            action,
          },
        ],
        false // disabled
      )
    );

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });
    
    window.dispatchEvent(event);
    
    expect(action).not.toHaveBeenCalled();
  });
});
