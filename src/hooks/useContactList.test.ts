import { renderHook, waitFor, act } from '@testing-library/react';
import { useContactList } from '../useContactList';
import apiData from '../../api';
import { createMockContacts, LOADING_STATE_DELAY, PAGE_SIZE } from '../../test-utils';

jest.mock('../../api', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockApiData = apiData as jest.MockedFunction<typeof apiData>;

describe('useContactList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch initial contacts on mount', async () => {
    // Mock 10 contacts to ensure hasMore stays true (PAGE_SIZE = 10)
    const tenContacts = createMockContacts(PAGE_SIZE);
    
    mockApiData.mockResolvedValueOnce(tenContacts);

    const { result } = renderHook(() => useContactList());

    expect(result.current.loadingState).toBe('loading');
    expect(result.current.contacts).toEqual([]);

    await waitFor(() => {
      expect(result.current.loadingState).toBe('idle');
    });

    expect(result.current.contacts).toEqual(tenContacts);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.error).toBeNull();
    expect(mockApiData).toHaveBeenCalledTimes(1);
  });

  test('should append new contacts when loadMore is called', async () => {
    const tenContacts = createMockContacts(PAGE_SIZE);
    const moreTenContacts = createMockContacts(PAGE_SIZE, PAGE_SIZE + 1);
    
    mockApiData
      .mockResolvedValueOnce(tenContacts)
      .mockResolvedValueOnce(moreTenContacts);  

    const { result } = renderHook(() => useContactList());

    await waitFor(() => {
      expect(result.current.loadingState).toBe('idle');
    });
    expect(result.current.contacts).toHaveLength(PAGE_SIZE);

    await act(async () => {
      await result.current.loadMore();
    });
    
    await waitFor(() => {
      expect(result.current.contacts).toHaveLength(PAGE_SIZE * 2);
    });

    expect(result.current.contacts).toEqual([...tenContacts, ...moreTenContacts]);
    expect(mockApiData).toHaveBeenCalledTimes(2);
  });

  test('should handle loading states correctly (idle, loading)', async () => {
    const tenContacts = createMockContacts(PAGE_SIZE);
    
    mockApiData.mockResolvedValueOnce(tenContacts);

    const { result } = renderHook(() => useContactList());

    expect(result.current.loadingState).toBe('loading');
    expect(result.current.contacts).toHaveLength(0);

    await waitFor(() => {
      expect(result.current.loadingState).toBe('idle');
    });
    
    expect(result.current.contacts).toHaveLength(PAGE_SIZE);
    expect(result.current.error).toBeNull();
  });

  test('should handle loadingMore state correctly', async () => {
    const tenContacts = createMockContacts(PAGE_SIZE);
    const moreTenContacts = createMockContacts(PAGE_SIZE, PAGE_SIZE + 1);

    // Mock a slower response to catch the loadingMore state
    mockApiData
      .mockResolvedValueOnce(tenContacts)
      .mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(moreTenContacts), LOADING_STATE_DELAY)));

    const { result } = renderHook(() => useContactList());

    await waitFor(() => {
      expect(result.current.loadingState).toBe('idle');
    });

    expect(result.current.contacts).toHaveLength(PAGE_SIZE);

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.loadingState).toBe('loadingMore');
    });

    expect(result.current.contacts).toHaveLength(PAGE_SIZE);

    await waitFor(() => {
      expect(result.current.loadingState).toBe('idle');
      expect(result.current.contacts).toHaveLength(PAGE_SIZE * 2);
    });
  });

  test('should handle error state', async () => {
    const error = new Error('Network error');
    
    mockApiData.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useContactList());

    await waitFor(() => {
      expect(result.current.loadingState).toBe('error');
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.contacts).toEqual([]);
    expect(mockApiData).toHaveBeenCalledTimes(1);
  });
});
