<template>
  <div class="user">
    <page-header
      :title=displayName
      :username=username
      @user-mfa-configuration-open="mfaConfigurationOpen"
      @user-profile-edit-init="editUserProfileInit"
    />
    <div class="user-container content-container">
      <user-component
        :username="username"
        :mfa-event="mfaEvent"
        :user-profile-event="userProfileEvent"
        @user-grant-ability-complete="grantAbilityComplete"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  USER_FLEETS_SUMMON,
  USER_NOTES_SUMMON,
  USER_SUMMON,
  USERS_ABILITIES_SUMMON
} from '@/store/action-types'
import {
  ACCESS_FLEETS_GROUPS,
  ACCESS_USERS,
  OPERATOR_IS_USER,
  OPERATOR_LOADED,
  USER_DISPLAY_NAME,
  USER_EXISTS,
  USER_LOADED
} from '@/store/getter-types'

import PageHeader from '@/components/PageHeader.vue'
import UserComponent from '@/components/Users/User.vue'

import utility from '@/lib/utility'

export default {
  name: 'UserView',
  components: {
    PageHeader,
    UserComponent
  },
  data () {
    return {
      username: null,
      mfaEvent: null,
      userProfileEvent: null
    }
  },
  computed: {
    ...mapGetters({
      operatorCanAccessFleetsGroups: ACCESS_FLEETS_GROUPS,
      operatorCanAccessUsers: ACCESS_USERS,
      operatorIsUserGet: OPERATOR_IS_USER,
      operatorLoaded: OPERATOR_LOADED,
      userDisplayNameGet: USER_DISPLAY_NAME,
      userExistsGet: USER_EXISTS,
      userLoadedGet: USER_LOADED
    }),
    operatorIsUser () {
      return this.username ? this.operatorIsUserGet(this.username) : null
    },
    displayName () {
      return this.username ? this.userDisplayNameGet(this.username) : null
    },
    userExists () {
      const username = this.$route.params.username
      return username ? this.userExistsGet(username) : null
    },
    userLoaded () {
      return this.username ? this.userLoadedGet(this.username) : null
    }
  },
  watch: {
    operatorLoaded: {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.userSummon()
          this.abilitiesSummon()
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      abilitiesSummonAction: USERS_ABILITIES_SUMMON,
      userFleetsSummonAction: USER_FLEETS_SUMMON,
      userNotesSummonAction: USER_NOTES_SUMMON,
      userSummonAction: USER_SUMMON
    }),
    init () {
      if (!this.$route.params.username) {
        this.redirectToUsers()
      }
    },
    async abilitiesSummon () {
      const componentSelf = this
      const { abilitiesSummonAction } = this
      await abilitiesSummonAction({ componentSelf })
    },
    grantAbilityComplete () {
      this.username = null
      this.userSummon(true)
    },
    mfaConfigurationOpen (event) {
      this.mfaEvent = event
    },
    editUserProfileInit (event) {
      this.userProfileEvent = event
    },
    async userFleetsSummon () {
      if (this.operatorIsUser || this.operatorCanAccessFleetsGroups) {
        const { username } = this
        const componentSelf = this
        const payload = {
          username
        }
        await this.userFleetsSummonAction({ componentSelf, payload })
      }
    },
    async userNotesSummon () {
      const { username } = this
      const componentSelf = this
      const payload = {
        username
      }
      await this.userNotesSummonAction({ componentSelf, payload })
    },
    async userSummon (force = false) {
      if (this.operatorIsUser || this.operatorCanAccessUsers) {
        const { userSummonAction } = this
        const componentSelf = this
        const username = this.$route.params.username
        await userSummonAction({ componentSelf, username, force })
        if (!this.userExists) {
          this.redirectToUsers()
        } else {
          this.username = username
          this.userFleetsSummon()
          this.userNotesSummon()
        }
      }
    },
    redirectToUsers () {
      utility.redirect(this, 'users')
    }
  }
}
</script>

<style lang="scss">
#app {
  .content-container {
    &.user-container {
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
