'use client';

import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : product.image_url;

  const price = parseFloat(product.base_price);

  return (
    <div className="card p-4 rounded-[1.5rem]">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-brand-bg/30 rounded-[1.25rem] overflow-hidden">
          {image ? (
            <img src={image} className="w-full h-full object-cover" alt={product.name} />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-brand-muted uppercase">
              No Image
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between gap-3">
          <div>
            <p className="text-xs text-brand-subtle uppercase">
              {product.category}
            </p>
            <h3 className="font-bold uppercase text-sm text-brand-text">
              {product.name}
            </h3>
          </div>

          <p className="font-bold text-brand-text">
            {!isNaN(price) ? `₦${price.toLocaleString()}` : "—"}
          </p>
        </div>
      </Link>
    </div>
  );
}