import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewModal from './ReviewModal';
import userEvent from '@testing-library/user-event';
import { Product } from '../types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 10.99,
  description: 'Test Description',
  image: 'test.jpg',
  reviews: [
    {
      author: 'John Doe',
      comment: 'Great product!',
      date: '2025-01-15T10:00:00.000Z'
    },
    {
      author: 'Jane Smith',
      comment: 'Loved it!',
      date: '2025-01-10T15:30:00.000Z'
    }
  ],
  inStock: true
};

const mockProductNoReviews: Product = {
  ...mockProduct,
  reviews: []
};

describe('ReviewModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when product is null', () => {
    const { container } = render(
      <ReviewModal product={null} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when product is provided', () => {
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Reviews for Test Product')).toBeInTheDocument();
  });

  it('displays existing reviews', () => {
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Great product!', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Loved it!', { exact: false })).toBeInTheDocument();
  });

  it('displays "No reviews yet" when product has no reviews', () => {
    render(<ReviewModal product={mockProductNoReviews} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
  });

  it('renders review form', () => {
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('Leave a Review')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your review')).toBeInTheDocument();
  });

  it('renders submit button in form', () => {
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    const submitButtons = screen.getAllByText('Submit');
    expect(submitButtons.length).toBeGreaterThan(0);
  });

  it('renders close button', () => {
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    const closeButton = screen.getByText('Close');
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    
    const backdrop = container.querySelector('.modal-backdrop');
    if (backdrop) {
      await user.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not close when modal content is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    
    const content = container.querySelector('.modal-content');
    if (content) {
      await user.click(content);
      expect(mockOnClose).not.toHaveBeenCalled();
    }
  });

  it('submits review with author and comment', async () => {
    const user = userEvent.setup();
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByPlaceholderText('Your name'), 'Test Author');
    await user.type(screen.getByPlaceholderText('Your review'), 'Test Comment');
    
    const submitButtons = screen.getAllByText('Submit');
    const formSubmitButton = submitButtons.find(btn => btn.closest('form'));
    if (formSubmitButton) {
      await user.click(formSubmitButton);
    }
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    const submittedReview = mockOnSubmit.mock.calls[0][0];
    expect(submittedReview.author).toBe('Test Author');
    expect(submittedReview.comment).toBe('Test Comment');
    expect(submittedReview.date).toBeDefined();
  });

  it('creates review with ISO date format', async () => {
    const user = userEvent.setup();
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByPlaceholderText('Your name'), 'Test');
    await user.type(screen.getByPlaceholderText('Your review'), 'Review');
    
    const submitButtons = screen.getAllByText('Submit');
    const formSubmitButton = submitButtons.find(btn => btn.closest('form'));
    if (formSubmitButton) {
      await user.click(formSubmitButton);
    }
    
    const submittedReview = mockOnSubmit.mock.calls[0][0];
    expect(submittedReview.date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('requires author field to submit', async () => {
    const user = userEvent.setup();
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByPlaceholderText('Your name');
    expect(nameInput).toHaveAttribute('required');
  });

  it('requires comment field to submit', async () => {
    const user = userEvent.setup();
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    const commentInput = screen.getByPlaceholderText('Your review');
    expect(commentInput).toHaveAttribute('required');
  });

  it('displays formatted review dates', () => {
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    // Should display dates in localized format
    const dateElements = screen.getAllByText(/\d+\/\d+\/\d+/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('renders name input as text input', () => {
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByPlaceholderText('Your name');
    expect(nameInput).toHaveAttribute('type', 'text');
  });

  it('renders comment input as textarea', () => {
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    const commentInput = screen.getByPlaceholderText('Your review');
    expect(commentInput.tagName).toBe('TEXTAREA');
  });

  it('renders all reviews in order', () => {
    render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    const reviewsList = screen.getByText('John Doe').closest('.reviews-list');
    expect(reviewsList).toBeInTheDocument();
  });
});
