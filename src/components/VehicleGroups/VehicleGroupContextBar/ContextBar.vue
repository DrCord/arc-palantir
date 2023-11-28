<template>
  <v-navigation-drawer
    v-model="active"
    app
    class="context-menu"
    :hide-overlay="!contextBarOutsideClickClose"
    right
    :stateless="!contextBarOutsideClickClose"
    temporary
    width="450px"
    @input="outsideClickCloseEmit"
  >
    <v-list-item>
      <v-icon large @click="$emit('context-bar-visible', false)">mdi-close</v-icon>
    </v-list-item>
    <v-list-item v-if="!contentType">
      <actions
       :fleet-id="fleetId"
        @change-panel="changeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-add'">
      <vehicle-add
        :fleet-id="fleetId"
        @fleet-add-vehicle-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-remove'">
      <vehicle-remove
        :fleet-id="fleetId"
        @fleet-remove-vehicle-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'user-add'">
      <user-add
        :fleet-id="fleetId"
        @fleet-add-user-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'user-remove'">
      <user-remove
        :fleet-id="fleetId"
        @fleet-remove-user-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'type-set'">
      <type-set
        :fleet-id="fleetId"
        @fleet-type-set-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'fleet-update'">
      <fleet-update
        :fleet-id="fleetId"
        @fleet-update-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'location-set'">
      <location-set
        :fleet-id="fleetId"
        @fleet-location-set-complete="closeContext"
        @department-code-manage-cancel="closeContext"
        @department-code-manage-complete="closeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'department-code-manage'">
      <department-code-manage
        :fleet-id="fleetId"
        @department-code-manage-cancel="departmentCodeManageCancel"
        @department-code-manage-complete="departmentCodeManageComplete"
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

import Actions from '@/components/VehicleGroups/VehicleGroupContextBar/Actions.vue'
import DepartmentCodeManage from '@/components/VehicleGroups/VehicleGroupContextBar/DepartmentCodeManage.vue'
import LocationSet from '@/components/VehicleGroups/VehicleGroupContextBar/LocationSet.vue'
import TypeSet from '@/components/VehicleGroups/VehicleGroupContextBar/TypeSet.vue'
import FleetUpdate from '@/components/VehicleGroups/VehicleGroupContextBar/FleetUpdate.vue'
import UserAdd from '@/components/VehicleGroups/VehicleGroupContextBar/UserAdd.vue'
import UserRemove from '@/components/VehicleGroups/VehicleGroupContextBar/UserRemove.vue'
import VehicleAdd from '@/components/VehicleGroups/VehicleGroupContextBar/VehicleAdd.vue'
import VehicleRemove from '@/components/VehicleGroups/VehicleGroupContextBar/VehicleRemove.vue'

export default {
  name: 'VehicleGroupContextBar',
  components: {
    Actions,
    DepartmentCodeManage,
    LocationSet,
    FleetUpdate,
    TypeSet,
    UserAdd,
    UserRemove,
    VehicleAdd,
    VehicleRemove
  },
  props: {
    contentType: {
      default: null,
      type: String
    },
    fleetId: {
      default: null,
      type: Number
    },
    visible: {
      default: false,
      type: Boolean
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
    departmentCodeManageCancel (event) {
      this.$emit('department-code-manage-cancel', event)
    },
    departmentCodeManageComplete (event) {
      this.$emit('department-code-manage-complete', event)
    },
    outsideClickCloseEmit (event) {
      if (event === false && this.contextBarOutsideClickClose) {
        this.closeContextBar()
      }
    }
  }
}
</script>
