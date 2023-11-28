<template>
  <div
    v-if="loading"
    id="loading-overlay"
    :style="cssProps"
  >
    <atom-spinner
      :animation-duration="animationDuration"
      :size="size"
      :color="color"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { LOADING } from '@/store/getter-types'

import { AtomSpinner } from 'epic-spinners'

export default {
  name: 'LoadingOverlay',
  components: {
    AtomSpinner
  },
  data () {
    return {
      animationDuration: 2000,
      color: '#00A6FF',
      height: 200,
      width: 200
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING
    }),
    cssProps () {
      return {
        '--height': this.height + 'px',
        '--width': this.width + 'px',
        '--margin-top': (-1 * this.height / 2) + 'px',
        '--margin-left': (-1 * this.width / 2) + 'px'
      }
    },
    size () {
      return this.height === this.width ? this.height : null
    }
  }
}
</script>

<style lang="scss">
  #loading-overlay {
    height: var(--height);
    left: 50%;
    margin-left: var(--margin-left);
    margin-top: var(--margin-top);
    position: fixed;
    top: 50%;
    width: var(--width);
    z-index: 1002;
  }
</style>
