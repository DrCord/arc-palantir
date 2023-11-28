<template>
  <div class="default-landing-container">
        <v-select
          v-model="landingPage"
          :items="landingPageOptions"
          name="defaultLandingPage"
          dense
          outlined
          label="Default Landing Page"
          clearable
        ></v-select>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { USER_PREFERENCE_SAVE } from '@/store/action-types'
import operatorLib from '@/lib/operator'
import {
  ACCESS_FLEETS_GROUPS,
  ACCESS_USERS,
  ACCESS_VEHICLES,
  OPERATOR_ABILITIES,
  OPERATOR_LOADED,
  OPERATOR_PREFERENCE,
  OPERATOR_USERNAME
} from '@/store/getter-types'

export default {
  name: 'DefaultLanding',
  data () {
    return {
      landingPage: null
    }
  },
  computed: {
    ...mapGetters({
      operatorAbilities: OPERATOR_ABILITIES,
      operatorCanAccessFleetsGroups: ACCESS_FLEETS_GROUPS,
      operatorCanAccessUsers: ACCESS_USERS,
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      operatorLoaded: OPERATOR_LOADED,
      operatorPreference: OPERATOR_PREFERENCE,
      operatorUsername: OPERATOR_USERNAME
    }),
    defaultLandingPage () {
      return this.operatorPreference('landing_page')
    },
    landingPageOptions () {
      return this.formattedLandingPageOptions()
    }
  },
  watch: {
    landingPage: {
      handler () {
        this.setPreference()
      }
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
      this.landingPage = this.defaultLandingPage
    },
    filteredRoutes () {
      const abilities = this.operatorAbilities
      const routes = this.$router.options.routes
      const filtered = routes.filter(function (e) {
        const noColon = e.path.indexOf(':') === -1
        const noPassword = e.path.indexOf('password') === -1
        const notLogout = e.path.indexOf('logout') === -1
        const notErrorPronePage = (noColon && noPassword && notLogout)
        let userAllowedPage = false
        if ('meta' in e && 'requires' in e.meta) {
          userAllowedPage = operatorLib.hasAbilities(abilities, e.meta.requires.abilities) &&
          e.meta.requires.authentication
        }
        return notErrorPronePage && userAllowedPage
      })
      return filtered
    },
    mappedLandingPageOptions () {
      const foptions = this.filteredRoutes().map((obj) => {
        return {
          value: obj.name,
          text: obj.title,
          menugroup: obj.meta.menuGroup
        }
      })
      return foptions.sort((a, b) => {
        return b.menugroup.localeCompare(a.menugroup) ||
        a.text.localeCompare(b.text)
      })
    },
    formattedLandingPageOptions () {
      const headers = this.getMenuGroups()
      const options = this.mappedLandingPageOptions()
      headers.forEach(header => {
        options.splice(options.findIndex(option => { return option.menugroup === header }),
          0,
          { header: header.charAt(0).toUpperCase() + header.slice(1) }
        )
      })
      return options
    },
    getMenuGroups () {
      const rawOptions = this.mappedLandingPageOptions()
      return [...new Set(rawOptions.map((element) => {
        return element.menugroup
      }))]
    },
    async setPreference () {
      if (this.landingPage === this.defaultLandingPage) {
        return
      }
      const componentSelf = this
      const payload = {
        username: this.operatorUsername,
        body: {
          preference_identifier: 'landing_page',
          preference_value: this.landingPage ? this.landingPage : ''
        }
      }
      await this.userPreferenceSaveAction({ componentSelf, payload })
    }
  }
}
</script>

<style lang="scss">
.default-landing-container {
  margin-top: .5rem;
  margin-bottom: 0rem;
}
</style>
