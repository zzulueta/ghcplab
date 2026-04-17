import { render, screen, waitFor } from '../test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductsPage from './ProductsPage';
import userEvent from '@testing-library/user-event';

const mockProducts = [
  {
    id: '1',
    name: 'Apple',
    description: 'A juicy red apple',
    price: 0.5,
    image: 'apple.png',
    category: 'fruits',
    inStock: true,
    reviews: []
  },
  {
    id: '2',
    name: 'Grapes',
    description: 'Sweet purple grapes',
    price: 2.99,
    image: 'grapes.png',
    category: 'fruits',
    inStock: false,
    reviews: [
      { author: 'John', comment: 'Great!', date: '2025-01-01' }
    ]
  }
];

global.fetch = vi.fn();

describe('ProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('apple.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProducts[0])
        });
      }
      if (url.includes('grapes.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProducts[1])
        });
      }
      if (url.includes('orange.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: '3',
            name: 'Orange',
            price: 1.25,
            image: 'orange.png',
            inStock: true,
            reviews: []
          })
        });
      }
      if (url.includes('pear.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: '4',
            name: 'Pear',
            price: 0.75,
            image: 'pear.png',
            inStock: true,
            reviews: []
          })
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('shows loading state initially', () => {
    render(<ProductsPage />);
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('loads and displays products', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Grapes')).toBeInTheDocument();
    expect(screen.getByText('Orange')).toBeInTheDocument();
    expect(screen.getByText('Pear')).toBeInTheDocument();
  });

  it('displays product prices', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('$0.50')).toBeInTheDocument();
    });
    
    expect(screen.getByText('$2.99')).toBeInTheDocument();
  });

  it('displays product descriptions', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('A juicy red apple')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Sweet purple grapes')).toBeInTheDocument();
  });

  it('displays "Add to Cart" button for in-stock items', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      const addToCartButtons = screen.getAllByText('Add to Cart');
      expect(addToCartButtons.length).toBeGreaterThan(0);
    });
  });

  it('displays "Out of Stock" button for out-of-stock items', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });
  });

  it('disables button for out-of-stock items', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      const outOfStockButton = screen.getByText('Out of Stock');
      expect(outOfStockButton).toBeDisabled();
    });
  });

  it('enables button for in-stock items', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      const addToCartButtons = screen.getAllByText('Add to Cart');
      addToCartButtons.forEach(button => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  it('displays product images', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      const appleImage = screen.getByAltText('Apple');
      expect(appleImage).toHaveAttribute('src', 'products/productImages/apple.png');
    });
  });

  it('renders "Our Products" heading', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Our Products')).toBeInTheDocument();
    });
  });

  it('renders header and footer after loading', async () => {
    const { container } = render(<ProductsPage />);
    
    await waitFor(() => {
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
    });
  });

  it('opens review modal when product image is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByAltText('Apple')).toBeInTheDocument();
    });
    
    const appleImage = screen.getByAltText('Apple');
    await user.click(appleImage);
    
    await waitFor(() => {
      expect(screen.getByText(/Reviews for Apple/i)).toBeInTheDocument();
    });
  });

  it('handles fetch errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as any).mockRejectedValue(new Error('Network error'));
    
    render(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
    });
    
    consoleErrorSpy.mockRestore();
  });

  it('fetches all four product files', async () => {
    render(<ProductsPage />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('products/apple.json');
      expect(global.fetch).toHaveBeenCalledWith('products/grapes.json');
      expect(global.fetch).toHaveBeenCalledWith('products/orange.json');
      expect(global.fetch).toHaveBeenCalledWith('products/pear.json');
    });
  });

  it('displays products in a grid', async () => {
    const { container } = render(<ProductsPage />);
    
    await waitFor(() => {
      const grid = container.querySelector('.products-grid');
      expect(grid).toBeInTheDocument();
    });
  });

  it('each product has correct structure', async () => {
    const { container } = render(<ProductsPage />);
    
    await waitFor(() => {
      const productCards = container.querySelectorAll('.product-card');
      expect(productCards.length).toBe(4);
    });
  });

  it('submits review and updates product', async () => {
    const user = userEvent.setup();
    render(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByAltText('Apple')).toBeInTheDocument();
    });
    
    // Click image to open review modal
    const appleImage = screen.getByAltText('Apple');
    await user.click(appleImage);
    
    await waitFor(() => {
      expect(screen.getByText(/Reviews for Apple/i)).toBeInTheDocument();
    });
    
    // Submit a review
    const nameInput = screen.getByPlaceholderText('Your name');
    const reviewInput = screen.getByPlaceholderText('Your review');
    
    await user.type(nameInput, 'Test User');
    await user.type(reviewInput, 'Great apple!');
    
    const submitButtons = screen.getAllByText('Submit');
    const formSubmitButton = submitButtons.find(btn => btn.closest('form'));
    if (formSubmitButton) {
      await user.click(formSubmitButton);
    }
    
    // Check that the review appears
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Great apple!', { exact: false })).toBeInTheDocument();
    });
  });
});
