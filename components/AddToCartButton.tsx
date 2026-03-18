"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

type Props = {
  productId: number;
  productName: string;
  productPrice: string;
  productImage: string;
  availableFragrances: string[];
};

export default function AddToCartButton({ productId, productName, productPrice, productImage, availableFragrances }: Props) {
  const { addItem } = useCart();
  const fragranceOptions = availableFragrances.length > 0 ? availableFragrances : ['Signature Blend'];
  const [selectedFragrance, setSelectedFragrance] = useState<string>(fragranceOptions[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      fragrance: selectedFragrance,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div className="size-selector">
        <div className="size-header">
          <label>Fragrance:</label>
        </div>
        <div className="size-options">
          {fragranceOptions.map((fragrance) => {
            return (
              <button
                key={fragrance}
                type="button"
                className={`size-btn ${selectedFragrance === fragrance ? 'active' : ''}`}
                onClick={() => setSelectedFragrance(fragrance)}
              >
                {fragrance}
              </button>
            );
          })}
        </div>
      </div>

      <div className="product-actions">
        <button className="btn-outline-dark full-width" onClick={handleAdd}>
          {added ? '✓ ADDED TO CART' : 'ADD TO CART'}
        </button>
        <button className="btn-dark full-width" onClick={handleAdd}>BUY IT NOW</button>
      </div>
    </>
  );
}
