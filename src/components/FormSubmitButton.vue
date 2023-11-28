<template>
  <button
    :aria-label="ariaLabel || buttonText"
    :disabled="formstateInvalid || loading"
    :class="{ 'float-right': floatRight, 'btn-success': buttonType === 'success', 'btn-red': buttonType === 'cancel' }"
    type="submit"
    class="btn"
    @click="handleClick"
  >{{ buttonText }}</button>
</template>

<script>
import { mapGetters } from 'vuex'
import { LOADING } from '@/store/getter-types'

export default {
  name: 'FormSubmitButton',
  props: {
    ariaLabel: {
      default: '',
      type: String
    },
    buttonText: {
      default: 'Submit',
      type: String
    },
    floatRight: {
      default: true,
      type: Boolean
    },
    formstateInvalid: Boolean,
    buttonType: {
      default: 'success',
      type: String
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING
    })
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
</style>
