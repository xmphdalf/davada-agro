'use client'

import { useState } from 'react'

/**
 * Local state that starts from a prop and resets whenever the server sends a new value
 * (after router.refresh()), without the extra render of a setState-in-effect.
 */
export function useSynced<T>(value: T) {
  const [prev, setPrev] = useState(value)
  const [state, setState] = useState(value)
  if (prev !== value) {
    setPrev(value)
    setState(value)
  }
  return [state, setState] as const
}
