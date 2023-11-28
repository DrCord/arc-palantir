<template>
    <div class="odometer-data">
          <h3>Odometer (Kilometers)</h3>
          <table class="table table-sm">
            <tr>
              <td>Initial</td>
              <td>{{ start ? start : 'None' }}</td>
            </tr>
            <tr>
              <td>End</td>
              <td>{{ end ? end : 'None' }}</td>
            </tr>
            <tr>
              <td>Difference</td>
              <td>{{ difference ? difference : 0 }}</td>
            </tr>
          </table>
        </div>
</template>

<script>
export default {
  name: 'Odometer',
  props: {
    start: {
      type: Number,
      default: null
    },
    end: {
      type: Number,
      default: null
    }
  },
  computed: {
    difference () {
      return typeof this.start && this.end ? Math.round((this.end - this.start) * 10) / 10 : null
    }
  }
}
</script>
