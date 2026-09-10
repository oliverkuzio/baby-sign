<script lang='ts'>
  import { authClient } from '$lib/auth-client'
  import Content from '$lib/components/Content.svelte'
  import Hero from '$lib/components/Hero.svelte'

  function signIn() {
    authClient.signIn.social({ provider: 'github', callbackURL: '/dashboard' })
  }
</script>

<svelte:head>
  <title>Welcome to the Baby Sign app! • Baby Sign • Kuzio Apps</title>
  <meta name='description' content='Sign, sing and play!' />
</svelte:head>

<Content>
  <Hero title='Baby Sign' message='Sign, sing and play — learn baby sign language together.'>
    <button type='button' class='btn btn-primary btn-lg' onclick={signIn}>
      Sign in with GitHub
    </button>
  </Hero>
</Content>
