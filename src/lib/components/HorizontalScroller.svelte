<script lang='ts'>
  const { children } = $props()
</script>

<div class='justify-center-safe flex flex-nowrap gap-4 overflow-x-auto'>
  {@render children()}
</div>
