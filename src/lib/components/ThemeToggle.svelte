<script lang='ts'>
  import { browser } from '$app/environment'
  import MoonFillIcon from '~icons/mingcute/moon-fill'
  import SunFillIcon from '~icons/mingcute/sun-fill'

  function storedTheme(): 'light' | 'dark' | null {
    if (!browser)
      return null
    const value = localStorage.getItem('theme')
    return value === 'light' || value === 'dark' ? value : null
  }

  function systemPrefersDark(): boolean {
    return browser && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  let isDark = $state((storedTheme() ?? (systemPrefersDark() ? 'dark' : 'light')) === 'dark')

  // Follow the OS setting live for as long as the user hasn't made an
  // explicit choice of their own.
  $effect(() => {
    if (!browser)
      return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    function onChange(event: MediaQueryListEvent) {
      if (storedTheme())
        return
      isDark = event.matches
      document.documentElement.setAttribute('data-theme', `${isDark ? 'dark' : 'light'}`)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  })

  function toggle() {
    isDark = !isDark
    const theme = isDark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', `${theme}`)
    localStorage.setItem('theme', theme)
  }
</script>

<button
  type='button'
  onclick={toggle}
  class='btn btn-ghost btn-circle btn-sm'
  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {#if isDark}
    <MoonFillIcon class='size-5' />
  {:else}
    <SunFillIcon class='size-5' />
  {/if}
</button>
