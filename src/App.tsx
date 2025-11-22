import { useMemo } from "react";
import { PersonInfo } from "./components/PersonInfo";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { LoadMoreButton } from "./components/LoadMoreButton";
import { useContactList, useContactSelection } from "./hooks";
import { Contact } from "./types";
import "./App.css";

export const App = () => {
  const {
    selectedIds,
    selectionOrder,
    handleToggle
  } = useContactSelection();

  const {
    contacts,
    loadingState,
    error,
    hasMore,
    loadMore,
    retryFetch
  } = useContactList();

  const sortedContacts = useMemo(() => {
    const contactsMap = new Map(contacts.map(c => [c.id, c]));
    
    const selectedInOrder = selectionOrder
      .map(id => contactsMap.get(id))
      .filter((contact): contact is Contact => contact !== undefined);
    
    const unselected = contacts.filter(contact => !selectedIds.has(contact.id));
    
    return [...selectedInOrder, ...unselected];
  }, [contacts, selectedIds, selectionOrder]);

  const isInitialLoading = loadingState === "loading";
  const isInitialError = loadingState === "error" && contacts.length === 0;
  const isLoadingMore = loadingState === "loadingMore";
  const isLoadMoreError = loadingState === "error" && contacts.length > 0;
  const canLoadMore = hasMore && loadingState === "idle";

  if (isInitialLoading) {
    return (
      <div className="App">
        <Loader text="Loading contacts..." />
      </div>
    );
  }

  if (isInitialError) {
    return (
      <div className="App">
        <ErrorMessage
          message={error?.message || "Failed to load contacts"}
          onRetry={retryFetch}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <div className="list">
        {sortedContacts.map((contact) => (
          <PersonInfo 
            key={contact.id} 
            data={contact} 
            isSelected={selectedIds.has(contact.id)}
            onSelect={handleToggle}
          />
        ))}
      </div>

      {isLoadMoreError && (
        <ErrorMessage
          message={error?.message || "Failed to load more contacts"}
          onRetry={retryFetch}
        />
      )}

      {(canLoadMore || isLoadingMore) && (
        <LoadMoreButton
          onClick={loadMore}
          loading={isLoadingMore}
          disabled={isLoadingMore}
        />
      )}

      {!hasMore && contacts.length > 0 && (
        <div className="end-of-list">No more contacts to load</div>
      )}
    </div>
  );
};
