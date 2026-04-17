import { render, screen } from '../test/test-utils';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 The Daily Harvest/i)).toBeInTheDocument();
  });

  it('renders complete copyright statement', () => {
    render(<Footer />);
    expect(screen.getByText('© 2025 The Daily Harvest. All rights reserved.')).toBeInTheDocument();
  });

  it('renders footer element with correct class', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    
    expect(footer).toHaveClass('app-footer');
  });

  it('renders paragraph inside footer', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    const paragraph = footer?.querySelector('p');
    
    expect(paragraph).toBeInTheDocument();
  });
});
