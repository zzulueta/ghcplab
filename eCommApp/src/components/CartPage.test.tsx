import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const mockCartContext = {
    cartItems: mockCartItems,
    addToCart: vi.fn(),
    updateQuantity: vi.fn(),
    removeFromCart: vi.fn(),
    clearCart: vi.fn()
};

const renderWithCartContext = (cartContext = mockCartContext) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays cart items when cart has items', () => {
        renderWithCartContext();
        
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        // quantity values shown in quantity controls
        expect(screen.getAllByText('2')[0]).toBeInTheDocument();
        expect(screen.getAllByText('1')[0]).toBeInTheDocument();
    });

    it('displays empty cart message when cart is empty', () => {
        const emptyContext = {
            cartItems: [],
            addToCart: vi.fn(),
            updateQuantity: vi.fn(),
            removeFromCart: vi.fn(),
            clearCart: vi.fn()
        };
        renderWithCartContext(emptyContext);
        
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
        expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
    });

    it('displays checkout button when cart has items', () => {
        renderWithCartContext();
        
        const checkoutButton = screen.getByText('Checkout');
        expect(checkoutButton).toBeInTheDocument();
    });

    it('opens checkout modal when checkout button is clicked', async () => {
        const user = userEvent.setup();
        renderWithCartContext();
        
        const checkoutButton = screen.getByText('Checkout');
        await user.click(checkoutButton);
        
        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
    });

    it('closes checkout modal when cancel is clicked', async () => {
        const user = userEvent.setup();
        renderWithCartContext();
        
        const checkoutButton = screen.getByText('Checkout');
        await user.click(checkoutButton);
        
        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        
        const cancelButton = screen.getByTestId('cancel-checkout');
        await user.click(cancelButton);
        
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
    });

    it('processes order and shows confirmation when confirmed', async () => {
        const user = userEvent.setup();
        renderWithCartContext();
        
        const checkoutButton = screen.getByText('Checkout');
        await user.click(checkoutButton);
        
        const confirmButton = screen.getByTestId('confirm-checkout');
        await user.click(confirmButton);
        
        expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
        expect(mockCartContext.clearCart).toHaveBeenCalledTimes(1);
    });

    it('displays processed items in confirmation screen', async () => {
        const user = userEvent.setup();
        renderWithCartContext();
        
        const checkoutButton = screen.getByText('Checkout');
        await user.click(checkoutButton);
        
        const confirmButton = screen.getByTestId('confirm-checkout');
        await user.click(confirmButton);
        
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('renders header and footer components', () => {
        renderWithCartContext();
        
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('displays correct image sources for cart items', () => {
        renderWithCartContext();
        
        const images = screen.getAllByRole('img');
        expect(images[0]).toHaveAttribute('src', 'products/productImages/test1.jpg');
        expect(images[0]).toHaveAttribute('alt', 'Test Product 1');
        expect(images[1]).toHaveAttribute('src', 'products/productImages/test2.jpg');
        expect(images[1]).toHaveAttribute('alt', 'Test Product 2');
    });

    it('throws error when used outside CartProvider', () => {
        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        expect(() => {
            render(<CartPage />);
        }).toThrow('CartContext must be used within a CartProvider');
        
        consoleSpy.mockRestore();
    });

    it('calls updateQuantity with incremented value when + button is clicked', async () => {
        const user = userEvent.setup();
        renderWithCartContext();

        const increaseButtons = screen.getAllByLabelText(/Increase quantity of/);
        await user.click(increaseButtons[0]);

        expect(mockCartContext.updateQuantity).toHaveBeenCalledWith('1', 3);
    });

    it('calls updateQuantity with decremented value when - button is clicked', async () => {
        const user = userEvent.setup();
        renderWithCartContext();

        const decreaseButtons = screen.getAllByLabelText(/Decrease quantity of/);
        await user.click(decreaseButtons[0]);

        expect(mockCartContext.updateQuantity).toHaveBeenCalledWith('1', 1);
    });

    it('calls removeFromCart when Remove button is clicked', async () => {
        const user = userEvent.setup();
        renderWithCartContext();

        const removeButtons = screen.getAllByText('Remove');
        await user.click(removeButtons[0]);

        expect(mockCartContext.removeFromCart).toHaveBeenCalledWith('1');
    });

    it('displays cart total', () => {
        renderWithCartContext();

        // Total: 29.99 * 2 + 49.99 * 1 = 109.97
        expect(screen.getByText('Total: $109.97')).toBeInTheDocument();
    });
});
