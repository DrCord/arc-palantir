<template>
  <v-btn
    :aria-label="ariaLabel || buttonText"
    :disabled="loading"
    ripple
    small
    color="#00A6CE"
    class="white--text"
    :href=href
    @click="emitMessage(emit)"
  >{{ buttonText }} <v-icon small>{{ `mdi-${icon}` }}</v-icon></v-btn>
</template>

<script>
import { mapGetters } from 'vuex'
import { LOADING } from '@/store/getter-types'

export default {
  name: 'QuickLink',
  props: {
    ariaLabel: {
      default: 'activate quick link',
      type: String
    },
    buttonText: {
      default: '+',
      type: String
    },
    href: {
      default: null,
      type: String
    },
    icon: {
      default: 'plus-box',
      type: String
    },
    emit: {
      default: '',
      type: String
    },
    floatLeft: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING
    })
  },
  methods: {
    emitMessage (payload) {
      this.$emit('quick-link-event', payload)
    }
  }
}
</script>

<style lang="scss">
.v-icon {
    &.mdi-plus-box {
      color: white;
    }
  }
</style>
