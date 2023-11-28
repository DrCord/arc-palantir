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

    <v-list-item v-if="visible && !contentType">
      <actions
        @change-panel="changeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-provision'">
      <vehicle-provision
        @change-context="changeContext"
        @close-context="closeContext"
        @provision-complete="provisionComplete"
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

import Actions from '@/components/Vehicles/VehiclesContextBar/Actions.vue'
import VehicleProvision from '@/components/Vehicles/VehiclesContextBar/Provision.vue'

export default {
  name: 'VehiclesContextBar',
  components: {
    Actions,
    VehicleProvision
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
    closeContext () {
      this.$emit('close-context')
    },
    closeContextBar () {
      this.$emit('context-bar-visible', false)
    },
    outsideClickCloseEmit (event) {
      if (event === false && this.contextBarOutsideClickClose) {
        this.closeContextBar()
      }
    },
    provisionComplete (event) {
      if (event && event.vin && event.navigate) {
        const route = 'vehicles/' + event.vin
        this.$router.push(route)
      }
      this.$emit('provision-complete', event)
    }
  }
}
</script>
