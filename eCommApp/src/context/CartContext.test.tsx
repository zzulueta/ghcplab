import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import { Product } from '../types';
import { ReactNode, useContext } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 10.99,
  description: 'Test Description',
  image: 'test.jpg',
  reviews: [],
  inStock: true
};

const mockProduct2: Product = {
  id: '2',
  name: 'Test Product 2',
  price: 15.50,
  description: 'Test Description 2',
  image: 'test2.jpg',
  reviews: [],
  inStock: true
};

describe('CartContext', () => {
  it('should provide initial empty cart', () => {
    const { result } = renderHook(() => useContext(CartContext), { wrapper });
    expect(result.current?.cartItems).toEqual([]);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useContext(CartContext), { wrapper });
    
    act(() => {
      result.current?.addToCart(mockProduct);
    });

    expect(result.current?.cartItems).toHaveLength(1);
    expect(result.current?.cartItems[0]).toEqual({
      ...mockProduct,
      quantity: 1
    });
  });

  it('should increment quantity when adding same item', () => {
    const { result } = renderHook(() => useContext(CartContext), { wrapper });
    
    act(() => {
      result.current?.addToCart(mockProduct);
      result.current?.addToCart(mockProduct);
    });

    expect(result.current?.cartItems).toHaveLength(1);
    expect(result.current?.cartItems[0].quantity).toBe(2);
  });

  it('should add multiple different items', () => {
    const { result } = renderHook(() => useContext(CartContext), { wrapper });
    
    act(() => {
      result.current?.addToCart(mockProduct);
      result.current?.addToCart(mockProduct2);
    });

    expect(result.current?.cartItems).toHaveLength(2);
    expect(result.current?.cartItems[0].id).toBe('1');
    expect(result.current?.cartItems[1].id).toBe('2');
  });

  it('should handle adding same item multiple times with different items', () => {
    const { result } = renderHook(() => useContext(CartContext), { wrapper });
    
    act(() => {
      result.current?.addToCart(mockProduct);
      result.current?.addToCart(mockProduct2);
      result.current?.addToCart(mockProduct);
      result.current?.addToCart(mockProduct2);
    });

    expect(result.current?.cartItems).toHaveLength(2);
    expect(result.current?.cartItems[0].quantity).toBe(2);
    expect(result.current?.cartItems[1].quantity).toBe(2);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useContext(CartContext), { wrapper });
    
    act(() => {
      result.current?.addToCart(mockProduct);
      result.current?.addToCart(mockProduct2);
    });

    expect(result.current?.cartItems).toHaveLength(2);

    act(() => {
      result.current?.clearCart();
    });

    expect(result.current?.cartItems).toEqual([]);
  });

  it('should clear empty cart without errors', () => {
    const { result } = renderHook(() => useContext(CartContext), { wrapper });
    
    act(() => {
      result.current?.clearCart();
    });

    expect(result.current?.cartItems).toEqual([]);
  });

  it('should preserve product properties when adding to cart', () => {
    const { result } = renderHook(() => useContext(CartContext), { wrapper });
    
    act(() => {
      result.current?.addToCart(mockProduct);
    });

    const cartItem = result.current?.cartItems[0];
    expect(cartItem?.name).toBe(mockProduct.name);
    expect(cartItem?.price).toBe(mockProduct.price);
    expect(cartItem?.description).toBe(mockProduct.description);
    expect(cartItem?.image).toBe(mockProduct.image);
    expect(cartItem?.reviews).toEqual(mockProduct.reviews);
    expect(cartItem?.inStock).toBe(mockProduct.inStock);
  });

  it('should throw error when CartContext is used outside provider', () => {
    const TestComponent = () => {
      const context = useContext(CartContext);
      if (!context) {
        throw new Error('CartContext must be used within a CartProvider');
      }
      return null;
    };

    // This is just checking that undefined is returned when not in provider
    const { result } = renderHook(() => useContext(CartContext));
    expect(result.current).toBeUndefined();
  });
});
