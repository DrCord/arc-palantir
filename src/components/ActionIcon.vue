<template>
  <v-tooltip v-if="tooltip" right>
    <template #activator="{ on }">
      <i
        class="fas"
        :class="[classList, disabled ? 'disabled' : '']"
        @click="!disabled ? $emit('click') : null"
        v-on="on"
      />
    </template>
    <span v-if="tooltip">{{ tooltip }}</span>
  </v-tooltip>
  <i
    v-else
    class="fas"
    :class="[classList, disabled ? 'disabled' : '']"
    @click="!disabled ? $emit('click') : null"
  ></i>
</template>

<script>
export default {
  name: 'ActionIcon',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    classList: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>
.disabled {
  color: gray !important;
  cursor: default !important;
}
</style>
