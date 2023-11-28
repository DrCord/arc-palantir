<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    chartData: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    },
    render: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    render (newVal, oldVal) {
      if (newVal !== oldVal && newVal === true) {
        this.renderChart(this.chartData, this.options)
      }
    }
  }
}
</script>
