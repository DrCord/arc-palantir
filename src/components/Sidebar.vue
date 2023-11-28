<template>
  <v-navigation-drawer
    v-model="active"
    app
    :permanent="!isMobile && sessionValid && active"
    width="320px"
    class="sidebar"
    @input="$emit('sidebar', $event)"
  >
    <v-list-item>
      <v-list-item-content class="sidebar-title">
        <v-icon
          v-if="isMobile"
          class="menu-close"
          small
          @click="active = false"
        >mdi-close</v-icon>
        <v-img
          class="logo"
          :src="logoUrl"
          alt="Arcimoto"
          contain
        />
        <h1 id="app-title" class="app-title">
          <v-tooltip bottom open-delay="1250">
            <template #activator="{ on }">
                <a href="https://en.wikipedia.org/wiki/Palant%C3%ADr" target="_blank" v-on="on" >Palantir</a>
            </template>
            <span>Palantíri are stones used for communication in the Tolkien world</span>
          </v-tooltip>
          <span class="package-version">{{ packageVersion }}</span>
        </h1>
        <h2 v-if="environment !== 'prod'" class="environment">{{ environment.toUpperCase() }}</h2>
      </v-list-item-content>
    </v-list-item>
    <menu-section
      v-if="active && operatorLoaded"
      :active-nav-section="!menuItemsUsers.length || activeNavSection === null ? 'vehicles' : activeNavSection"
      :menu-items="menuItemsVehicles"
      :sidebar-active="active"
      type="vehicles"
    />
    <menu-section
      v-if="operatorCanAccessUsers && active && operatorLoaded"
      :active-nav-section="activeNavSection"
      :menu-items="menuItemsUsers"
      :sidebar-active="active"
      type="users"
    />
    <user-menu v-if="operatorLoaded" />
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_USERS,
  ENVIRONMENT,
  OPERATOR_LOADED,
  PACKAGE_VERSION,
  S3_BASE_URL
} from '@/store/getter-types'

import MenuSection from '@/components/MenuSection.vue'
import UserMenu from '@/components/UserMenu.vue'

export default {
  name: 'Sidebar',
  components: {
    MenuSection,
    UserMenu
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    activeNavSection: {
      type: String,
      default: null
    },
    menuItems: {
      default: () => [],
      type: Array
    },
    sessionValid: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    active: true
  }),
  computed: {
    ...mapGetters({
      environment: ENVIRONMENT,
      operatorCanAccessUsers: ACCESS_USERS,
      operatorLoaded: OPERATOR_LOADED,
      packageVersion: PACKAGE_VERSION,
      s3BaseUrl: S3_BASE_URL
    }),
    logoUrl () {
      return `${this.s3BaseUrl}/images/arcimotoLogo.png`
    },
    isMobile () {
      return this.$isMobile()
    },
    menuItemTypes () {
      const mergeDedupe = (arr) => {
        return [...new Set([].concat(...arr))]
      }
      return mergeDedupe(this.menuItems.map(item => item.menuGroup)).sort()
    },
    menuItemsUsers () {
      return this.menuItems
        .filter(item => item.menuGroup === 'users')
        .sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
    },
    menuItemsVehicles () {
      return this.menuItems
        .filter(item => item.menuGroup === 'vehicles')
        .sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
    }
  },
  watch: {
    isMobile: {
      handler (newVal) {
        if (newVal) {
          this.$emit('sidebar', false)
        } else {
          this.setActive(this.$route.name)
        }
      },
      immediate: true
    },
    open (newVal) {
      this.active = newVal
    },
    operatorLoaded: {
      handler (newVal) {
        if (newVal) {
          this.setActive(this.$route.name)
        }
      },
      immediate: true
    },
    $route (to) {
      this.setActive(to.name)
    },
    sessionValid: {
      handler (newVal) {
        if (!newVal) {
          this.active = false
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.setActive(this.$route.name)
    },
    setActive (routeName) {
      if (!['login', 'logout', 'request-account'].includes(routeName)) {
        this.$emit('sidebar', !this.$isMobile())
      } else {
        if (['login'].includes(routeName) && this.sessionValid) {
          this.$emit('sidebar', !this.$isMobile())
        } else {
          this.$emit('sidebar', false)
        }
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  .sidebar {
    z-index: 1000;
    margin-bottom: 100px;
    padding-bottom: 60px;
    .v-navigation-drawer__content {
      position: relative;
      .menu-close {
        position: absolute;
        right: 15px;
        top: 10px;
      }
    }
    .sidebar-title {
      padding-left: 30px;
      padding-right: 30px;
      h1 {
        &.app-title {
          font-family: "Roboto", Helvetica, Arial, sans-serif;
          font-size: 1.1rem;
          line-height: 1.4rem;
          margin-top: 3px;
          .package-version {
            padding-left: 5px;
          }
          a, a.hover {
            text-decoration: none;
            color: #3f3f41;
          }
        }
      }
      h2 {
        font-family: "Roboto", Helvetica, Arial, sans-serif;
        font-size: 1.0rem;
        line-height: 1.2rem;
        margin-bottom: 0px;
        margin-top: 3px;
      }
      .title-info-link {
        vertical-align: super;
        text-decoration: none;
      }
    }
  }
  &.theme--light {
    .sidebar-title {
      h1 {
        &.app-title {
          color: #3f3f41;
        }
      }
      h2 {
        color: #3f3f41;
      }
    }
  }
  &.theme--dark {
    .sidebar {
      .sidebar-title {
        h1 {
          &.app-title, a {
            color: #fff;
          }
        }
        h2 {
          color: #fff;
        }
      }
    }
  }
}

</style>
