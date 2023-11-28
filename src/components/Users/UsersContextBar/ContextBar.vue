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
    <v-list-item v-if="contentType === 'user-create'">
      <user-create
        @user-create-cancel="userCreateCancel"
        @user-create-complete="userCreateComplete"
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

import Actions from '@/components/Users/UsersContextBar/Actions.vue'
import UserCreate from '@/components/Users/UsersContextBar/UserCreate.vue'

export default {
  name: 'UsersContextBar',
  components: {
    Actions,
    UserCreate
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
    userCreateCancel (event) {
      this.$emit('user-create-cancel', event)
    },
    userCreateComplete (event) {
      this.$emit('user-create-complete', event)
    }
  }
}
</script>
