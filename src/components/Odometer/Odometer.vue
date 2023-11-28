<template>
  <div>
    <div class="odometer">
      <v-card
        class="vehicle odometer-card"
        color="card"
      >
        <v-card-title class="justify-center">Odometer</v-card-title>
        <v-card-text>
          <v-container v-if="!loading && Object.keys(odometer).length && odometer.kilometers">
            <v-row class="h5">{{ odometer.miles }} miles</v-row>
            <v-row class="h5">{{ odometer.kilometers }} km</v-row>
            <v-row><v-icon>mdi-gauge</v-icon></v-row>
          </v-container>
          <v-container v-if="!loading && !odometer.kilometers">
            <v-row>
              <h5>Unknown</h5>
            </v-row>
            <v-row>
              <v-icon color="grey">mdi-help-circle-outline</v-icon>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { LOADING } from '@/store/getter-types'

export default {
  name: 'Odometer',
  props: {
    odometer: {
      default: () => {},
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING
    })
  }
}
</script>

<style scoped lang="scss">
#app {
  .odometer {
    .vehicle {
      border-radius: 7px;
      height: 230px;
      .row {
        display: flex;
        justify-content: center;
        i {
          font-size: 5rem;
          text-shadow: 1px 1px 1px #000;
        }
      }
    }
  }
}

</style>
