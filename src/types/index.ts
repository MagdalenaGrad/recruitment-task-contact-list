export interface Contact {
  id: string;
  firstNameLastName: string;
  jobTitle: string;
  emailAddress: string;
}

export type LoadingState = "idle" | "loading" | "loadingMore" | "error";

export interface ContactListState {
  contacts: Contact[];
  loadingState: LoadingState;
  error: Error | null;
  hasMore: boolean;
}

