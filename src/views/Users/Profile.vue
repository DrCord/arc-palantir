<template>
  <div class="profile">
    <page-header
      :title=title
      :username="username"
      @user-mfa-configuration-open="mfaConfigurationOpen"
      @user-profile-edit-init="editUserProfileInit"
    />
    <div class="profile-container content-container">
      <user-component
        :operator-is-user="true"
        :username="username"
        :mfa-event="mfaEvent"
        :user-profile-event="userProfileEvent"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  USER_FLEETS_SUMMON,
  USER_SUMMON
} from '@/store/action-types'
import {
  OPERATOR_LOADED,
  OPERATOR_USERNAME,
  USER_DISPLAY_NAME
} from '@/store/getter-types'

import PageHeader from '@/components/PageHeader.vue'
import UserComponent from '@/components/Users/User.vue'

export default {
  name: 'ProfileView',
  components: {
    PageHeader,
    UserComponent
  },
  data () {
    return {
      username: null,
      mfaEvent: null
    }
  },
  computed: {
    ...mapGetters({
      operatorLoaded: OPERATOR_LOADED,
      operatorUsername: OPERATOR_USERNAME,
      userDisplayNameGet: USER_DISPLAY_NAME
    }),
    displayName () {
      return this.username ? ': ' + this.userDisplayNameGet(this.username) : ''
    },
    title () {
      return 'Active User' + this.displayName
    }
  },
  watch: {
    operatorLoaded: {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.userSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      userFleetsSummonAction: USER_FLEETS_SUMMON,
      userSummonAction: USER_SUMMON
    }),
    mfaConfigurationOpen (event) {
      this.mfaEvent = event
    },
    async userFleetsSummon () {
      const { userFleetsSummonAction } = this
      const username = this.operatorUsername
      const componentSelf = this
      const payload = {
        username
      }
      await userFleetsSummonAction({ componentSelf, payload })
    },
    async userSummon () {
      const { userSummonAction } = this
      const componentSelf = this
      const username = this.operatorUsername
      const force = false
      await userSummonAction({ componentSelf, username, force })
      this.username = username
      this.userFleetsSummon()
    }
  }
}
</script>

<style lang="scss">
#app {
  .content-container {
    &.profile-container {
      margin: 0 auto;
      padding: 0;
    }
  }
  .user-details--text {
    border-radius: 0;
    margin-top: 0;
  }
}
</style>
