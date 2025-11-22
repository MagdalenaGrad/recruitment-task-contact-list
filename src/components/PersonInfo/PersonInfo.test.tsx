import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PersonInfo } from './PersonInfo';
import { mockContact } from '../../test-utils';

describe('PersonInfo', () => {
  test('should render contact information correctly', () => {
    const mockOnSelect = jest.fn();

    render(
      <PersonInfo
        data={mockContact}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  test('should display initials correctly (2 letters from first and last name)', () => {
    const mockOnSelect = jest.fn();

    render(
      <PersonInfo
        data={mockContact}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('should call onSelect with correct ID when clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelect = jest.fn();

    render(
      <PersonInfo
        data={mockContact}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    const card = screen.getByText('John Doe').closest('.person-info');
    if (!card) throw new Error('Card element not found');

    await user.click(card);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith('test-id-1');
  });

  test('should apply/remove selected class based on isSelected prop', () => {
    const mockOnSelect = jest.fn();

    const { rerender } = render(
      <PersonInfo
        data={mockContact}
        isSelected={true}
        onSelect={mockOnSelect}
      />
    );

    const card = screen.getByText('John Doe').closest('.person-info');
    expect(card).toHaveClass('selected');

    rerender(
      <PersonInfo
        data={mockContact}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    expect(card).not.toHaveClass('selected');
  });
});
