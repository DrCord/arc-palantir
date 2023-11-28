<template>
  <v-btn
    @click="toggleMode"
  >Context Bar Outside Click Close: {{ operatorPreferenceContextBarOutsideClickClose ? 'Disable' : 'Enable' }}
  </v-btn>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { USER_PREFERENCE_SAVE } from '@/store/action-types'
import {
  OPERATOR_LOADED,
  OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE,
  OPERATOR_USERNAME
} from '@/store/getter-types'

export default {
  name: 'ContextBarOutsideClickClose',
  props: {
    darkMode: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      operatorLoaded: OPERATOR_LOADED,
      operatorPreferenceContextBarOutsideClickClose: OPERATOR_PREFERENCE_CONTEXT_BAR_OUTSIDE_CLICK_CLOSE,
      operatorUsername: OPERATOR_USERNAME
    })
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      userPreferenceSaveAction: USER_PREFERENCE_SAVE
    }),
    init () {
      // TODO
      // this.$vuetify.theme.dark = !!this.operatorPreferenceContextBarOutsideClickClose
    },
    async setPreference () {
      const componentSelf = this
      const preferenceNewValue = (!this.operatorPreferenceContextBarOutsideClickClose).toString()
      const payload = {
        username: this.operatorUsername,
        body: {
          preference_identifier: 'context_bar_outside_click_close',
          preference_value: preferenceNewValue
        }
      }
      await this.userPreferenceSaveAction({ componentSelf, payload })
    },
    toggleMode () {
      this.setPreference()
    }
  }
}
</script>

<style lang="scss">
#app {
  .dark-mode-toggle {
    font-size: 10px;
    margin: 0 5px;
  }
}
</style>
