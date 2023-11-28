<template>
  <div>
    <div class="single-chart soc">
      <svg :class="backgroundColor" viewBox="0 0 36 36" class="circular-chart">
        <path class="circle-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
           v-if="percentage"
          :stroke-dasharray="`${percentage}, 100`"
          class="circle"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <LoadingPuff v-if="loading && !percentage" />
        <text v-if="percentage" x="18" y="21.35" class="percentage">{{ percentage }}%</text>
        <text v-if="!loading && !percentage" x="18" y="21.35" class="percentage">?</text>
      </svg>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { LOADING } from '@/store/getter-types'

import LoadingPuff from '@/components/StateOfCharge/LoadingPuff.vue'

// From https://medium.com/@pppped/how-to-code-a-responsive-circular-percentage-chart-with-svg-and-css-3632f8cd7705

export default {
  name: 'StateOfCharge',
  components: {
    LoadingPuff
  },
  props: {
    percentage: {
      default: 0,
      type: Number
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING
    }),
    backgroundColor () {
      let color = 'red-bg'
      if (this.percentage >= 85) {
        color = 'green-bg'
      } else if (this.percentage >= 50) {
        color = 'blue-bg'
      } else if (this.percentage >= 20) {
        color = 'orange-bg'
      }
      return color
    }
  }
}
</script>

<style scoped lang="scss">
.soc {
  .circular-chart {
    display: block;
    margin: 10px auto;
    max-width: 50%;
    max-height: 150px;
  }

   .circle-bg {
    fill: none;
    stroke: #eee;
    stroke-width: 3.8;
  }

  .circle {
    fill: none;
    stroke-width: 2.8;
    stroke-linecap: round;
    animation: progress 1s ease-out forwards;
  }

  @keyframes progress {
    0% {
      stroke-dasharray: 0 100;
    }
  }

  .circular-chart {
    &.orange-bg {
      .circle {
        stroke: #ff9f00;
      }
    }
    &.green-bg {
      .circle {
        stroke: #4CC790;
      }
    }
    &.blue-bg {
      .circle {
        stroke: #3c9ee5;
      }
    }
    &.red-bg {
      .circle {
        stroke: #ff0000;
      }
    }
  }

  .percentage {
    font-family: sans-serif;
    font-size: 0.6em;
    text-anchor: middle;
    fill: var(--v-soc-percentage-base)
  }
}

</style>
