<template>
  <v-app
    id="app"
    :class="[$route.name, isMobile ? 'mobile' : 'desktop']"
  >
    <v-app-bar
      v-if="isMobile"
      id="app-mobile-top-bar"
      height="36px"
      flat
      app
      absolute
    >
      <div class="burger-container">
        <v-app-bar-nav-icon
          v-if="sessionValid"
          @click="updateSidebar(!sidebar)"
        ></v-app-bar-nav-icon>
      </div>
    </v-app-bar>
    <sidebar
      :active-nav-section="activeNavSection"
      :menu-items="menu"
      :open="sidebar"
      :session-valid="sessionValid"
      @sidebar="updateSidebar($event)"
    />
    <v-main id="page-wrap">
      <div class="container">
        <loading-overlay />
        <breadcrumbs />
        <router-view
          :app-messages="messages"
          :now="now"
          :session-valid="sessionValid"
          @loading="updateLoading"
          @toast="showToast"
        />
      </div>
    </v-main>
    <Footer
      v-if="sessionValid"
    />
    <idle-view
      :overlay-display-timeout="idleOverlayTimeout"
      :session-valid="sessionValid"
      @timed-out="setTimedOut"
    />
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import {
  AUTHORITIES_SUMMON,
  OPERATOR_SUMMON,
  VEHICLES_SUMMON,
  VEHICLES_MODELS_SUMMON
} from '@/store/action-types'
import {
  LOCAL_STORAGE_APPLICATION,
  LOCAL_STORAGE_NAMESPACE,
  VEHICLES_LIST,
  VEHICLES_WITH_AUTHORITIES_LIST
} from '@/lib/constants'
import {
  ACCESS_FLEETS_GROUPS,
  ACCESS_USERS,
  ACCESS_SUPER_ADMIN,
  ACCESS_VEHICLES,
  ACCESS_VEHICLES_WITH_AUTHORITIES,
  ACCESS_AUTHORITIES_ADMIN,
  COGNITO_USER_POOL,
  LOADING,
  OPERATOR,
  OPERATOR_ABILITIES,
  OPERATOR_LOADED,
  OPERATOR_PREFERENCE,
  OPERATOR_PREFERENCE_DARK_MODE,
  SESSION,
  VEHICLES_MODELS
} from '@/store/getter-types'
import {
  COGNITO_USER_RESET,
  COGNITO_USER_SET,
  LOADING_END,
  LOADING_START,
  OPERATOR_ABILITIES_RESET,
  OPERATOR_AVATAR_RESET,
  OPERATOR_DISPLAY_NAME_RESET,
  OPERATOR_EMAIL_RESET,
  OPERATOR_FLEETS_RESET,
  OPERATOR_PHONE_RESET,
  OPERATOR_PREFERENCES_RESET,
  OPERATOR_USERNAME_RESET,
  OPERATOR_USERNAME_SET,
  SESSION_ACCESS_TOKEN_SET,
  SESSION_CREATION_SET,
  SESSION_CURRENT_EXPIRATION_SET,
  SESSION_ID_TOKEN_SET,
  SESSION_MAX_EXPIRATION_SET,
  SESSION_REFRESH_TOKEN_SET,
  VEHICLES_RESET
} from '@/store/mutation-types'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import Footer from '@/components/Footer.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import Sidebar from '@/components/Sidebar.vue'

import ls from 'local-storage'
import utility from '@/lib/utility'
import operatorLib from '@/lib/operator'

import defaultRoutesConfig from '@/lib/defaultRoutesConfig'
import vehiclesRoutesConfig from '@/lib/vehiclesRoutesConfig'
import usersRoutesConfig from '@/lib/usersRoutesConfig'

const AmazonCognitoIdentity = require('amazon-cognito-identity-js')

const menu = []
const routesConfig = {
  ...vehiclesRoutesConfig,
  ...usersRoutesConfig,
  ...defaultRoutesConfig
}

