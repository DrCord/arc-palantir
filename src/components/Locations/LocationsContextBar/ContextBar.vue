<template>
  <v-navigation-drawer
    v-model="active"
    app
    class="context-menu"
    :hide-overlay="!contextBarOutsideClickClose"
    right
    :stateless="!contextBarOutsideClickClose"
    temporary
    width="400px"
    @input="outsideClickCloseEmit"
  >
    <v-list-item>
      <v-icon large @click="$emit('context-bar-visible', false)">mdi-close</v-icon>
    </v-list-item>
    <v-list-item v-if="!contentType">
      <actions
        @change-panel="changeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'location-create'">
      <location-create
        @location-create-cancel="locationCreateCancel"
        @location-create-complete="locationCreateComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'location-code-create'">
      <location-code-create
        @location-code-create-cancel="locationCodeCreateCancel"
        @location-code-create-complete="locationCodeCreateComplete"
      />
    </v-list-item>
      <v-list-item v-if="contentType === 'location-code-delete'">
      <location-code-delete
        @location-code-delete-cancel="locationCodeDeleteCancel"
        @location-code-delete-complete="locationCodeDeleteComplete"
      />
    </v-list-item>
    <v-list nav> </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  OPERATOR_LOADED,
  OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE
} from '@/store/getter-types'

import Actions from '@/components/Locations/LocationsContextBar/Actions.vue'
import LocationCreate from '@/components/Locations/LocationsContextBar/LocationCreate.vue'
import LocationCodeCreate from '@/components/Locations/LocationsContextBar/LocationCodeCreate.vue'
import LocationCodeDelete from '@/components/Locations/LocationsContextBar/LocationCodeDelete.vue'

export default {
  name: 'LocationsContextBar',
  components: {
    Actions,
    LocationCreate,
    LocationCodeCreate,
    LocationCodeDelete
  },
  props: {
    contentType: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    active: false
  }),
  computed: {
    ...mapGetters({
      operatorLoaded: OPERATOR_LOADED,
      operatorPreferenceContextBarOutsideClickClose: OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE
    }),
    contextBarOutsideClickClose () {
      const { operatorLoaded, operatorPreferenceContextBarOutsideClickClose } = this
      return operatorLoaded ? operatorPreferenceContextBarOutsideClickClose : null
    }
  },
  watch: {
    visible (newVal) {
      this.active = newVal
    }
  },
  methods: {
    changeContext (event) {
      this.$emit('change-context', event)
    },
    closeContextBar () {
      this.$emit('context-bar-visible', false)
    },
    locationCreateCancel (event) {
      this.$emit('location-create-cancel', event)
    },
    locationCreateComplete (event) {
      this.$emit('location-create-complete', event)
    },
    locationCodeDeleteCancel (event) {
      this.$emit('location-code-delete-cancel', event)
    },
    locationCodeDeleteComplete () {
      this.$emit('location-code-delete-complete')
    },
    locationCodeCreateCancel (event) {
      this.$emit('location-code-create-cancel', event)
    },
    locationCodeCreateComplete () {
      this.$emit('location-code-create-complete')
    },
    outsideClickCloseEmit (event) {
      if (event === false && this.contextBarOutsideClickClose) {
        this.closeContextBar()
      }
    }
  }
}
</script>
