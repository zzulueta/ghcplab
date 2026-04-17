import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';
import userEvent from '@testing-library/user-event';

describe('CheckoutModal', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with message', () => {
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
  });

  it('renders confirm button', () => {
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Continue Checkout')).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Return to cart')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    const confirmButton = screen.getByText('Continue Checkout');
    await user.click(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByText('Return to cart');
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onCancel when confirm is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    const confirmButton = screen.getByText('Continue Checkout');
    await user.click(confirmButton);
    
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('does not call onConfirm when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByText('Return to cart');
    await user.click(cancelButton);
    
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('renders with modal-backdrop class', () => {
    const { container } = render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    expect(container.querySelector('.modal-backdrop')).toBeInTheDocument();
  });
});