const addMenuItems = function () {
  for (const item of Object.entries(routesConfig)) {
    const routeConfig = item[1]
    if (routeConfig.menu) {
      menu.push({
        abilities: routeConfig.requires.abilities,
        authenticated: routeConfig.requires.authentication,
        childOf: routeConfig.childOf ?? null,
        href: routeConfig.path ? routeConfig.path : '#',
        icon: routeConfig.icon,
        menuGroup: routeConfig.menuGroup,
        meta: routeConfig.meta,
        name: routeConfig.name,
        parent: routeConfig.parent ?? false,
        title: routeConfig.title
      })
    }
  }
}

addMenuItems()

export default {
  name: 'App',
  components: {
    Breadcrumbs,
    Footer,
    LoadingOverlay,
    Sidebar
  },
  data () {
    return {
      idleOverlayTimeout: 1000 * 60 * 2, // 2 minutes
      loginFailure: false,
      menuWidth: '300px',
      menu,
      menuItems: [],
      now: new Date(),
      messages: {
        msg: '',
        authMsg: ''
      },
      window: {
        width: 0,
        height: 0
      },
      defaultRouteName: 'fleets',
      timedOut: false,
      activeNavItem: null,
      activeNavSection: null,
      sidebar: false
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      models: VEHICLES_MODELS,
      operator: OPERATOR,
      operatorAbilities: OPERATOR_ABILITIES,
      operatorAdmin: ACCESS_SUPER_ADMIN,
      operatorCanAccessAuthorities: ACCESS_AUTHORITIES_ADMIN,
      operatorCanAccessFleetsGroups: ACCESS_FLEETS_GROUPS,
      operatorCanAccessUsers: ACCESS_USERS,
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      operatorCanAccessVehiclesWithAuthorities: ACCESS_VEHICLES_WITH_AUTHORITIES,
      operatorLoaded: OPERATOR_LOADED,
      operatorPreference: OPERATOR_PREFERENCE,
      operatorPreferenceDarkMode: OPERATOR_PREFERENCE_DARK_MODE,
      session: SESSION,
      userPool: COGNITO_USER_POOL
    }),
    menuFiltered () {
      // filter either authenticated or not depending on session validity
      let availableMenuItems = this.menuItems.filter(
        (menuItem) => menuItem.authenticated === this.sessionValid
      )
      // if session valid then filter again on operator abilities
      if (this.sessionValid) {
        availableMenuItems = availableMenuItems.filter((menuItem) => {
          return (
            operatorLib.hasAbilities(this.operatorAbilities, menuItem.abilities)
          )
        })
      }
      return availableMenuItems
    },
    isMobile () {
      return this.$isMobile()
    },
    userDisplayString () {
      const user = this.operator
      let displayString = null
      if (user.displayName) {
        displayString = user.displayName
      } else if (user.email) {
        displayString = user.email.split('@')[0]
      } else if (user.username) {
        (
          displayString = user.username
        )
      }
      return displayString
    },
    username: {
      get () {
        return this.operator.username
      },
      set (val) {
        this.$store.commit(OPERATOR_USERNAME_SET, val)
      }
    },
    idToken: {
      get () {
        return this.session.idToken
      },
      set (val) {
        this.$store.commit(SESSION_ID_TOKEN_SET, val)
      }
    },
    accessToken: {
      get () {
        return this.session.accessToken
      },
      set (val) {
        this.$store.commit(SESSION_ACCESS_TOKEN_SET, val)
      }
    },
    refreshToken: {
      get () {
        return this.session.refreshToken
      },
      set (val) {
        this.$store.commit(SESSION_REFRESH_TOKEN_SET, val)
      }
    },
    sessionCreation: {
      get () {
        return this.session.creation
      },
      set (val) {
        this.$store.commit(SESSION_CREATION_SET, val)
      }
    },
    sessionCurrentExpiration: {
      get () {
        return this.session.currentExpiration
      },
      set (val) {
        this.$store.commit(SESSION_CURRENT_EXPIRATION_SET, val)
      }
    },
    sessionMaxExpiration: {
      get () {
        return this.session.maxExpiration
      },
      set (val) {
        this.$store.commit(SESSION_MAX_EXPIRATION_SET, val)
      }
    },
    sessionValidityLength () {
      return this.session.validityLength
    },
    isSessionTokenApproachingInvalid () {
      return this.session.isTokenApproachingInvalid
    },
    isSessionTokenValid () {
      return this.session.isTokenValid
    },
    sessionValid () {
      return this.session.creation !== null
        ? this.isSessionTokenValid(
          this.now,
          this.session.currentExpiration,
          this.sessionValidityLength,
          this.session.maxExpiration
        )
        : false
    },
    sessionTokenApproachingInvalid () {
      return this.session.creation !== null
        ? this.isSessionTokenApproachingInvalid(
          this.now,
          this.session.currentExpiration,
          this.sessionValidityLength,
          this.session.maxExpiration
        )
        : false
    },
    currentRouteName () {
      return this.$route.name
    },
    cognitoUser: {
      get () { return this.$store.state.cognito.user },
      set (val) { this.$store.commit(COGNITO_USER_SET, val) }
    }
  },
  watch: {
    $route (to, from) {
      // check if user can access menu item, redirect if not
      const allowed = (operatorAbilities, requiredAbilities) => {
        return operatorLib.hasAbilities(operatorAbilities, requiredAbilities)
      }
      const requiredAbilitiesTo = to.meta.requires.abilities
      if (this.operatorLoaded && requiredAbilitiesTo.length) {
        const toRouteAllowed = allowed(this.operatorAbilities, requiredAbilitiesTo)
        if (!toRouteAllowed) {
          const requiredAbilitiesFrom = from.meta.requires.abilities
          if (requiredAbilitiesFrom.length) {
            const fromRouteAllowed = allowed(this.operatorAbilities, requiredAbilitiesFrom)
            if (!fromRouteAllowed) {
              this.redirect('fleets')
            } else {
              this.redirect(from.name)
            }
          } else {
            this.redirect(from.name)
          }
        }
      }

      const menuGroup = to.meta.menuGroup
      if (menuGroup !== 'all') {
        this.activeNavSection = menuGroup
      } else {
        this.activeNavSection = null
      }
    },
    sessionValid (newVal, oldVal) {
      if (newVal !== oldVal && newVal === false) {
        if (!(this.cognitoUser && !this.timedOut)) {
          if (this.username) {
            this.showToast({
              msg: 'Authentication token expired',
              icon: 'warning',
              duration: 6000,
              className: 'toasted-warning'
            })
          }
          // log operator out
          this.username = ''
        }
      }
    },
    sessionTokenApproachingInvalid (newVal, oldVal) {
      if (newVal !== oldVal && newVal === true) {
        if (this.cognitoUser && !this.timedOut) {
          this.updateLoading(true)
          this.showToast({
            msg: 'Refreshing authentication token',
            icon: 'check'
          })
          const refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({
            RefreshToken: this.refreshToken
          })
          this.cognitoUser.refreshSession(refreshToken, (err, session) => {
            if (err) {
              this.showToast({
                msg: 'Unable to refresh authentication token',
                icon: 'error',
                duration: null,
                className: 'toasted-error'
              })
            } else {
              const date = new Date()
              const payload = {
                idToken: session.getIdToken().getJwtToken(),
                accessToken: session.getAccessToken().getJwtToken(),
                refreshToken: this.refreshToken,
                sessionCreation: date.getTime(),
                sessionCurrentExpiration:
                  date.getTime() + this.sessionValidityLength,
                sessionMaxExpiration: date.getTime() + 1000 * 60 * 60 // 1 hour is AWS hard limit
              }
              this.sessionSet('all', payload)
              this.showToast({
                msg: 'Authentication token refreshed',
                icon: 'check'
              })
              this.updateLoading(false)
            }
          })
        }
      }
    },
    menuFiltered (newVal, oldVal) {
      this.menu = this.menuFiltered
    },
    username (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal && this.sessionValid) {
          this.handleUserGetRequest()
        } else if (!newVal || !this.sessionValid) {
          this.logout()
          if (!newVal && !this.loginFailure) {
            this.showToast({
              msg: 'User Logged Out',
              icon: 'check'
            })
          }
          this.loginFailure = false
        }
      }
    },
    loading (newVal, oldVal) {
      if (newVal !== oldVal) {
        utility.toggleLoading(this, newVal)
      }
    },
    operatorPreferenceDarkMode (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal) {
          this.$vuetify.theme.dark = true
        } else {
          this.$vuetify.theme.dark = false
        }
      }
    },
    operatorLoaded (newVal) {
      if (newVal) {
        this.getInitialData()
      }
    },
    activeNavSection (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (!oldVal) {
          this.getInitialData()
        } else {
          this.getSectionData()
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  created () {
    // update this.now every x seconds
    setInterval(() => {
      this.now = new Date()
      this.$forceUpdate()
    }, 1000 * 5)
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    ...mapActions({
      authoritiesSummonAction: AUTHORITIES_SUMMON,
      operatorSummonAction: OPERATOR_SUMMON,
      vehiclesSummonAction: VEHICLES_SUMMON,
      vehiclesModelsSummonAction: VEHICLES_MODELS_SUMMON
    }),
    init () {
      this.menuItems = this.menu
      const lsSession = ls.get(`${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.session`)
      if (lsSession) {
        const payload = {
          idToken: lsSession.idToken,
          accessToken: lsSession.accessToken,
          refreshToken: lsSession.refreshToken,
          sessionCreation: lsSession.creation,
          sessionCurrentExpiration: lsSession.currentExpiration,
          sessionMaxExpiration: lsSession.maxExpiration
        }
        this.sessionStateSet(payload)
      }
      // get and set username last to allow set session data
      // before automatic fetches happen based on username being set
      const lsUsername = ls.get(`${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.username`)
      if (lsUsername) {
        this.username = lsUsername
      }
      if (this.$route.meta.menuGroup !== 'all') {
        this.activeNavSection = this.$route.meta.menuGroup
      }
    },
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    },
    logout () {
      this.redirectToLogin()
      this.resetUserData()
      this.updateLoading(false, true)
    },
    redirect (routeName = this.defaultRouteName, params = {}) {
      this.$router
        .push({
          name: routeName,
          params
        })
        .catch((err) => {
          throw new Error(
            `Redirect to ${routeName} with params.authMsg ${params.authMsg} error: ${err}.`
          )
        })
    },
    redirectToLogin (msg) {
      if (this.$router.history.current.name === 'login') {
        this.showToast({ msg: msg, icon: 'check' })
        if (
          ['Session invalidated, user logged out successfully.'].includes(msg)
        ) {
          this.showToast({ msg: 'Logging out', icon: 'check' })
        }
      } else {
        this.redirect('login', { authMsg: msg })
      }
    },
    redirectAfterUserGet () {
      const { currentRouteName, defaultRouteName, operatorCanAccessUsers, operatorCanAccessVehicles } = this
      const lsRedirectUrlPropertyName = `${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.redirectUrl`
      const redirectUrl = ls.get(lsRedirectUrlPropertyName)
      const defaultPreference = this.operatorPreference('landing_page')
      ls.remove(lsRedirectUrlPropertyName)
      if (!redirectUrl) {
        if (defaultPreference && defaultPreference.value) {
          this.redirect(defaultPreference.value)
        } else if (defaultRouteName !== currentRouteName && this.operator.fleets.length) {
          this.redirect(defaultRouteName)
        } else if (operatorCanAccessVehicles && currentRouteName !== 'vehicles') {
          this.redirect('vehicles')
        } else if (operatorCanAccessUsers && currentRouteName !== 'users') {
          this.redirect('users')
        } else if (currentRouteName !== 'profile') {
          this.redirect('profile')
        }
      } else if (redirectUrl && redirectUrl !== currentRouteName) {
        this.redirect(redirectUrl)
      }
    },
    async handleUserGetRequest () {
      // this is attached to the change of the username and so we force fetch everytime
      const payload = {
        componentSelf: this,
        force: true
      }
      /* eslint-disable prefer-const */
      let response = await this.operatorSummonAction(payload)
        .catch(e => {
          this.showToast({
            msg: 'Login Failure',
            icon: 'error',
            duration: null,
            className: 'toasted-error'
          })
          this.loginFailure = true
          this.messages.authMsg = ''
          this.username = ''
        })
      if (response) {
        this.showToast({
          msg: 'Login Success',
          icon: 'check'
        })
        if (!this.cognitoUser) {
          this.cognitoUserInitialize()
        }
        if (this.currentRouteName === 'login') {
          this.redirectAfterUserGet()
        }
      }
    },
    cognitoUserInitialize () {
      if (this.userPool) {
        const cognitoUser = this.userPool.getCurrentUser()
        if (cognitoUser != null) {
          this.cognitoUser = cognitoUser
        } else {
          const userData = {
            Username: this.username,
            Pool: this.userPool
          }
          // initialize cognito user object with AWS user pool
          this.cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
        }
      }
    },
    resetUserData () {
      if (this.cognitoUser) {
        this.cognitoUser.signOut()
      }
      this.sessionReset('all')
      this.$store.commit(COGNITO_USER_RESET)
      this.$store.commit(OPERATOR_ABILITIES_RESET)
      this.$store.commit(OPERATOR_FLEETS_RESET)
      this.$store.commit(OPERATOR_PREFERENCES_RESET)
      this.$store.commit(OPERATOR_AVATAR_RESET)
      this.$store.commit(OPERATOR_DISPLAY_NAME_RESET)
      this.$store.commit(OPERATOR_PHONE_RESET)
      this.$store.commit(OPERATOR_EMAIL_RESET)
      this.$store.commit(VEHICLES_RESET)
      this.$store.commit(OPERATOR_USERNAME_RESET)
    },
    updateLoading (state, force = false) {
      if (state) {
        this.$store.commit(LOADING_START)
      } else {
        this.$store.commit(LOADING_END, { force })
      }
    },
    showToast (config) {
      utility.messageSet(this, config.msg, config.icon, config.duration, config.className)
    },
    sessionSet (type = 'all', session) {
      // possible types: all, ls (localStorage), state (vuex)
      if (['all', 'ls'].includes(type)) {
        this.sessionLSSet(session)
      }
      if (['all', 'state'].includes(type)) {
        this.sessionStateSet(session)
      }
    },
    sessionReset (type = 'all') {
      // possible types: all, ls (localStorage), state (vuex)
      if (['all', 'ls'].includes(type)) {
        this.sessionLSReset()
      }
      if (['all', 'state'].includes(type)) {
        this.sessionStateReset()
      }
    },
    sessionStateReset () {
      this.accessToken = ''
      this.idToken = ''
      this.refreshToken = ''
      this.sessionCreation = ''
      this.sessionCurrentExpiration = ''
      this.sessionMaxExpiration = ''
    },
    sessionStateSet (session) {
      this.idToken = session.idToken
      this.accessToken = session.accessToken
      this.refreshToken = session.refreshToken
      this.sessionCreation = session.sessionCreation
      this.sessionCurrentExpiration = session.sessionCurrentExpiration
      this.sessionMaxExpiration = session.sessionMaxExpiration
    },
    sessionLSReset () {
      ls.remove(`${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.redirectUrl`)
      ls.remove(`${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.session`)
      ls.remove(`${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.username`)
    },
    sessionLSSet (session) {
      ls.set(`${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.session`, {
        idToken: session.idToken,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        creation: session.sessionCreation,
        currentExpiration: session.sessionCurrentExpiration,
        maxExpiration: session.sessionMaxExpiration
      })
    },
    setTimedOut (val) {
      this.timedOut = val
    },
    updateSidebar (val) {
      this.sidebar = val
    },
    getInitialData () {
      if (this.activeNavSection === 'vehicles') {
        // always reset and force on this initial call
        const componentSelf = this
        const force = true
        this.$store.commit(VEHICLES_RESET)
        if (this.operatorCanAccessAuthorities) {
          this.authoritiesSummonAction({ componentSelf, force })
        }
        if (this.operatorCanAccessVehicles) {
          this.vehiclesModelsSummonAction({ componentSelf, force })
            .then(() => {
              this.vehiclesSummon(force)
            })
        } else if (this.operatorCanAccessUsers) {
          this.redirect('users')
        }
      }
    },
    getSectionData () {
      if (this.activeNavSection === 'vehicles') {
        const componentSelf = this
        const force = false
        if (this.operatorAbilities.length) {
          if (this.operatorCanAccessAuthorities) {
            this.authoritiesSummonAction({ componentSelf, force })
          }
          if (this.operatorCanAccessVehicles) {
            this.vehiclesModelsSummonAction({ componentSelf, force })
              .then(() => {
                this.vehiclesSummon(force)
              })
          }
        }
      }
    },
    vehiclesSummon (force) {
      const componentSelf = this
      const { operatorCanAccessVehicles, operatorCanAccessVehiclesWithAuthorities } = this
      let listType = 'fleets'
      if (operatorCanAccessVehiclesWithAuthorities) {
        listType = VEHICLES_WITH_AUTHORITIES_LIST
      } else if (operatorCanAccessVehicles) {
        listType = VEHICLES_LIST
      }
      this.vehiclesSummonAction({ componentSelf, listType, force })
    }
  },
  onActive () {
    this.$store.commit(SESSION_CURRENT_EXPIRATION_SET, new Date().getTime())
  }
}
</script>

