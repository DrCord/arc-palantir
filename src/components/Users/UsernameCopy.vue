<template>
  <span>
    <v-tooltip bottom>
      <template #activator="{ on }">
        <i
          class="username-copy fas fa-user"
          @click="copyUsernameToClipboard"
          v-on="on"
        ></i>
      </template>
      <span>Copy Username</span>
    </v-tooltip>
  </span>
</template>

<script>
export default {
  name: 'UsernameCopy',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  methods: {
    copyUsernameToClipboard () {
      this.$clipboard(this.username)
    }
  }
}
</script>

<style lang="scss">
#app {
  .username-copy {
    font-size: 0.9rem;
    margin: 8px 0 0 10px;
    vertical-align: top;
  }
}
</style>
