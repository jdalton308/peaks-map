
<template>

<header>
  <h1 class="header-logo">
    Peaks Power
  </h1>
</header>

</template>



<script>

export default {
  name: 'peaks-header',
  data() {
    return {
    }
  },
}

</script>



<style lang="scss">

@import '../assets/style/variables';


header {
  position: relative;
  z-index: 2;
  padding: 12px 24px;
  background-color: $blue;
  box-shadow: 0 1px 4px $grey-darker;

  .header-logo {
    display: inline-block;
    color: $white;
    font-weight: 700;
    font-size: 1.5rem;
  }
}

</style>