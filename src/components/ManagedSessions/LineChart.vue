<template>
  <div v-if="!loading" class="chart-container">
    <LineChart
      :render="ready"
      :chart-data="chart.data"
      :options="chart.options"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { LOADING } from '@/store/getter-types'

import LineChart from '@/components/Charts/Line.vue'

export default {
  name: 'ManagedSessionLineChart',
  components: {
    LineChart
  },
  props: {
    render: {
      default: false,
      type: Boolean
    },
    chartData: {
      default: () => [],
      type: Array
    },
    chartType: {
      type: String,
      default: ''
    },
    labelYAxis: {
      default: 'Value',
      type: String
    },
    initialization: {
      type: String,
      default: ''
    },
    completion: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      ready: false,
      chart: {
        data: {
          datasets: [
            {
              label: this.chartType,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              data: [], // has to be set in render watcher to work
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: this.chartType
          },
          tooltips: {
            mode: 'index',
            intersect: false
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [
              {
                type: 'time',
                time: {
                  unit: 'hour',
                  displayFormats: {
                    hour: 'YYYY-DD-MM HH:mm:ss'
                  },
                  ticks: {
                    min: this.initialization,
                    max: this.completion
                  }
                }
              }
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: this.labelYAxis
                }
              }
            ]
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING
    })
  },
  watch: {
    render (newVal, oldVal) {
      if (newVal !== oldVal && newVal === true) {
        this.setDataAndReady()
      }
    }
  },
  mounted () {
    this.setDataAndReady()
  },
  methods: {
    setDataAndReady () {
      this.chart.data.datasets[0].data = this.chartData
      this.ready = true
    }
  }
}
</script>