<style lang="scss">
html {
  .theme--light,
  .theme--dark {
    -webkit-transition: background-color 1000ms linear;
    -ms-transition: background-color 1000ms linear;
    transition: background-color 1000ms linear;
  }
  .theme--light {
    &.v-card {
      background-color: #eee;
    }
  }
  .toasted-container {
    .toasted {
      top: calc(100% - 35px);
    }
  }
  .toasted-error {
    i {
      color: red;
    }
  }
  .toasted-warning {
    i {
      color: orange;
    }
  }
  .toasted-message {
    i {
      color: green;
    }
  }
  .toasted-info {
    i {
      color: dodgerblue;
    }
  }
}
#app {
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  #app-mobile-top-bar {
    &.v-app-bar {
      background-color: transparent;
    }
  }
  .v-main {
    padding-top: 0 !important;
  }
  .container {
    max-width: 100%;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    width: 100%;
  }
  .content-container {
    margin: 0 auto;
    padding: 20px;
  }
  h1 {
    color: var(--v-arcimoto-blue-base);
    font-family: "Bilbo", sans-serif;
    font-size: 3rem;
    line-height: 2.2rem;
    text-align: center;
    &.app-title {
      color: #fff;
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-size: 1.2rem;
      line-height: 2.2rem;
      margin-top: 1px;
    }
  }
  h2 {
    margin-bottom: 40px;
  }
  .modal {
    #modalTitle {
      h3 {
        color: var(--v-arcimoto-blue-base);
        font-size: 1.5rem;
      }
      h4 {
        color: #eee;
        font-size: 1em;
      }
    }
  }
  i {
    font-size: 18px;
    &.fa,
    &.fas {
      cursor: pointer;
      &.fa-plus-square {
        color: #28a745;
      }
      &.fa-minus-square {
        color: #dc3545;
      }
      &.fa-pen-square {
        color: #17a2b8;
      }
      &.fa-check-square {
        color: #28a745;
      }
      &.fa-sort,
      &.fa-sort-up,
      &.fa-sort-down {
        font-size: 14px;
        padding-left: 2px;
      }
      &.disabled {
        color: #333;
        cursor: default;
      }
    }
    &.token-copy {
      margin-right: 5px;
    }
  }
  #app-mobile-top-bar {
    z-index: 997;
    & + .container {
      padding-top: 36px;
    }
    .v-toolbar__content {
      padding: 0;
      display: flex;
      flex-direction: row-reverse;
      width: 100%;
      .burger-container {
        height: 36px;
        margin-right: 4px;
        .v-app-bar__nav-icon {
          color: #fff;
          i {
            font-size: 48px;
          }
        }
      }
      .nav-links {
        justify-self: center;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
        .nav-link {
          cursor: pointer;
          padding-top: 0;
          padding-bottom: 0;
          color: white;
          text-decoration: none;
        }
        .nav-link:hover {
          font-weight: bold;
        }
        .nav-link.active {
          font-weight: bold;
        }
      }
      .user-link-container {
        display: flex;
        justify-self: end;
        margin-right: 10px;
        .user-actions {
          white-space: nowrap;
          margin-right: 5px;
          a {
            color: #fff;
            padding-left: 10px;
          }
        }
      }
    }
  }
  .validation-msgs-container {
    display: block;
    min-height: 33px;
    margin-bottom: 6px;
    margin-top: 8px;
    text-align: center;
    width: 100%;
    div {
      background-color: #ffd2d2;
      border: 1px solid #d8000c;
      color: #d8000c;
      display: inline-block;
      margin: 2px 0;
      padding: 2px 12px 1px;
      text-align: center;
    }
  }
  h1 {
    margin: 20px 0 0;
  }
  h2 {
    margin-top: 15px;
  }
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    text-align: center;
    & + .container {
      text-align: center;
    }
  }
  h4 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    text-align: center;
  }
  form {
    overflow: auto;
    padding: 3px;
    input[vue-form-validator] {
      &.vf-untouched,
      &.vf-valid {
        & + .validation-msgs-container {
          color: #fff;
        }
      }
    }
    .btn-success {
      &:focus {
        box-shadow: 0 0 0 0.2rem rgba(72, 180, 97, 0.5);
      }
    }
    i.fa-search {
      cursor: pointer;
      &.disabled {
        color: rgba(44, 62, 80, 0.5);
        cursor: auto;
      }
    }
  }
  form,
  .msg + .container,
  .authMsg {
    margin: 0 auto;
    max-width: 406px;
  }
  .msg {
    margin-top: 80px;
    text-align: center;
    & + .container {
      margin-top: 40px;
      text-align: center;
    }
  }
  .authMsg {
    margin-top: 70px;
    text-align: center;
  }
  textarea {
    margin: 0 auto;
  }

  form label.required:after {
    color: red;
    content: " *";
  }
  .request-verb {
    font-weight: bold;
    text-transform: uppercase;
  }
  h2 {
    text-align: center;
  }
  .context-menu {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    z-index: 1001;
    .v-navigation-drawer__content {
      & > .v-list-item {
        &:first-of-type {
          padding-left: 0;
        }
      }
      .quick-actions-container {
        height: 100%;
        width: 100%;
        .v-list {
          margin-top: 25px;
        }
      }
    }
    .context-title {
      padding-right: 0;
    }
    .active-icon {
      color: #fff;
    }
    h2 {
      color: var(--v-arcimoto-blue-base);
      margin-bottom: 0;
    }
    a,
    div {
      text-decoration: none;
      font-weight: bold;
      .title {
        padding-left: 10px;
        cursor: pointer;
        font-size: 1rem;
      }
    }
    a.router-link-active {
      .title {
        color: #00a6ff;
      }
      i {
        color: #00a6ff;
      }
    }
    .menu-group,
    .child-link {
      i {
        color: #b8b7ad;
      }
      &:hover {
        i {
          color: #c94e50;
        }
      }
    }
    .child-link ::v-deep div {
      margin-right: 0;
      padding: 0;
    }
    &.v-navigation-drawer {
      top: 0;
      z-index: 1000;
    }
    .v-list-item {
      padding-left: 5px;
      padding-right: 5px;
      h3,
      .v-input {
        max-width: calc(100% - 30px);
      }
      .v-input--switch {
        padding-left: 10px;
      }
    }
  }
  .v-tooltip__content {
    background: rgba(0, 0, 0, 0.87);
    color: rgba(255, 255, 255, 1);
    .table, th, td {
        color: rgba(255, 255, 255, 1);
      }
  }
  &.theme--dark {
    .v-tooltip__content {
      background: rgba(255, 255, 255, 1);
      color: rgba(0, 0, 0, 0.87);
      table,
      .table,
      th,
      td {
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }
  .v-tabs--vertical {
    .v-tab {
      justify-content: flex-start;
    }
  }
  .v-tabs-items {
    padding-top: 20px;
    padding-right: 10px;
  }
}
.menuable__content__active {
  z-index: 1001 !important;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
</style>
