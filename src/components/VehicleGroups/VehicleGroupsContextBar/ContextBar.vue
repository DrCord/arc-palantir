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
    <v-list-item v-if="contentType === 'vehicle-group-create'">
      <vehicle-group-create
        @fleet-create-cancel="fleetCreateCancel"
        @fleet-create-complete="fleetCreateComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-group-delete'">
      <vehicle-group-delete
        @fleet-delete-cancel="fleetDeleteCancel"
        @fleet-delete-complete="fleetDeleteComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'department-code-create'">
      <department-code-create
        @department-code-create-cancel="departmentCodeCreateCancel"
        @department-code-create-complete="departmentCodeCreateComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'department-code-delete'">
      <department-code-delete
        @department-code-delete-cancel="departmentCodeDeleteCancel"
        @department-code-delete-complete="departmentCodeDeleteComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'department-code-manage'">
      <department-code-manage
        @department-code-manage-cancel="departmentCodeManageCancel"
        @department-code-manage-complete="departmentCodeManageComplete"
      />
    </v-list-item>
    <v-list nav> </v-list>
    <v-list nav> </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  OPERATOR_LOADED,
  OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE
} from '@/store/getter-types'

import Actions from '@/components/VehicleGroups/VehicleGroupsContextBar/Actions.vue'
import VehicleGroupCreate from '@/components/VehicleGroups/VehicleGroupsContextBar/VehicleGroupCreate.vue'
import VehicleGroupDelete from '@/components/VehicleGroups/VehicleGroupsContextBar/VehicleGroupDelete.vue'
import DepartmentCodeCreate from '@/components/VehicleGroups/VehicleGroupsContextBar/DepartmentCodeCreate.vue'
import DepartmentCodeDelete from '@/components/VehicleGroups/VehicleGroupsContextBar/DepartmentCodeDelete.vue'
import DepartmentCodeManage from '@/components/VehicleGroups/VehicleGroupsContextBar/DepartmentCodeManage.vue'

export default {
  name: 'VehicleGroupsContextBar',
  components: {
    Actions,
    VehicleGroupCreate,
    VehicleGroupDelete,
    DepartmentCodeCreate,
    DepartmentCodeDelete,
    DepartmentCodeManage
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
    departmentCodeCreateCancel (event) {
      this.$emit('department-code-create-cancel', event)
    },
    departmentCodeCreateComplete (event) {
      this.$emit('department-code-create-complete', event)
    },
    departmentCodeDeleteCancel (event) {
      this.$emit('department-code-delete-cancel', event)
    },
    departmentCodeDeleteComplete (event) {
      this.$emit('department-code-delete-complete', event)
    },
    departmentCodeManageCancel (event) {
      this.$emit('department-code-manage-cancel', event)
    },
    departmentCodeManageComplete (event) {
      this.$emit('department-code-manage-complete', event)
    },
    fleetCreateCancel (event) {
      this.$emit('fleet-create-cancel', event)
    },
    fleetCreateComplete (event) {
      this.$emit('fleet-create-complete', event)
    },
    fleetDeleteCancel (event) {
      this.$emit('fleet-delete-cancel', event)
    },
    fleetDeleteComplete (event) {
      this.$emit('fleet-delete-complete', event)
    },
    outsideClickCloseEmit (event) {
      if (event === false && this.contextBarOutsideClickClose) {
        this.closeContextBar()
      }
    }
  }
}
</script>
