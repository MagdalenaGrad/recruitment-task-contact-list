import { renderHook, act } from '@testing-library/react';
import { useContactSelection } from './useContactSelection';

describe('useContactSelection', () => {
  test('should initialize with empty selection', () => {
    const { result } = renderHook(() => useContactSelection());

    expect(result.current.selectedIds.size).toBe(0);
    expect(result.current.selectionOrder).toEqual([]);
  });

  test('should add contact to selection when toggled', () => {
    const { result } = renderHook(() => useContactSelection());

    act(() => {
      result.current.handleToggle('contact-1');
    });

    expect(result.current.selectedIds.has('contact-1')).toBe(true);
    expect(result.current.selectionOrder).toEqual(['contact-1']);
  });

  test('should remove contact from selection when toggled again', () => {
    const { result } = renderHook(() => useContactSelection());

    act(() => {
      result.current.handleToggle('contact-1');
    });

    expect(result.current.selectedIds.has('contact-1')).toBe(true);

    act(() => {
      result.current.handleToggle('contact-1');
    });

    expect(result.current.selectedIds.has('contact-1')).toBe(false);
    expect(result.current.selectionOrder).toEqual([]);
  });

  test('should maintain selection order through add/remove/re-add operations', () => {
    const { result } = renderHook(() => useContactSelection());

    act(() => {
      result.current.handleToggle('contact-1');
      result.current.handleToggle('contact-2');
      result.current.handleToggle('contact-3');
    });

    expect(result.current.selectionOrder).toEqual(['contact-1', 'contact-2', 'contact-3']);

    act(() => {
      result.current.handleToggle('contact-2');
    });

    expect(result.current.selectionOrder).toEqual(['contact-1', 'contact-3']);
    expect(result.current.selectedIds.has('contact-2')).toBe(false);

    act(() => {
      result.current.handleToggle('contact-2');
    });

    expect(result.current.selectionOrder).toEqual(['contact-1', 'contact-3', 'contact-2']);
    expect(result.current.selectedIds.size).toBe(3);
  });
});
