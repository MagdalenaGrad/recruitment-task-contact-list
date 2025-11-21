import React from "react";
import { PersonInfo } from "./components/PersonInfo";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { LoadMoreButton } from "./components/LoadMoreButton";
import { useContactList } from "./hooks/useContactList";
import "./App.css";

export const App = () => {
  const { contacts, loadingState, error, hasMore, loadMore, retryFetch } = useContactList();

  const isInitialLoading = loadingState === "loading" && contacts.length === 0;
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
        {contacts.map((contact) => (
          <PersonInfo key={contact.id} data={contact} />
        ))}
      </div>

      {isLoadMoreError && (
        <ErrorMessage
          message={error?.message || "Failed to load more contacts"}
          onRetry={retryFetch}
        />
      )}

      {isLoadingMore && (
        <Loader text="Loading more contacts..." />
      )}

      {canLoadMore && (
        <LoadMoreButton
          onClick={loadMore}
        />
      )}

      {!hasMore && contacts.length > 0 && (
        <div className="end-of-list">No more contacts to load</div>
      )}
    </div>
  );
};
