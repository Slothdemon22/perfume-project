import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import AddToCartButton from '@/components/AddToCartButton';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idStr } = await params;
  const id = parseInt(idStr);

  if (!Number.isFinite(id)) {
    return {
      title: 'Product',
      robots: { index: false, follow: false },
    };
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return {
      title: 'Fragrance Not Found',
      robots: { index: false, follow: false },
    };
  }

  const description =
    product.description ||
    `${product.name} in ${product.category?.name || 'premium collection'} at ${product.price}.`;

  return {
    title: `${product.name} | Signature Fragrance`,
    description,
    category: product.category?.name,
    alternates: {
      canonical: `/product/${product.id}`,
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/product/${product.id}`,
      title: `${product.name} - Luxury Scent | Classic Perfumes`,
      description,
      images: product.image
        ? [{ url: product.image, width: 800, height: 800, alt: product.name }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Classic Perfumes House`,
      description,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif' }}>Fragrance Not Found</h2>
          <p>The perfume you are looking for is currently unavailable.</p>
          <Link href="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>Return Home</Link>
        </div>
      </>
    );
  }

  // Fetch related products
  const allData = await prisma.product.findMany({
    take: 50,
    include: { category: true }
  });
  
  const otherCats = allData.filter((p: any) => p.categoryId !== product.categoryId && p.id !== id);
  const sameCat = allData.filter((p: any) => p.categoryId === product.categoryId && p.id !== id);
  const combined = [...otherCats, ...sameCat].sort(() => 0.5 - Math.random());
  const relatedProducts = combined.slice(0, 4);

  const allImages = [product.image, ...(product.gallery || [])];

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image, ...(product.gallery || [])],
    "description": product.description || `Luxury signature perfume: ${product.name}`,
    "sku": product.sku || `CP-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Classic Perfumes"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/product/${product.id}`,
      "priceCurrency": "PKR",
      "price": product.price.replace(/[^0-9]/g, ''),
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="product-details-container">
        {/* Breadcrumb */}
        <div className="product-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/?category=${product.categoryId}`}>{product.category?.name}</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>

        <div className="product-details-main">
          {/* Left: Scrolling Gallery */}
          <div className="product-gallery-scroll">
            {allImages.map((img, index) => (
              <div key={index} className="gallery-image-wrapper">
                <img src={img} alt={`${product.name} - View ${index + 1}`} />
              </div>
            ))}
          </div>

          {/* Right: Sticky Details Panel */}
          <div className="product-info-sticky">
            <div className="product-info-content">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-price">{product.price}</p>
              
              {product.sku && <p className="product-sku">SKU: {product.sku}</p>}
              


              {/* Client Component for fragrance selection + add to cart */}
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                productPrice={product.price}
                productImage={product.image}
                availableFragrances={product.fragrances}
              />

              {/* Product Details */}
              <div className="product-tabs">
                <div className="tab-content">
                  <div className="tab-pane">
                    <p><strong>Fragrance Detail:</strong></p>
                    <p>{product.description || 'A timeless signature fragrance by Classic Perfumes.'}</p>
                    <ul>
                      <li><strong>Scent Notes:</strong> Top, heart, and base notes available on request</li>
                      <li><strong>Concentration:</strong> Eau de Parfum</li>
                      <li><strong>Fragrances:</strong> {(product.fragrances || []).join(', ') || 'Signature Blend'}</li>
                      <li><strong>Collection:</strong> {product.category?.name}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* "You May Also Like" Section */}
        <section className="also-like-section">
          <h2 className="section-title">YOU MAY ALSO LIKE</h2>
          <div className="also-like-grid">
            {relatedProducts.map((p: any) => (
              <Link href={`/product/${p.id}`} key={p.id} className="related-product-card" scroll={true}>
                <div className="img-holder">
                  <img src={p.image} alt={p.name} />
                </div>
                <div className="info">
                  <h3>{p.name}</h3>
                  <p>{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
