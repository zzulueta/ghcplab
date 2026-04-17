import { render, screen } from '../test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login heading', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: 'Admin Login' })).toBeInTheDocument();
  });

  it('renders username input field', () => {
    render(<LoginPage />);
    const usernameInput = screen.getByPlaceholderText('Username');
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute('type', 'text');
  });

  it('renders password input field', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('renders login button', () => {
    render(<LoginPage />);
    const loginButton = screen.getByRole('button', { name: 'Login' });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute('type', 'submit');
  });

  it('allows typing in username field', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    await user.type(usernameInput, 'testuser');
    
    expect(usernameInput).toHaveValue('testuser');
  });

  it('allows typing in password field', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    await user.type(passwordInput, 'testpass');
    
    expect(passwordInput).toHaveValue('testpass');
  });

  it('navigates to admin page with correct credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    await user.type(screen.getByPlaceholderText('Username'), 'admin');
    await user.type(screen.getByPlaceholderText('Password'), 'admin');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('shows error message with incorrect credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    await user.type(screen.getByPlaceholderText('Username'), 'wrong');
    await user.type(screen.getByPlaceholderText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows error with correct username but wrong password', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    await user.type(screen.getByPlaceholderText('Username'), 'admin');
    await user.type(screen.getByPlaceholderText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('shows error with wrong username but correct password', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    await user.type(screen.getByPlaceholderText('Username'), 'wrong');
    await user.type(screen.getByPlaceholderText('Password'), 'admin');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('clears inputs after successful login', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'admin');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(usernameInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
  });

  it('does not show error initially', () => {
    render(<LoginPage />);
    expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
  });

  it('handles form submission via Enter key', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    await user.type(screen.getByPlaceholderText('Username'), 'admin');
    await user.type(screen.getByPlaceholderText('Password'), 'admin{Enter}');
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('renders header and footer', () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('username field is a text input', () => {
    render(<LoginPage />);
    const usernameInput = screen.getByPlaceholderText('Username');
    expect(usernameInput).toHaveAttribute('type', 'text');
  });
});
