import { createSeedState } from './data'
import type { SeedState } from './types'

let currentState: SeedState = createSeedState()

export function getState() {
  return currentState
}

export function resetState() {
  currentState = createSeedState()
  return currentState
}
