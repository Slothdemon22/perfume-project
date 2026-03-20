'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="error-page-container">
        <div className="error-content">
          <h1 className="error-title">404</h1>
          <h2 className="error-subtitle">Fragrance Not Found</h2>
          <p className="error-message">
            It seems the scent you're looking for has dissipated. Let us help you find a new favorite.
          </p>
          <div className="error-actions">
            <Link href="/" className="btn-shop-now">
              RETURN HOME
            </Link>
            <Link href="/#popular-picks" className="btn-shop-now light">
              EXPLORE COLLECTIONS
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      
      <style jsx>{`
        .error-page-container {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          background-color: #f7f5f2;
        }
        .error-content {
          max-width: 600px;
        }
        .error-title {
          font-family: 'Playfair Display', serif;
          font-size: 8rem;
          color: #bf9853;
          margin-bottom: 0;
          line-height: 1;
          opacity: 0.2;
        }
        .error-subtitle {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          margin-top: -40px;
          margin-bottom: 20px;
          color: #1a1a1a;
        }
        .error-message {
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 40px;
        }
        .error-actions {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
}
