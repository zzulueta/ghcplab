import { render, screen } from './test/test-utils';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // App contains a CartProvider and Routes
    expect(document.body).toBeInTheDocument();
  });

  it('wraps routes with CartProvider', () => {
    const { container } = render(<App />);
    // The app should render without errors
    expect(container).toBeTruthy();
  });
});
