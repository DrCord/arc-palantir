<template>
    <div class="location">
      <page-header title="Location" />
      <div class="location-container content-container">
        <LocationComponent :location-id="locationId" />
      </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  LOCATIONS_SUMMON,
  LOCATION_SUMMON
} from '@/store/action-types'
import {
  LOCATION,
  OPERATOR_LOADED
} from '@/store/getter-types'

import LocationComponent from '@/components/Locations/Location.vue'
import PageHeader from '@/components/PageHeader.vue'

import utility from '@/lib/utility'

export default {
  name: 'LocationView',
  components: {
    LocationComponent,
    PageHeader
  },
  data () {
    return {
      locationId: null
    }
  },
  computed: {
    ...mapGetters({
      location: LOCATION,
      operatorLoaded: OPERATOR_LOADED
    })
  },
  watch: {
    operatorLoaded: {
      handler (newVal) {
        if (newVal) {
          this.entitiesSummon()
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
      locationsSummonAction: LOCATIONS_SUMMON,
      locationSummonAction: LOCATION_SUMMON
    }),
    init () {
      if (!this.$route.params.id) {
        this.redirectToLocations()
      }
    },
    async entitiesSummon () {
      const componentSelf = this
      const force = false
      await this.locationsSummonAction({ componentSelf, force })
      this.locationSummon()
    },
    async locationSummon () {
      const locationId = parseInt(this.$route.params.id, 10)
      const componentSelf = this
      const force = true
      await this.locationSummonAction({ componentSelf, payload: { locationId, force } })
      this.locationId = locationId
    },
    redirectToLocations () {
      utility.redirect(this, 'locations')
    }
  }
}
</script>
