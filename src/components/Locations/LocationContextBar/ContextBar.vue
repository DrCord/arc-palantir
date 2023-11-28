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
        :location-id="locationId"
        @change-panel="changeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'location-delete'">
      <location-delete
        :location-id="locationId"
        @location-delete-cancel="locationDeleteCancel"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'location-edit'">
      <location-edit
        :location-id="locationId"
        @location-update-cancel="locationUpdateCancel"
        @location-update-complete="closeContextBar"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'location-code-manage'">
      <location-code-manage
        :location-id="locationId"
        @location-code-manage-cancel="locationCodeManageCancel"
        @location-code-manage-complete="closeContextBar"
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

import Actions from '@/components/Locations/LocationContextBar/Actions.vue'
import LocationDelete from '@/components/Locations/LocationContextBar/LocationDelete.vue'
import LocationEdit from '@/components/Locations/LocationContextBar/LocationEdit.vue'
import LocationCodeManage from '@/components/Locations/LocationContextBar/LocationCodeManage.vue'

export default {
  name: 'LocationContextBar',
  components: {
    Actions,
    LocationDelete,
    LocationEdit,
    LocationCodeManage
  },
  props: {
    contentType: {
      type: String,
      default: null
    },
    locationId: {
      type: Number,
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
    locationCodeManageCancel (event) {
      this.$emit('location-code-manage-cancel', event)
    },
    locationDeleteCancel (event) {
      this.$emit('location-delete-cancel', event)
    },
    locationGrantVehicleAccessComplete () {
      this.closeContextBar()
      this.$emit('location-grant-vehicle-access-complete')
    },
    locationRevokeVehicleAccessComplete () {
      this.closeContextBar()
      this.$emit('location-revoke-vehicle-access-complete')
    },
    locationUpdateCancel (event) {
      this.$emit('location-update-cancel', event)
    },
    outsideClickCloseEmit (event) {
      if (event === false && this.contextBarOutsideClickClose) {
        this.closeContextBar()
      }
    }
  }
}
</script>
