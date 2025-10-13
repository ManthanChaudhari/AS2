'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

// Fade in animation
export function FadeIn({ children, delay = 0, duration = 0.3, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Slide in from direction
export function SlideIn({ children, direction = 'left', delay = 0, duration = 0.3, ...props }) {
  const directions = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: -20 },
    down: { x: 0, y: 20 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Scale animation
export function ScaleIn({ children, delay = 0, duration = 0.3, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation
export function StaggerChildren({ children, staggerDelay = 0.1, ...props }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Individual stagger item
export function StaggerItem({ children, ...props }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Page transition
export function PageTransition({ children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Modal animation
export function ModalAnimation({ children, isOpen, ...props }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Loading spinner animation
export function LoadingSpinner({ size = 20, color = 'currentColor' }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        width: size,
        height: size,
        border: `2px solid transparent`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%'
      }}
    />
  )
}

// Progress bar animation
export function AnimatedProgressBar({ progress, duration = 0.5 }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div
        className="bg-blue-600 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration }}
      />
    </div>
  )
}

// Hover scale effect
export function HoverScale({ children, scale = 1.02, ...props }) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Tap effect
export function TapEffect({ children, scale = 0.98, ...props }) {
  return (
    <motion.div
      whileTap={{ scale }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Notification slide in
export function NotificationSlide({ children, isVisible, position = 'top-right' }) {
  const positions = {
    'top-right': { x: 300, y: -100 },
    'top-left': { x: -300, y: -100 },
    'bottom-right': { x: 300, y: 100 },
    'bottom-left': { x: -300, y: 100 }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, ...positions[position] }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, ...positions[position] }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Count up animation
export function CountUp({ from = 0, to, duration = 1, ...props }) {
  const [count, setCount] = useState(from)

  useEffect(() => {
    const startTime = Date.now()
    const startValue = from
    const endValue = to
    const duration_ms = duration * 1000

    const updateCount = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration_ms, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.round(startValue + (endValue - startValue) * easeOutQuart)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [from, to, duration])

  return <span {...props}>{count.toLocaleString()}</span>
}

// Typewriter effect
export function Typewriter({ text, speed = 50, delay = 0 }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }
    }, currentIndex === 0 ? delay : speed)

    return () => clearTimeout(timeout)
  }, [currentIndex, text, speed, delay])

  return <span>{displayText}</span>
}

// Pulse animation
export function Pulse({ children, ...props }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Shake animation
export function Shake({ children, trigger, ...props }) {
  return (
    <motion.div
      animate={trigger ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}