<template>
  <div v-if="managedSessionId" class="managed-session">
    <v-card>
      <v-card-text>
        <v-list max-width="400">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>VIN</v-list-item-title>
              <v-list-item-subtitle><router-link
                v-if="managedSession.vin"
                :to="vehicleLinkObject(managedSession.vin)"
                >{{ managedSession.vin }}</router-link
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Session Id</v-list-item-title>
              <v-list-item-subtitle>{{ managedSession.id }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Start Time</v-list-item-title>
              <v-list-item-subtitle>{{ formatDateAndTime(managedSession.initialization) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>End Time</v-list-item-title>
              <v-list-item-subtitle>{{
              !vehicleManagedSessionActive
                ? formatDateAndTime(managedSession.completion)
                : "Active"
            }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                v-if="vehicleManagedSessionActive"
                color="error"
                small
                @click="vehicleManagedSessionEnd"
              >Managed Session: End
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>PIN</v-list-item-title>
              <v-list-item-subtitle>{{ managedSession.completion ==='active' ? managedSession.pin: '--' }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Creator</v-list-item-title>
              <v-list-item-subtitle><router-link
              v-if="managedSession.creator"
              :to="userLinkObject(managedSession.creator)"
              >{{ managedSession.creator }}</router-link
            ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Verification Id</v-list-item-title>
              <v-list-item-subtitle>{{ managedSession.verificationId ? managedSession.verificationId : "None" }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Vehicle Synchronized</v-list-item-title>
              <v-list-item-subtitle>
                <vehicle-sync :vin="managedSession.vin"></vehicle-sync>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card>
          <template v-if="showTelemetry">
            <v-card-title>Telemetry Data</v-card-title>
            <v-card-text>
              <odometer
                :start="odometerStart"
                :end="odometerEnd"
              />
              <div class="gps-locations">
                <gps-locations
                  :gps-data="gpsPositions"
                  :vin="managedSession.vin"
                  :render="showTelemetry"
                />
              </div>
            </v-card-text>
          </template>
          <template v-else-if="showNoTelemetry">
            <v-card-title>
              <div class="text-center no-data">No Telemetry Data Available</div>
            </v-card-title>
          </template>
          <template v-else>
            <v-card-title>
              <div class="text-center pulse loading">Loading Telemetry Data</div>
            </v-card-title>
          </template>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  MANAGED_SESSION_END,
  MANAGED_SESSION_TELEMETRY_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  VEHICLES_MANAGED_SESSION,
  VEHICLES_MANAGED_SESSION_TELEMETRY
} from '@/store/getter-types'

import DateUtility from '@/lib/dateUtility'
import GpsLocations from '@/components/ManagedSessions/GpsLocations.vue'
import Odometer from '@/components/ManagedSessions/Odometer.vue'
import VehicleSync from '@/components/Vehicles/VehicleSync.vue'

export default {
  name: 'ManagedSession',
  components: {
    GpsLocations,
    Odometer,
    VehicleSync
  },
  props: {
    managedSessionId: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    telemetryData: {},
    showTelemetry: false,
    showNoTelemetry: false
  }),
  computed: {
    ...mapGetters({
      loading: LOADING,
      managedSessionGet: VEHICLES_MANAGED_SESSION,
      managedSessionTelemetryGet: VEHICLES_MANAGED_SESSION_TELEMETRY
    }),
    odometerStart () {
      return typeof this.telemetryData.odometer !== 'undefined' &&
        this.telemetryData.odometer.length
        ? Math.round(this.telemetryData.odometer[0].point * 10) / 10
        : null
    },
    odometerEnd () {
      return typeof this.telemetryData.odometer !== 'undefined' &&
        this.telemetryData.odometer.length
        ? Math.round(this.telemetryData.odometer[1].point * 10) / 10
        : null
    },
    gpsPositions () {
      const round = (value, decimals) => {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
      }
      const data = []
      if (
        typeof this.telemetryData.gpsPosition !== 'undefined' &&
        Object.keys(this.telemetryData.gpsPosition).length
      ) {
        const gpsPositions = this.telemetryData.gpsPosition
        for (let i = 0; i < gpsPositions.length; i++) {
          const gpsPositionsItem = gpsPositions[i]
          let itemNew = true
          for (let k = 0; k < data.length; k++) {
            const existingItem = data[k]
            // round to 3 decimal places to eliminate effectively duplicate points from the human perspective
            const existingItemLat = round(existingItem.latitude, 3)
            const existingItemLng = round(existingItem.longitude, 3)
            const newItemLat = round(gpsPositionsItem.latitude, 3)
            const newItemLng = round(gpsPositionsItem.longitude, 3)
            if (
              existingItemLat === newItemLat &&
              existingItemLng === newItemLng
            ) {
              itemNew = false
            }
          }
          if (itemNew) {
            data.push(gpsPositionsItem)
          }
        }
      }
      return data
    },
    stateOfCharge () {
      const data = []
      if (
        typeof this.telemetryData.bmsPackSoc !== 'undefined' &&
        Object.keys(this.telemetryData.bmsPackSoc).length
      ) {
        const bmsPackSOC = this.telemetryData.bmsPackSoc
        for (let i = 0; i < bmsPackSOC.length; i++) {
          const item = bmsPackSOC[i]
          data.push({
            x: item.time,
            y: item.point
          })
        }
      }
      return data
    },
    speed () {
      const data = []
      if (
        typeof this.telemetryData.speed !== 'undefined' &&
        Object.keys(this.telemetryData.speed).length
      ) {
        const speed = this.telemetryData.speed
        for (let i = 0; i < speed.length; i++) {
          const item = speed[i]
          data.push({
            x: item.time,
            y: item.point
          })
        }
      }
      return data
    },
    managedSession () {
      return this.managedSessionId ? this.managedSessionGet(this.managedSessionId) : {}
    },
    vehicleManagedSessionActive () {
      const { managedSession } = this
      return managedSession && managedSession.completion ? managedSession.completion === 'active' : null
    }
  },
  watch: {
    managedSessionId: {
      handler (newVal) {
        if (newVal) {
          this.summonTelemetry()
        }
      }
    }
  },
  methods: {
    ...mapActions({
      managedSessionTelemetrySummonAction: MANAGED_SESSION_TELEMETRY_SUMMON,
      vehicleManagedSessionEndAction: MANAGED_SESSION_END
    }),
    formatDateAndTime (datetime) {
      return DateUtility.formatDateAndTime(datetime)
    },
    summonTelemetry: async function () {
      const componentSelf = this
      const { managedSessionId, managedSessionTelemetryGet, managedSessionTelemetrySummonAction } = this
      const id = managedSessionId
      await managedSessionTelemetrySummonAction({ componentSelf, id })
      const telemetryData = managedSessionTelemetryGet(
        managedSessionId
      )
      if (!this.telemetryDataExists(telemetryData)) {
        this.showNoTelemetry = true
      } else {
        this.telemetryData = telemetryData
        this.showTelemetry = true
      }
    },
    telemetryDataExists (telemetryData) {
      if ('errorMessage' in telemetryData) {
        return false
      } else if (
        !telemetryData.odometer.length &&
        !telemetryData.gpsPosition.length &&
        !telemetryData.speed.length &&
        !telemetryData.bmsPackSoc.length
      ) {
        return false
      }
      return true
    },
    userLinkObject (username) {
      return {
        name: 'user',
        params: { username }
      }
    },
    vehicleLinkObject (vin) {
      return {
        name: 'vehicle',
        params: { vin }
      }
    },
    async vehicleManagedSessionEnd () {
      const componentSelf = this
      const payload = {
        vin: this.managedSession.vin
      }
      await this.vehicleManagedSessionEndAction({ componentSelf, payload })
      this.$emit('vehicle-managed-session-end-complete')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .managed-session {
    .v-card {
      .v-card {
        margin-top: 20px;
      }
    }
  }
}
.no-data {
  font-size: 1.5rem;
  text-align: center;
}

.loading {
  font-weight: bold;
  font-size: 20px;
  color: #00a6ff;
}
.pulse {
  animation: pulsate 2s ease-out;
  animation-iteration-count: infinite;
  opacity: 0.5;
}

@keyframes pulsate {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
