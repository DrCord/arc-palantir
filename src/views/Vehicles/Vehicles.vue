<template>
  <div class="vehicles">
    <page-header title="Vehicles" :quick-links="getQuickLinks"  @quick-link-event="handleQuickLink" />
    <div class="vehicles-container content-container">
      <vehicles-list  :quick-link-action="quickLink" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ACCESS_VEHICLE_PROVISION } from '@/store/getter-types'
import PageHeader from '@/components/PageHeader.vue'
import VehiclesList from '@/components/Vehicles/VehiclesList.vue'

// NOTE - don't summon - the app automatically handles getting this data once in the 'vehicles' portion

export default {
  name: 'VehiclesView',
  components: {
    PageHeader,
    VehiclesList
  },
  data () {
    return {
      quickLink: null
    }
  },
  computed: {
    ...mapGetters({
      operatorCanProvisionVehicle: ACCESS_VEHICLE_PROVISION
    }),
    getQuickLinks () {
      var links = []
      if (this.operatorCanProvisionVehicle) {
        links = [
          { text: 'Provision', emit: 'vehicle-provision' }
        ]
      }
      return links
    }
  },
  methods: {
    handleQuickLink (quick) {
      // anonymous object for watcher for multiple links
      this.quickLink = { quick: quick }
    }
  }
}

</script>
