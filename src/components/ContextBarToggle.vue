<template>
  <v-btn
      v-if="visible"
      fab
      absolute
      right
      class="floating-button context-bar-toggle"
      @click="toggleContextBar"
    >
      <v-icon large>mdi-chevron-left</v-icon>
    </v-btn>
</template>

<script>
export default {
  name: 'ContextBarToggle',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleContextBar () {
      this.$emit('context-bar-visible', true)
    }
  }
}
</script>

<style scoped lang="scss">
.floating-button {
  top: 70px;
}
</style>
