<script lang='ts'>
  import { browser } from '$app/environment'

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
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='size-5'>
      <path
        fill-rule='evenodd'
        d='M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z'
        clip-rule='evenodd'
      />
    </svg>
  {:else}
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='size-5'>
      <path
        d='M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18.75a.75.75 0 0 1 .75.75V21.75a.75.75 0 0 1-1.5 0V19.5a.75.75 0 0 1 .75-.75ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z'
      />
    </svg>
  {/if}
</button>
