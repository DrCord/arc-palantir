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
    <v-list-item v-if="contentType === 'recall-create'">
      <recall-create
        @recall-create-cancel="recallCreateCancel"
        @recall-create-complete="recallCreateComplete"
        @vehicles-add-complete="vehicleActionComplete"
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

import Actions from '@/components/Recalls/RecallsContextBar/Actions.vue'
import RecallCreate from '@/components/Recalls/RecallsContextBar/RecallCreate.vue'

export default {
  name: 'RecallsContextBar',
  components: {
    Actions,
    RecallCreate
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
    outsideClickCloseEmit (event) {
      if (event === false && this.contextBarOutsideClickClose) {
        this.closeContextBar()
      }
    },
    recallCreateCancel (event) {
      this.$emit('recall-create-cancel', event)
    },
    recallCreateComplete (event) {
      this.$emit('recall-create-complete', event)
    },
    vehicleActionComplete (event) {
      this.$emit('vehicle-action-complete', event)
    }
  }
}
</script>
