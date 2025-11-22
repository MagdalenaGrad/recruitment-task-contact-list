import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import apiData from './api';
import { mockContacts } from './test-utils';

jest.mock('./api', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockApiData = apiData as jest.MockedFunction<typeof apiData>;

const getContactNameElements = () => {
  const contactNames = mockContacts.map(c => c.firstNameLastName);
  return screen.getAllByText(new RegExp(contactNames.join('|')));
};

describe('App - Contact Sorting Logic', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
  });

  test('should display selected contacts at the top of the list', async () => {
    mockApiData.mockResolvedValueOnce(mockContacts);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const bobCard = screen.getByText('Bob Johnson').closest('.person-info');
    if (!bobCard) throw new Error('Bob Johnson card not found');
    await user.click(bobCard);

    const allCards = getContactNameElements();
    
    expect(allCards[0]).toHaveTextContent('Bob Johnson');
  });

  test('should maintain selection order for selected contacts', async () => {
    mockApiData.mockResolvedValueOnce(mockContacts);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const janeCard = screen.getByText('Jane Smith').closest('.person-info');
    if (!janeCard) throw new Error('Jane Smith card not found');
    await user.click(janeCard);

    const bobCard = screen.getByText('Bob Johnson').closest('.person-info');
    if (!bobCard) throw new Error('Bob Johnson card not found');
    await user.click(bobCard);

    const johnCard = screen.getByText('John Doe').closest('.person-info');
    if (!johnCard) throw new Error('John Doe card not found');
    await user.click(johnCard);

    const allNames = getContactNameElements().map(el => el.textContent);

    expect(allNames[0]).toBe('Jane Smith');
    expect(allNames[1]).toBe('Bob Johnson');
    expect(allNames[2]).toBe('John Doe');
  });

  test('should keep unselected contacts in original order below selected', async () => {
    mockApiData.mockResolvedValueOnce(mockContacts);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Select only Bob (middle contact)
    const bobCard = screen.getByText('Bob Johnson').closest('.person-info');
    if (!bobCard) throw new Error('Bob Johnson card not found');
    await user.click(bobCard);

    const allNames = getContactNameElements().map(el => el.textContent);

    // Bob first (selected), then John and Jane in original order
    expect(allNames[0]).toBe('Bob Johnson');
    expect(allNames[1]).toBe('John Doe');
    expect(allNames[2]).toBe('Jane Smith');
  });

  test('should update order immediately when selection changes', async () => {
    mockApiData.mockResolvedValueOnce(mockContacts);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const janeCard = screen.getByText('Jane Smith').closest('.person-info');
    if (!janeCard) throw new Error('Jane Smith card not found');
    await user.click(janeCard);

    let allNames = getContactNameElements().map(el => el.textContent);
    expect(allNames[0]).toBe('Jane Smith');

    // Deselect Jane - should move back to original position
    await user.click(janeCard);

    allNames = getContactNameElements().map(el => el.textContent);

    expect(allNames[0]).toBe('John Doe');
    expect(allNames[1]).toBe('Jane Smith');
    expect(allNames[2]).toBe('Bob Johnson');
  });
});

describe('App - Error Handling & Retry', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
  });

  test('should display error message when initial load fails', async () => {
    mockApiData.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    expect(screen.getByText('Loading contacts...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Network error|Failed to load contacts/i)).toBeInTheDocument();
    });
  });

  test('should show retry button on error', async () => {
    mockApiData.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Network error|Failed to load contacts/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  test('should refetch contacts when retry is clicked', async () => {
    mockApiData.mockRejectedValueOnce(new Error('Network error'));
    
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Network error|Failed to load contacts/i)).toBeInTheDocument();
    });

    // Mock success for retry
    mockApiData.mockResolvedValueOnce(mockContacts);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(mockApiData).toHaveBeenCalledTimes(2);
  });
});
