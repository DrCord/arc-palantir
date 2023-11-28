<template>
  <div class="user-enabled-toggle-container">
    <v-btn
      @click="userEnabledToggle"
    >User: {{ userEnabled ? 'Disable' : 'Enable' }}
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  USER_DISABLE,
  USER_ENABLE
} from '@/store/action-types'
import { USER_ENABLED } from '@/store/getter-types'

export default {
  name: 'UserEnabledToggle',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      userEnabledGet: USER_ENABLED
    }),
    userEnabled () {
      return this.username ? this.userEnabledGet(this.username) : null
    }
  },
  methods: {
    ...mapActions({
      userDisableAction: USER_DISABLE,
      userEnableAction: USER_ENABLE
    }),
    userDisable () {
      const componentSelf = this
      const username = this.username
      const payload = {
        username,
        body: {}
      }
      this.userDisableAction({ componentSelf, payload })
        .then(() => {
          this.$emit('user-enabled-toggle-complete', { username, enabled: false })
        })
    },
    userEnable () {
      const componentSelf = this
      const username = this.username
      const payload = {
        username,
        body: {}
      }
      this.userEnableAction({ componentSelf, payload })
        .then(() => {
          this.$emit('user-enabled-toggle-complete', { username, enabled: true })
        })
    },
    userEnabledToggle () {
      if (!this.userEnabled) {
        this.userEnable()
      } else {
        this.userDisable()
      }
    }
  }
}
</script>
