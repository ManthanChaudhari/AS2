'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Debounce hook for search inputs
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle hook for scroll events
export function useThrottle(callback, delay) {
  const lastRun = useRef(Date.now())

  return useCallback(
    (...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args)
        lastRun.current = Date.now()
      }
    },
    [callback, delay]
  )
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState(null)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        setEntry(entry)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [options])

  return { elementRef, isIntersecting, entry }
}

// Memoized data processing hook
export function useMemoizedData(data, processor, dependencies = []) {
  return useMemo(() => {
    if (!data || !processor) return data
    return processor(data)
  }, [data, processor, ...dependencies])
}

// Virtual scrolling hook
export function useVirtualScroll({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}) {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight,
    }))
  }, [items, startIndex, endIndex, itemHeight])

  const totalHeight = items.length * itemHeight

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    startIndex,
    endIndex,
  }
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName) {
  const renderCount = useRef(0)
  const startTime = useRef(Date.now())

  useEffect(() => {
    renderCount.current += 1
    const endTime = Date.now()
    const renderTime = endTime - startTime.current

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCount.current} took ${renderTime}ms`)
    }

    startTime.current = endTime
  })

  return {
    renderCount: renderCount.current,
  }
}

// Image lazy loading hook
export function useLazyImage(src, placeholder = '') {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const { elementRef, isIntersecting } = useIntersectionObserver()

  useEffect(() => {
    if (isIntersecting && src) {
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => {
        setIsError(true)
      }
      img.src = src
    }
  }, [isIntersecting, src])

  return {
    elementRef,
    imageSrc,
    isLoaded,
    isError,
  }
}

// Optimized state updates hook
export function useOptimizedState(initialState) {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)

  const optimizedSetState = useCallback((newState) => {
    // Only update if state actually changed
    if (typeof newState === 'function') {
      const updatedState = newState(stateRef.current)
      if (JSON.stringify(updatedState) !== JSON.stringify(stateRef.current)) {
        stateRef.current = updatedState
        setState(updatedState)
      }
    } else if (JSON.stringify(newState) !== JSON.stringify(stateRef.current)) {
      stateRef.current = newState
      setState(newState)
    }
  }, [])

  useEffect(() => {
    stateRef.current = state
  }, [state])

  return [state, optimizedSetState]
}

// Batch updates hook
export function useBatchUpdates() {
  const [updates, setUpdates] = useState([])
  const timeoutRef = useRef(null)

  const batchUpdate = useCallback((updateFn) => {
    setUpdates(prev => [...prev, updateFn])

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setUpdates(currentUpdates => {
        currentUpdates.forEach(fn => fn())
        return []
      })
    }, 16) // Next frame
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return batchUpdate
}