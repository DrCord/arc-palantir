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
        :authority-id="authorityId"
        @change-panel="changeContext"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'authority-delete'">
      <authority-delete
        :authority-id="authorityId"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'grant-vehicle-access'">
      <grant-vehicle-access
        :authority-id="authorityId"
        @authority-grant-vehicle-access-complete="authorityGrantVehicleAccessComplete"
      />
    </v-list-item>
    <v-list-item v-if="contentType === 'revoke-vehicle-access'">
      <revoke-vehicle-access
        :authority-id="authorityId"
        @authority-revoke-vehicle-access-complete="authorityRevokeVehicleAccessComplete"
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

import Actions from '@/components/Authorities/AuthorityContextBar/Actions.vue'
import AuthorityDelete from '@/components/Authorities/AuthorityContextBar/Delete.vue'
import GrantVehicleAccess from '@/components/Authorities/AuthorityContextBar/GrantVehicleAccess.vue'
import RevokeVehicleAccess from '@/components/Authorities/AuthorityContextBar/RevokeVehicleAccess.vue'

export default {
  name: 'AuthorityContextBar',
  components: {
    Actions,
    AuthorityDelete,
    GrantVehicleAccess,
    RevokeVehicleAccess
  },
  props: {
    contentType: {
      type: String,
      default: null
    },
    authorityId: {
      type: [Number, String],
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
    authorityGrantVehicleAccessComplete () {
      this.closeContextBar()
      this.$emit('authority-grant-vehicle-access-complete')
    },
    authorityRevokeVehicleAccessComplete () {
      this.closeContextBar()
      this.$emit('authority-revoke-vehicle-access-complete')
    },
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
    }
  }
}
</script>
