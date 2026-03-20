'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="error-page-container">
        <div className="error-content">
          <h1 className="error-title">Error</h1>
          <h2 className="error-subtitle">Something Went Wrong</h2>
          <p className="error-message">
            We encountered an unexpected issue while preparing your fragrance experience. 
            Please try again or return to the storefront.
          </p>
          <div className="error-actions">
            <button onClick={() => reset()} className="btn-shop-now">
              TRY AGAIN
            </button>
            <Link href="/" className="btn-shop-now light">
              RETURN HOME
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
          color: #cc0000;
          margin-bottom: 0;
          line-height: 1;
          opacity: 0.1;
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
        button {
            border: none;
            outline: none;
        }
      `}</style>
    </>
  );
}
