'use client'

import { useEffect, useRef } from 'react'

export function InteractiveOrbs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorGlowRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update cursor glow position
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = e.clientX + 'px'
        cursorGlowRef.current.style.top = e.clientY + 'px'
      }

      // Make orbs react to mouse
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        orbsRef.current.forEach((orb) => {
          if (orb) {
            const orbRect = orb.getBoundingClientRect()
            const orbCenterX = orbRect.left + orbRect.width / 2 - rect.left
            const orbCenterY = orbRect.top + orbRect.height / 2 - rect.top
            
            const deltaX = mouseX - orbCenterX
            const deltaY = mouseY - orbCenterY
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
            const maxDistance = 300

            if (distance < maxDistance) {
              const influence = (maxDistance - distance) / maxDistance
              const moveX = (deltaX / distance) * influence * 20
              const moveY = (deltaY / distance) * influence * 20
              const scale = 1 + influence * 0.3
              const opacity = 0.3 + influence * 0.4

              orb.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`
              orb.style.opacity = opacity.toString()
            } else {
              // Reset to original position and scale
              orb.style.transform = 'translate(0, 0) scale(1)'
              orb.style.opacity = ''
            }
          }
        })
      }
    }

    const handleMouseLeave = () => {
      // Hide cursor glow when leaving the page
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.opacity = '0'
      }
      
      // Reset all orbs to original state
      orbsRef.current.forEach(orb => {
        if (orb) {
          orb.style.transform = 'translate(0, 0) scale(1)'
          orb.style.opacity = ''
        }
      })
    }

    const handleMouseEnter = () => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.opacity = '1'
      }
    }

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  return (
    <>
      {/* Cursor glow effect */}
      <div
        ref={cursorGlowRef}
        className="cursor-glow"
        style={{ opacity: 0 }}
      />

      {/* Interactive orbs container */}
      <div ref={containerRef} className="interactive-orbs">
        {/* Orb 1 - Large primary */}
        <div
          ref={el => { if (el) orbsRef.current[0] = el }}
          className="glow-orb glow-orb-1"
          style={{
            top: '10%',
            left: '15%',
          }}
        />

        {/* Orb 2 - Medium accent */}
        <div
          ref={el => { if (el) orbsRef.current[1] = el }}
          className="glow-orb glow-orb-2"
          style={{
            top: '60%',
            right: '10%',
          }}
        />

        {/* Orb 3 - Small primary */}
        <div
          ref={el => { if (el) orbsRef.current[2] = el }}
          className="glow-orb glow-orb-3"
          style={{
            bottom: '20%',
            left: '5%',
          }}
        />

        {/* Orb 4 - Extra small accent */}
        <div
          ref={el => { if (el) orbsRef.current[3] = el }}
          className="glow-orb glow-orb-4"
          style={{
            top: '30%',
            right: '25%',
          }}
        />

        {/* Lava orb - Morphing */}
        <div
          ref={el => { if (el) orbsRef.current[4] = el }}
          className="glow-orb lava-orb"
          style={{
            top: '70%',
            left: '60%',
            width: '350px',
            height: '200px',
          }}
        />
      </div>
    </>
  )
}