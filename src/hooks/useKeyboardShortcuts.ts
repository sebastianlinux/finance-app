'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        // For Ctrl+Meta combinations, we need either Ctrl (Windows/Linux) OR Meta (Mac)
        const ctrlOrMeta = shortcut.ctrlKey && shortcut.metaKey
          ? (event.ctrlKey || event.metaKey)
          : (shortcut.ctrlKey === undefined ? true : event.ctrlKey === shortcut.ctrlKey) &&
            (shortcut.metaKey === undefined ? true : event.metaKey === shortcut.metaKey);
        
        const shiftMatch = shortcut.shiftKey === undefined ? true : event.shiftKey === shortcut.shiftKey;
        const altMatch = shortcut.altKey === undefined ? true : event.altKey === shortcut.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlOrMeta && shiftMatch && altMatch && keyMatch) {
          // Prevent default browser behavior for shortcuts
          if (shortcut.ctrlKey || shortcut.metaKey) {
            event.preventDefault();
          }
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}
