<script lang='ts'>
  const { children } = $props()
</script>

<aside class='sticky bottom-0 mt-auto bg-gray-800'>
  <div class='p-4'>
    {@render children()}
  </div>
</aside>
