import { render, screen } from '../test/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import AdminPage from './AdminPage';
import userEvent from '@testing-library/user-event';

describe('AdminPage', () => {
  beforeEach(() => {
    // Clear any state between tests
  });

  it('renders welcome heading', () => {
    render(<AdminPage />);
    expect(screen.getByText('Welcome to the admin portal.')).toBeInTheDocument();
  });

  it('renders sale percent label', () => {
    render(<AdminPage />);
    expect(screen.getByText(/Set Sale Percent/i)).toBeInTheDocument();
  });

  it('renders sale percent input field', () => {
    render(<AdminPage />);
    const input = screen.getByLabelText(/Set Sale Percent/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders submit button', () => {
    render(<AdminPage />);
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('renders end sale button', () => {
    render(<AdminPage />);
    expect(screen.getByText('End Sale')).toBeInTheDocument();
  });

  it('renders back to storefront button', () => {
    render(<AdminPage />);
    const backButton = screen.getByText('Back to Storefront');
    expect(backButton).toBeInTheDocument();
  });

  it('back button links to home page', () => {
    render(<AdminPage />);
    const backLink = screen.getByText('Back to Storefront').closest('a');
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('shows "No sale active" message initially', () => {
    render(<AdminPage />);
    expect(screen.getByText('No sale active.')).toBeInTheDocument();
  });

  it('input field has default value of 0', () => {
    render(<AdminPage />);
    const input = screen.getByLabelText(/Set Sale Percent/i);
    expect(input).toHaveValue('0');
  });

  it('allows typing in sale percent input', async () => {
    const user = userEvent.setup();
    render(<AdminPage />);
    
    const input = screen.getByLabelText(/Set Sale Percent/i);
    await user.clear(input);
    await user.type(input, '25');
    
    expect(input).toHaveValue('25');
  });

  it('updates sale message when valid number is submitted', async () => {
    const user = userEvent.setup();
    render(<AdminPage />);
    
    const input = screen.getByLabelText(/Set Sale Percent/i);
    await user.clear(input);
    await user.type(input, '20');
    await user.click(screen.getByText('Submit'));
    
    expect(screen.getByText('All products are 20% off!')).toBeInTheDocument();
  });

  it('shows error message for invalid input', async () => {
    const user = userEvent.setup();
    render(<AdminPage />);
    
    const input = screen.getByLabelText(/Set Sale Percent/i);
    await user.clear(input);
    await user.type(input, 'abc');
    await user.click(screen.getByText('Submit'));
    
    expect(screen.getByText(/Invalid input/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter a valid number/i)).toBeInTheDocument();
  });

  it('resets sale when end sale button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminPage />);
    
    const input = screen.getByLabelText(/Set Sale Percent/i);
    await user.clear(input);
    await user.type(input, '30');
    await user.click(screen.getByText('Submit'));
    
    expect(screen.getByText('All products are 30% off!')).toBeInTheDocument();
    
    await user.click(screen.getByText('End Sale'));
    
    expect(screen.getByText('No sale active.')).toBeInTheDocument();
    expect(input).toHaveValue('0');
  });

  it('handles decimal numbers', async () => {
    const user = userEvent.setup();
    render(<AdminPage />);
    
    const input = screen.getByLabelText(/Set Sale Percent/i);
    await user.clear(input);
    await user.type(input, '15.5');
    await user.click(screen.getByText('Submit'));
    
    expect(screen.getByText('All products are 15.5% off!')).toBeInTheDocument();
  });

  it('handles zero as valid input', async () => {
    const user = userEvent.setup();
    render(<AdminPage />);
    
    const input = screen.getByLabelText(/Set Sale Percent/i);
    await user.clear(input);
    await user.type(input, '0');
    await user.click(screen.getByText('Submit'));
    
    expect(screen.getByText('No sale active.')).toBeInTheDocument();
  });

  it('handles negative numbers', async () => {
    const user = userEvent.setup();
    render(<AdminPage />);
    
    const input = screen.getByLabelText(/Set Sale Percent/i);
    await user.clear(input);
    await user.type(input, '-10');
    await user.click(screen.getByText('Submit'));
    
    // The component only shows sale message when salePercent > 0
    // Negative numbers show "No sale active"
    expect(screen.getByText('No sale active.')).toBeInTheDocument();
  });

  it('shows zero for empty string', async () => {
    const user = userEvent.setup();
    render(<AdminPage />);
    
    const input = screen.getByLabelText(/Set Sale Percent/i);
    await user.clear(input);
    await user.click(screen.getByText('Submit'));
    
    // Empty string becomes 0 which shows no sale
    expect(screen.getByText('No sale active.')).toBeInTheDocument();
  });

  it('renders header and footer', () => {
    const { container } = render(<AdminPage />);
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('does not show error message initially', () => {
    render(<AdminPage />);
    expect(screen.queryByText(/Invalid input/i)).not.toBeInTheDocument();
  });
});
