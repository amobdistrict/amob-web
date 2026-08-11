'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useCart, CartItem } from '@/lib/store';

export default function ProductActions({ product }: { product: any }) {
  const addToCart = useCart((s) => s.addToCart);
  const [loading, setLoading] = useState(false);

  const stock = Number(product.quantity || 0);
  const isOutOfStock = stock <= 0;

  // Resolve image (prefer images[0], fallback to image_url)
  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : product.image_url || '';

  const handleAdd = async () => {
    if (isOutOfStock || loading) return;

    setLoading(true);

    const item: CartItem = {
      cartId: crypto.randomUUID(),
      skuId: product.id,
      productId: product.id,
      productName: product.name,
      skuName: 'Standard',
      price: Number(product.base_price),
      quantity: 1,
      stock,
      image,
      variantOptions: {},
    };

    addToCart(item);

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isOutOfStock ? 'bg-critical' : 'bg-success'
          }`}
        />

        <span className="text-xs uppercase text-brand-muted">
          {isOutOfStock ? 'Sold Out' : `${stock} available`}
        </span>
      </div>

      <button
        onClick={handleAdd}
        disabled={isOutOfStock || loading}
        className={`py-3 rounded-full font-bold uppercase text-sm transition ${
          isOutOfStock
            ? 'bg-brand-surface-secondary/60 text-brand-muted cursor-not-allowed'
            : 'btn btn-primary'
        }`}
      >
        {loading
          ? 'Loading...'
          : isOutOfStock
          ? 'Unavailable'
          : 'Add to Cart'}
      </button>

      {isOutOfStock && (
        <div className="text-critical text-xs flex items-center gap-1">
          <AlertCircle size={14} />
          Stock depleted
        </div>
      )}
    </div>
  );
}