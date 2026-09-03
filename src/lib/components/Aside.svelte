<script lang='ts'>
  const { children } = $props()
</script>

<aside class='bg-base-200 sticky bottom-0 mt-auto'>
  <div class='p-4'>
    {@render children()}
  </div>
</aside>
