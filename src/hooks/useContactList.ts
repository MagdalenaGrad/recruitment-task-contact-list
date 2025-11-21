import { useState, useCallback, useRef, useEffect } from "react";
import apiData from "../api";
import { Contact, ContactListState, LoadingState } from "../types";

interface UseContactListReturn extends ContactListState {
  loadMore: () => Promise<void>;
  retryFetch: () => Promise<void>;
}

export const PAGE_SIZE = 10;

export function useContactList(): UseContactListReturn {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  // Prevent concurrent requests
  const isFetchingRef = useRef(false);

  const fetchContacts = useCallback(async (isRetry: boolean = false) => {
    // Prevent concurrent requests
    if (isFetchingRef.current) return;
    
    // Don't fetch if there's no more data (unless it's a retry)
    if (!hasMore && !isRetry) return;

    isFetchingRef.current = true;
    
    // Set appropriate loading state
    const currentLoadingState = contacts.length === 0 ? "loading" : "loadingMore";
    setLoadingState(currentLoadingState);
    setError(null);

    try {
      const newContacts = await apiData();
      
      // Check if we got any data
      if (newContacts.length === 0) {
        setHasMore(false);
      } else {
        setContacts((prevContacts) => [...prevContacts, ...newContacts]);
        // If we got less than 10 items, we might be at the end
        if (newContacts.length < PAGE_SIZE) {
          setHasMore(false);
        }
      }
      
      setLoadingState("idle");
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch contacts"));
      setLoadingState("error");
    } finally {
      isFetchingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore]);

  const loadMore = useCallback(async () => {
    await fetchContacts(false);
  }, [fetchContacts]);

  const retryFetch = useCallback(async () => {
    await fetchContacts(true);
  }, [fetchContacts]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    contacts,
    loadingState,
    error,
    hasMore,
    loadMore,
    retryFetch,
  };
}
