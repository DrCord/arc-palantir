<template>
  <v-card
    class="mx-auto vehicle-card vehicle-sync-card"
    height="206"
    max-width="206"
  >
    <v-card-title>
        <h3>Sync</h3>
    </v-card-title>
    <v-card-text
      :class="[vehicleSyncStatus]"
    >
      <div class="text-container checking">
        <h4>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <font-awesome-icon
                icon="sync"
                :class="synchronizationLoading ? 'fa-spin' : null"
                v-on="on"
                @click="checkSync"
              >
              </font-awesome-icon>
            </template>
            <span>Force Re-Check</span>
          </v-tooltip>
        </h4>
      </div>
      <div v-if="vehicleSyncStatus === 'checking'" class="text-container">
        <v-icon>mdi-cloud-sync-outline</v-icon>
      </div>
      <div v-if="vehicleSyncStatus === 'synchronized'" class="text-container">
        <v-icon>mdi-check-circle-outline</v-icon>
      </div>
      <div v-if="vehicleSyncStatus === 'unsynchronized'" class="text-container">
        <v-icon>mdi-close-circle-outline</v-icon>
      </div>
      <div v-if="vehicleSyncStatus === 'unknown'" class="text-container">
        <v-icon>mdi-help-circle-outline</v-icon>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLE_SHADOW_SYNCRONIZED } from '@/store/action-types'
import {
  LOADING,
  VEHICLE_LOADED,
  VEHICLE_SYNCHRONIZED
} from '@/store/getter-types'

import errors from '@/lib/errors'

export default {
  name: 'VehicleSynchronizedCard',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data: () => ({
    synchronized: {},
    synchronizationLoading: false
  }),
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehicleLoadedGet: VEHICLE_LOADED,
      vehicleSynchronizedGet: VEHICLE_SYNCHRONIZED
    }),
    vehicleLoaded () {
      return this.vin && !this.loading ? this.vehicleLoadedGet(this.vin) : null
    },
    vehicleSyncStatus () {
      const { synchronized, synchronizationLoading } = this
      if (synchronizationLoading) {
        return 'checking'
      } else if (synchronized.vehicleShadowSynchronized) {
        return 'synchronized'
      } else if (!synchronizationLoading && !synchronized.vehicleShadowSynchronized) {
        return 'unknown'
      } else {
        return 'unsynchronized'
      }
    }
  },
  watch: {
    vehicleLoaded: {
      handler (newVal) {
        if (newVal) {
          this.getSynchronizedData()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      vehicleShadowSynchronizedAction: VEHICLE_SHADOW_SYNCRONIZED
    }),
    checkSync () {
      this.synchronizationLoading = true
      this.synchronized = {}
      this.getSynchronizedData()
    },
    getSynchronizedData () {
      const maxTries = 5
      let currentTries = 1
      const componentSelf = this
      const { vin } = this
      const synchronizedCheck = setInterval(() => {
        try {
          this.synchronizationLoading = true
          this.vehicleShadowSynchronizedAction({ componentSelf, vin })
            .then(() => {
              componentSelf.synchronized = componentSelf.vehicleSynchronizedGet(vin)
              if (
                componentSelf.synchronized.vehicleShadowSynchronized ||
                currentTries >= maxTries
              ) {
                clearInterval(synchronizedCheck)
                componentSelf.synchronizationLoading = false
              } else {
                currentTries++
              }
            })
            .catch((e) => {
              errors.handleAxiosRequestError(componentSelf, e)
            })
        } catch (e) {
          // allow this to fail silently
          // needed in ENVs where the vehicle data is not tied to real hardware
          // as there is no AWS shadow to check if synchronized
          // e.stack === TypeError: Object(...) is not a function
          if (e.stack.match(/TypeError/)) {
            if (currentTries >= maxTries) {
              clearInterval(synchronizedCheck)
              componentSelf.synchronizationLoading = false
            } else {
              currentTries++
            }
          } else {
            errors.handleAxiosRequestError(componentSelf, e)
          }
        }
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
#app {
  .vehicle-sync-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 206px;
    .v-card__title {
      display: flex;
      justify-content: center;
      word-break: break-word;
    }
    h3 {
      line-height: 1.1;
      margin-bottom: 0;
      margin-top: 0;
    }
    h4 {
      font-size: 1.4rem;
      margin-top: 10px;
      .checking {
        font-size: 1.1rem;
      }
    }
    .text-container {
      text-align: center;
      i {
        font-size: 5rem;
      }
    }
    i {
        text-shadow: 1px 1px 1px #000;
      }
    .checking {
      i {
        color: blue;
      }
    }
    .synchronized {
      i {
        color: #159c2e;
      }
    }
    .unsynchronized {
      i {
        color: red;
      }
    }
    .unknown {
      i {
        color: orange;
      }
    }
  }
}
</style>
