<template>
  <div class="synchronized">
    <span v-if="synchronizationLoading">Checking</span>
    <span v-else-if="synchronized.vehicleShadowSynchronized">Synchronized</span>
    <span v-else-if="!synchronizationLoading && !synchronized.vehicleShadowSynchronized"
      >Unknown</span>
    <span v-else>NOT Synchronized</span>
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLE_SHADOW_SYNCRONIZED } from '@/store/action-types'
import {
  LOADING,
  VEHICLE_SYNCHRONIZED
} from '@/store/getter-types'

import errors from '@/lib/errors'

export default {
  name: 'VehicleSynchronized',
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
      vehicleSynchronizedGet: VEHICLE_SYNCHRONIZED
    })
  },
  watch: {
    loading: {
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

<style scoped lang="scss">
.synchronized {
  svg {
    margin-left: 10px;
  }
}
</style>
