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
        :recall-id="recallId"
        @change-panel="changeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'recall-delete'">
      <recall-delete
        :recall-id="recallId"
        @recall-delete-cancel="recallActionCancel"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'recall-edit'">
      <recall-edit
        :recall-id="recallId"
        @recall-update-cancel="recallActionCancel"
        @recall-update-complete="recallActionComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'remedy-create'">
      <remedy-create
        :recall-id="recallId"
        @remedy-create-cancel="remedyActionCancel"
        @remedy-create-complete="remedyActionComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'remedy-delete'">
      <remedy-delete
        :recall-id="recallId"
        @remedy-delete-cancel="remedyActionCancel"
        @remedy-delete-complete="remedyActionComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'remedy-edit'">
      <remedy-edit
        :recall-id="recallId"
        @remedy-edit-cancel="remedyActionCancel"
        @remedy-edit-complete="remedyActionComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-add'">
      <vehicle-add
        :recall-id="recallId"
        @vehicle-add-cancel="vehicleActionCancel"
        @vehicle-add-complete="vehicleActionComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-edit'">
      <vehicle-edit
        :recall-id="recallId"
        :requested-vin="vin"
        @vehicle-edit-cancel="vehicleActionCancel"
        @vehicle-edit-complete="vehicleActionComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-remove'">
      <vehicle-remove
        :recall-id="recallId"
        :requested-vin="vin"
        @vehicle-remove-cancel="vehicleActionCancel"
        @vehicle-remove-complete="vehicleActionComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicle-service'">
      <vehicle-service
        :recall-id="recallId"
        :requested-vin="vin"
        @vehicle-service-cancel="vehicleActionCancel"
        @vehicle-service-complete="vehicleActionComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicles-add'">
      <vehicles-add
        :recall-id="recallId"
        @vehicles-add-cancel="vehicleActionCancel"
        @vehicles-add-complete="vehicleActionComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'vehicles-service'">
      <vehicles-service
        :recall-id="recallId"
        :requested-vin="vin"
        @vehicles-service-cancel="vehicleActionCancel"
        @vehicles-service-complete="vehicleActionComplete"
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

import Actions from '@/components/Recalls/RecallContextBar/Actions.vue'
import RecallDelete from '@/components/Recalls/RecallContextBar/RecallDelete.vue'
import RecallEdit from '@/components/Recalls/RecallContextBar/RecallEdit.vue'
import RemedyCreate from '@/components/Recalls/RecallContextBar/RemedyCreate.vue'
import RemedyDelete from '@/components/Recalls/RecallContextBar/RemedyDelete.vue'
import RemedyEdit from '@/components/Recalls/RecallContextBar/RemedyEdit.vue'
import VehicleAdd from '@/components/Recalls/RecallContextBar/VehicleAdd.vue'
import VehiclesAdd from '@/components/Recalls/RecallContextBar/VehiclesAdd.vue'
import VehicleEdit from '@/components/Recalls/RecallContextBar/VehicleEdit.vue'
import VehicleRemove from '@/components/Recalls/RecallContextBar/VehicleRemove.vue'
import VehicleService from '@/components/Recalls/RecallContextBar/VehicleService.vue'
import VehiclesService from '@/components/Recalls/RecallContextBar/VehiclesService.vue'

export default {
  name: 'RecallContextBar',
  components: {
    Actions,
    RecallDelete,
    RecallEdit,
    RemedyCreate,
    RemedyDelete,
    RemedyEdit,
    VehicleAdd,
    VehicleEdit,
    VehicleRemove,
    VehiclesAdd,
    VehicleService,
    VehiclesService
  },
  props: {
    contentType: {
      type: String,
      default: null
    },
    recallId: {
      type: Number,
      default: null
    },
    vin: {
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
    outsideClickCloseEmit (event) {
      if (event === false && this.contextBarOutsideClickClose) {
        this.closeContextBar()
      }
    },
    remedyActionCancel (event) {
      this.$emit('remedy-action-cancel', event)
    },
    remedyActionComplete (event) {
      this.$emit('remedy-action-complete', event)
    },
    recallActionCancel (event) {
      this.$emit('recall-action-cancel', event)
    },
    recallActionComplete (event) {
      this.$emit('recall-action-complete', event)
    },
    vehicleActionCancel (event) {
      this.$emit('vehicle-action-cancel', event)
    },
    vehicleActionComplete (event) {
      this.$emit('vehicle-action-complete', event)
    }
  }
}
</script>
