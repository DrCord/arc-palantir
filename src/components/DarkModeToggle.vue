<template>
  <v-btn @click="toggleMode">Dark Mode: {{ darkModeEnabled ? 'Disable' : 'Enable' }}</v-btn>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { USER_PREFERENCE_SAVE } from '@/store/action-types'
import {
  OPERATOR_LOADED,
  OPERATOR_PREFERENCE_DARK_MODE,
  OPERATOR_USERNAME
} from '@/store/getter-types'

export default {
  name: 'DarkModeToggle',
  props: {
    darkMode: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      operatorLoaded: OPERATOR_LOADED,
      operatorPreferenceDarkMode: OPERATOR_PREFERENCE_DARK_MODE,
      operatorUsername: OPERATOR_USERNAME
    }),
    darkModeEnabled () {
      return this.$vuetify.theme.dark
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      userPreferenceSaveAction: USER_PREFERENCE_SAVE
    }),
    init () {
      this.$vuetify.theme.dark = !!this.operatorPreferenceDarkMode
    },
    async setPreference () {
      const componentSelf = this
      const payload = {
        username: this.operatorUsername,
        body: {
          preference_identifier: 'dark_mode',
          preference_value: this.$vuetify.theme.dark ? 'true' : 'false'
        }
      }
      await this.userPreferenceSaveAction({ componentSelf, payload })
    },
    toggleMode () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
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
