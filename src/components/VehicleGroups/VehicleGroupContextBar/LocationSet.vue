<template>
  <div class="fleet-location-set-container">
    <h3>Set Location for Fleet</h3>
    <vue-form :state="formstate" @submit.prevent="fleetLocationSet">
      <div id="location-set-container">
        <div class="location-enable">
          <label for="enable-location">
            Set Location
          </label>
          <v-switch
            id="locationEnable"
            v-model="model.locationEnable"
            name="location-enable"
            type="checkbox"
            @change="locationSetEnabledToggled"
          />
        </div>
      </div>
      <v-select
        v-model="model.fleetLocation"
        :disabled="!model.locationEnable"
        :items="locations"
        item-text="locationName"
        item-value="id"
        outlined
      ></v-select>
        <v-btn
          class="group-location-set"
          color="success"
          type="submit"
          :disabled="formstate.$invalid"
          >Set Location</v-btn>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEET_LOCATION_SAVE,
  LOCATIONS_SUMMON
} from '@/store/action-types'
import {
  FLEET_LOCATION_ID,
  LOCATIONS
} from '@/store/getter-types'

export default {
  name: 'FleetLocationSet',
  props: {
    fleetId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      formstate: {},
      model: {
        locationEnable: false,
        fleetLocation: null
      }
    }
  },
  computed: {
    ...mapGetters({
      fleetLocationGet: FLEET_LOCATION_ID,
      locations: LOCATIONS
    }),
    fleetLocation () {
      return this.fleetId ? this.fleetLocationGet(this.fleetId) : null
    }
  },
  watch: {
    fleetLocation: {
      handler (newVal, oldVal) {
        if (newVal) {
          const fleetLocationValue = this.fleetLocation
          if (fleetLocationValue) {
            this.model.locationEnable = true
            this.model.fleetLocation = fleetLocationValue
          } else {
            this.model.locationEnable = false
            this.model.fleetLocation = null
          }
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      fleetLocationSaveAction: FLEET_LOCATION_SAVE,
      locationsSummonAction: LOCATIONS_SUMMON
    }),
    init () {
      this.locationsSummon()
    },
    locationSetEnabledToggled: function (toggleEvent) {
      if (!toggleEvent) {
        this.model.fleetLocation = null
      }
    },
    async fleetLocationSet () {
      const componentSelf = this
      const locationCode = this.locations.find(x => x.id === this.model.fleetLocation).locationCode
      const payload = {
        fleetId: this.fleetId,
        body: {
          location_id: this.model.fleetLocation,
          locationCode: locationCode
        }
      }
      if (!this.model.locationEnable) {
        payload.body.location_id = null
      }
      await this.fleetLocationSaveAction({ componentSelf, payload })
      this.$emit('fleet-location-set-complete')
    },
    async locationsSummon () {
      const componentSelf = this
      await this.locationsSummonAction({ componentSelf })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .location-enable {
    .v-input--switch {
      margin-top: 0;
    }
  }
}
</style>
