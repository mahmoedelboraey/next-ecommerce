'use client'

import Link from 'next/link'

function HeroSectionHome() {
  return (
    <div 
      className="position-relative w-100" 
      style={{
        height: '500px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '600px',
          padding: '2rem',
        }}
      >
        <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          Welcome to eShop
        </h1>
        <p className="lead mb-4" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
          Discover amazing products at unbeatable prices. Shop now and enjoy fast delivery.
        </p>

        <Link href="/product" className="btn btn-light btn-lg fw-bold" style={{ transition: 'all 0.3s' }}>
          Start Shopping Now 🛒
        </Link>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          h1 {
            margin-bottom: 1rem !important;
          }
          p {
            margin-bottom: 2rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default HeroSectionHome