<script lang='ts'>
  import type { Snippet } from 'svelte'

  import Icon from './Icon.svelte'
  import Logo from './Logo.svelte'

  interface Props {
    /** Big headline — the site name on the landing page, or the error code on the error page. */
    title: string
    /** Supporting copy below the title — the blurb, or the error message. */
    message: string
    /** Call to action rendered below the message (sign-in button, back-home link, ...). */
    children?: Snippet
  }

  const { title, message, children }: Props = $props()
</script>

<div class='flex flex-col items-center justify-center gap-4 text-center'>
  <Icon color='primary'>
    <Logo size={64} />
  </Icon>

  <h1 class='text-4xl leading-none font-extrabold sm:text-5xl'>{title}</h1>
  <p class='max-w-md opacity-70'>{message}</p>

  {#if children}
    <div class='mt-2'>
      {@render children()}
    </div>
  {/if}
</div>
