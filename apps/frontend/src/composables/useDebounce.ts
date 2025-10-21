/**
 * Debounce a function call
 * Waits for a delay before executing the function
 * If called again before delay, resets the timer
 * 
 * Example:
 * const debouncedSearch = useDebounceFn(searchFunction, 300)
 * debouncedSearch('pikachu') // waits 300ms before calling searchFunction
 */
export function useDebounceFn(fn: Function, delay: number = 300) {
  let timeoutId: number | null = null

  return function(...args: any[]) {
    // Clear previous timer if exists
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set new timer
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
