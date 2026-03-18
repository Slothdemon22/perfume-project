"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();
  const checkoutWhatsappNumber = '923274402705';

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="cart-backdrop" onClick={closeCart} />}

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-sidebar-header">
          <h2>CART</h2>
          <button onClick={closeCart} className="cart-close-btn" aria-label="Close Cart">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-sidebar-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <i className="fas fa-shopping-bag"></i>
              <p>Your cart is empty</p>
              <Link href="/" onClick={closeCart} className="cart-continue-btn">CONTINUE SHOPPING</Link>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={`${item.id}-${item.fragrance}`}>
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">{item.price}</p>
                  <p className="cart-item-size">Fragrance: {item.fragrance}</p>
                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.id, item.fragrance, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.fragrance, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-remove-btn" onClick={() => removeItem(item.id, item.fragrance)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-note">
              <p className="cart-tax-note">Taxes and shipping calculated at checkout</p>
            </div>
            <button className="cart-checkout-btn" onClick={() => {
              const text = `Hello! I would like to place an order for the following items:\n\n${items.map(item => `- ${item.name} (${item.fragrance}) x${item.quantity} - ${item.price}`).join('\n')}\n\nTotal: Rs. ${totalPrice.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;
              const url = `https://wa.me/${checkoutWhatsappNumber}?text=${encodeURIComponent(text)}`;
              window.open(url, '_blank');
            }}>
              CHECKOUT &nbsp;•&nbsp; Rs. {totalPrice.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
