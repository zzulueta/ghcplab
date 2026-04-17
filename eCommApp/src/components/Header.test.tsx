import { render, screen } from '../test/test-utils';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('renders the site title', () => {
    render(<Header />);
    expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Header />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

  it('has correct link paths', () => {
    render(<Header />);
    
    const homeLink = screen.getByText('Home').closest('a');
    const productsLink = screen.getByText('Products').closest('a');
    const cartLink = screen.getByText('Cart').closest('a');
    const contactLink = screen.getByText('Contact Us').closest('a');
    const loginLink = screen.getByText('Admin Login').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(productsLink).toHaveAttribute('href', '/products');
    expect(cartLink).toHaveAttribute('href', '/cart');
    expect(contactLink).toHaveAttribute('href', '/contact');
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('renders header element with correct class', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    
    expect(header).toHaveClass('app-header');
  });

  it('renders navigation inside header', () => {
    const { container } = render(<Header />);
    const nav = container.querySelector('nav');
    
    expect(nav).toBeInTheDocument();
  });
});
