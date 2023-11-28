<template>
  <div class="location">
    <location-display-card :location-id="locationId"/>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <context-bar
      :content-type="contextBarContentType"
      :location-id="locationId"
      :visible="contextBarVisible"
      @change-context="changeContext"
      @context-bar-visible="toggleContextBar($event)"
      @location-code-create-complete="locationActionCancel"
      @location-delete-cancel="locationActionCancel"
      @location-update-cancel="locationActionCancel"
      @location-code-manage-cancel="locationActionCancel"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  ACCESS_LOCATIONS_ADMIN,
  OPERATOR_ABILITIES
} from '@/store/getter-types'

import ContextBarToggle from '@/components/ContextBarToggle.vue'
import ContextBar from '@/components/Locations/LocationContextBar/ContextBar.vue'
import LocationDisplayCard from '@/components/Locations/LocationDisplayCard.vue'

export default {
  name: 'Location',
  components: {
    ContextBarToggle,
    ContextBar,
    LocationDisplayCard
  },
  props: {
    locationId: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    locationVins: [],
    contextBarContentType: null,
    contextBarVisible: false
  }),
  computed: {
    ...mapGetters({
      operatorAbilities: OPERATOR_ABILITIES,
      operatorCanDeleteLocation: ACCESS_LOCATIONS_ADMIN,
      operatorCanEditLocation: ACCESS_LOCATIONS_ADMIN
    }),
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanDeleteLocation ||
             this.operatorCanEditLocation
    }
  },
  methods: {
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
    },
    closeContextBar () {
      this.toggleContextBar(false)
    },
    locationActionCancel () {
      this.toggleContextBar(true, null)
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    }
  }
}
</script>
