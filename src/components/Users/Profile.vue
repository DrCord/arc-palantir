<template>
  <div class="profile-container page-header-item">
    <div v-if="avatarExists" class="avatar">
      <avatar
        :username="username"
        @avatar-edit-init="editAvatar"
      />
    </div>
    <div v-else class="avatar-place-holder">&nbsp;</div>
    <div class="profile-data">
      <div v-if="jobTitle || phone" class="profile-data-row">
        <profile-data-item :item=jobTitle icon="account-hard-hat-outline" />
        <profile-data-item :item=phone icon="phone-outline" />
      </div>
      <div class="profile-data-row"><hr /></div>
      <div v-if="email || slackHandle" class="profile-data-row">
        <profile-data-item :item=email icon="email-outline" />
        <profile-data-item :item=slackHandle icon="slack" />
      </div>
      <div
        v-if="userConfirmed === false || userEnabled === false"
        class="profile-data-row"
      >
        <hr />
      </div>
      <div
        v-if="userConfirmed === false || userEnabled === false"
        class="profile-data-row"
      >
        <span
          v-if="userConfirmed === false"
          class="profile-data-item"
        >
          User Unconfirmed
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-icon
                class="user-warning-icon user-unconfirmed fa fa-exclamation-triangle"
                v-on='on'
              >
                mdi-alert
              </v-icon>
            </template>
            <span>{{displayName}} has not confirmed this account</span>
          </v-tooltip>
        </span>
        <span
          v-if="userEnabled === false"
          class="profile-data-item"
          >
          User Disabled
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-icon
                class="user-warning-icon user-disabled fa fa-exclamation-triangle"
                v-on='on'
              >
                mdi-alert
              </v-icon>
            </template>
            <span>The account for {{displayName}} is disabled</span>
          </v-tooltip>
        </span>
      </div>
    </div>
    <div class="mfa">
      <v-tooltip
        v-if="operatorIsUser || operatorCanEditProfile"
        bottom
        >
        <template #activator="{ on }">
          <v-icon
            v-if="mfaEnabled"
            color="white"
            v-on='on'
            @click="openMfaConfiguration">
              mdi-lock
          </v-icon>
          <v-icon
            v-else
            color="white"
            v-on='on'
            @click="openMfaConfiguration"
          >
            mdi-lock-off
          </v-icon>
        </template>
        <span v-if="mfaEnabled">MFA Enabled, click for configuration</span>
        <span v-else>MFA Disabled, click for configuration</span>
      </v-tooltip>
      <v-tooltip
        v-else
        color="white"
      >
        <template #activator="{ on }">
          <v-icon v-if="mfaEnabled" color="white"
          v-on='on'>mdi-lock-small</v-icon>
          <v-icon v-else  color="white"
        v-on='on'>mdi-lock-off-small</v-icon>
        </template>
        <span v-if="mfaEnabled">MFA Enabled</span>
        <span v-else>MFA Disabled</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_USER_EDIT_PROFILE,
  OPERATOR_IS_USER,
  USER_AVATAR,
  USER_CONFIRMED,
  USER_DISPLAY_NAME,
  USER_EMAIL,
  USER_ENABLED,
  USER_MFA_ENABLED,
  USER_PHONE_FORMATTED
} from '@/store/getter-types'

import Avatar from '@/components/Users/Avatar.vue'
import ProfileDataItem from './ProfileDataItem.vue'

export default {
  name: 'UserProfile',
  components: {
    Avatar,
    ProfileDataItem
  },
  props: {
    username: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      operatorCanEditProfile: ACCESS_USER_EDIT_PROFILE,
      operatorIsUserGet: OPERATOR_IS_USER,
      userAvatarGet: USER_AVATAR,
      userConfirmedGet: USER_CONFIRMED,
      userDisplayNameGet: USER_DISPLAY_NAME,
      userEmailGet: USER_EMAIL,
      userEnabledGet: USER_ENABLED,
      userMfaEnabledGet: USER_MFA_ENABLED,
      userPhoneFormattedGet: USER_PHONE_FORMATTED
    }),
    avatarExists () {
      const avatar = this.userAvatarGet(this.username)
      return (avatar && avatar.avatarImg !== null)
    },
    darkModeEnabled () {
      return this.$vuetify.theme.dark
    },
    displayName () {
      return this.username ? this.userDisplayNameGet(this.username) : null
    },
    jobTitle () {
      // stub for future data layout test by defaulting first null to a string
      return this.username ? null : null
    },
    email () {
      return this.username ? this.userEmailGet(this.username) : null
    },
    mfaEnabled () {
      return this.username ? this.userMfaEnabledGet(this.username) : null
    },
    operatorIsUser () {
      return this.username ? this.operatorIsUserGet(this.username) : null
    },
    phone () {
      return this.username ? this.userPhoneFormattedGet(this.username) : null
    },
    slackHandle () {
      // stub for future data layout test by defaulting first null to a string
      return this.username ? null : null
    },
    userEnabled () {
      return this.username ? this.userEnabledGet(this.username) : null
    },
    userConfirmed () {
      return this.username ? this.userConfirmedGet(this.username) : null
    }
  },
  methods: {
    editAvatar () {
      this.$emit('user-profile-edit-init', { name: 'avatar', type: 'edit' })
    },
    openMfaConfiguration () {
      this.$emit('user-mfa-configuration-open', { name: 'mfa-configuration', type: 'open' })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .profile-container {
    padding-top: .6rem;
    flex-direction:row;
    align-items: center;
    column-gap: 5rem;
    color: white;
    & > .avatar {
      margin-left: auto;
      margin-right: auto;
      width: 100px;
    }
    & > .avatar-place-holder {
      width: .1rem;
    }
    .profile-data-row {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      column-gap: 3rem;
      .profile-data-item {
        display: flex;
        flex-flow: row;
        column-gap: 1.5rem;

      }
    }
    hr {
      flex-grow: 1;
      border-top: 1px solid white;
    }
    .user-warning-icon {
      font-size: 1.5rem;
      vertical-align: top;
    }
    .user-disabled {
      color: red;
    }
    .user-unconfirmed {
      color: orange;
    }
    .mfa {
      button {
        font-size: 2rem;
      }
    }
  }
}
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (max-width: 780px) {
  #app {
    .profile-container {
        display: flex;
        flex-flow: column;
        & > .avatar {
          margin-bottom: .5rem;
          margin-top: 0;
          margin-left: 10px;
          margin-right: 20px;
        }
      .profile-data-row {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        row-gap: .5rem;
        .profile-data-item {
          display: flex;
          flex-flow: roe;
          row-gap: .5rem;

        }

      }
    }
  }
}
</style>
