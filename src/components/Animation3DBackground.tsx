/**
 * Uplinq-inspired 3D Animation Background
 * Original CSS/SVG animation capturing the aesthetic of the Uplinq.com 3D design:
 * - Dark gradient background
 * - Floating 3D geometric shapes (cubes, spheres) with teal/gold colors
 * - Glass container with shapes inside
 * - Pulsing LED indicators
 * - Data flow lines
 * - Subtle rotation and floating animations
 */

'use client'
export function Animation3DBackground() {
  return (
    <div className="uplinq-3d-bg" aria-hidden="true">
      {/* Gradient background */}
      <div className="uplinq-gradient" />

      {/* Grid pattern */}
      <div className="uplinq-grid" />

      {/* Floating 3D cubes */}
      <div className="uplinq-cube uplinq-cube-1">
        <div className="uplinq-cube-face uplinq-cube-front" />
        <div className="uplinq-cube-face uplinq-cube-back" />
        <div className="uplinq-cube-face uplinq-cube-right" />
        <div className="uplinq-cube-face uplinq-cube-left" />
        <div className="uplinq-cube-face uplinq-cube-top" />
        <div className="uplinq-cube-face uplinq-cube-bottom" />
      </div>
      <div className="uplinq-cube uplinq-cube-2">
        <div className="uplinq-cube-face uplinq-cube-front" />
        <div className="uplinq-cube-face uplinq-cube-back" />
        <div className="uplinq-cube-face uplinq-cube-right" />
        <div className="uplinq-cube-face uplinq-cube-left" />
        <div className="uplinq-cube-face uplinq-cube-top" />
        <div className="uplinq-cube-face uplinq-cube-bottom" />
      </div>

      {/* Floating 3D spheres */}
      <div className="uplinq-sphere uplinq-sphere-teal" />
      <div className="uplinq-sphere uplinq-sphere-gold" />
      <div className="uplinq-sphere uplinq-sphere-white" />

      {/* Glass container with shapes */}
      <div className="uplinq-glass-bowl">
        <div className="uplinq-bowl-shape uplinq-bowl-cube-teal" />
        <div className="uplinq-bowl-shape uplinq-bowl-sphere-gold" />
        <div className="uplinq-bowl-shape uplinq-bowl-cube-white" />
      </div>

      {/* LED indicators */}
      <div className="uplinq-led uplinq-led-1" />
      <div className="uplinq-led uplinq-led-2" />
      <div className="uplinq-led uplinq-led-3" />
      <div className="uplinq-led uplinq-led-4" />

      {/* Data flow lines */}
      <svg className="uplinq-data-lines" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <path d="M 0,300 Q 480,200 960,350 T 1920,300" stroke="#00D4AA" strokeWidth="1" fill="none" opacity="0.15" className="uplinq-data-line" />
        <path d="M 0,700 Q 480,600 960,750 T 1920,700" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.1" className="uplinq-data-line uplinq-data-line-2" />
        <path d="M 0,500 Q 480,400 960,550 T 1920,500" stroke="#00D4AA" strokeWidth="0.5" fill="none" opacity="0.1" className="uplinq-data-line uplinq-data-line-3" />
      </svg>

      {/* Glow orbs */}
      <div className="uplinq-glow uplinq-glow-teal" />
      <div className="uplinq-glow uplinq-glow-gold" />
    </div>
  )
}
