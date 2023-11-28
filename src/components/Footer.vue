<template>
  <v-footer>
    <div class="bug-report">
      <router-link to="bug-report">
        <font-awesome-icon icon=bug />
        Report a bug
      </router-link>
    </div>
  </v-footer>
</template>

<style lang="scss">
#app {
  .v-footer {
    justify-content: flex-end;
  }
}
</style>
