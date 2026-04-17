import { render, screen } from '../test/test-utils';
import { describe, it, expect } from 'vitest';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('renders welcome heading', () => {
    render(<HomePage />);
    expect(screen.getByText(/Welcome to the The Daily Harvest!/i)).toBeInTheDocument();
  });

  it('renders information about products page', () => {
    render(<HomePage />);
    expect(screen.getByText(/Check out our products page for some great deals./i)).toBeInTheDocument();
  });

  it('renders Header component', () => {
    const { container } = render(<HomePage />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('renders Footer component', () => {
    const { container } = render(<HomePage />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders main content area', () => {
    const { container } = render(<HomePage />);
    const main = container.querySelector('main.main-content');
    expect(main).toBeInTheDocument();
  });

  it('has correct structure with app wrapper', () => {
    const { container } = render(<HomePage />);
    const appDiv = container.querySelector('.app');
    expect(appDiv).toBeInTheDocument();
  });
});
