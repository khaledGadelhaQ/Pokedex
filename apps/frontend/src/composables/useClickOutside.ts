import { onMounted, onBeforeUnmount, type Ref } from 'vue'

/**
 * Composable to detect clicks outside a target element
 * @param target - Ref to the element to watch
 * @param callback - Function to call when clicked outside
 */
export function useClickOutside(
  target: Ref<HTMLElement | null>,
  callback: (event: MouseEvent) => void
) {
  const handleClick = (event: MouseEvent) => {
    const element = target.value
    const clickedElement = event.target as HTMLElement
    
    // If element exists and click was outside it
    if (element && !element.contains(clickedElement)) {
      callback(event)
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClick)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClick)
  })
}
