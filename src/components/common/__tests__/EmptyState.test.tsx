import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/testUtils';
import EmptyState from '../EmptyState';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

describe('EmptyState', () => {
  it('should render message', () => {
    renderWithProviders(<EmptyState message="No data available" />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should render with icon', () => {
    renderWithProviders(
      <EmptyState
        message="No transactions"
        icon={<AccountBalanceIcon data-testid="icon" />}
      />
    );
    
    expect(screen.getByText('No transactions')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    renderWithProviders(<EmptyState message="Custom message" />);
    
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });
});
