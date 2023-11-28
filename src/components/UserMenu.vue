<template>
  <div class="user-menu-container">
    <div class="user-container">
      <div
        class="user-items"
        :class="[$route.path === '/profile' ? 'is-active-route' : null]"
        @click="$route.path !== '/profile' ? navigateTo('/profile') : null"
      >
        <h4>{{ operatorDisplayName }}</h4>
        <user-icon :username="operatorUsername" />
      </div>
    </div>
    <v-menu
      top
      class="user-menu"
      :close-on-content-click="closeOnContentClick"
      :offset-y="true"
      rounded=0
    >
      <template v-slot:activator="{ on, attrs }">
        <div
          class="user-menu-activator"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </div>
      </template>
      <v-list>
        <token-copy />
        <v-list-item
          :class="[$route.path === '/logout' ? 'is-active-route' : null]"
          @click="$route.path !== '/logout' ? navigateTo('/logout') : null"
        >
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  OPERATOR_DISPLAY_NAME,
  OPERATOR_USERNAME
} from '@/store/getter-types'

import UserIcon from '@/components/Users/UserIcon.vue'
import TokenCopy from '@/components/TokenCopy.vue'

export default {
  name: 'UserMenu',
  components: {
    UserIcon,
    TokenCopy
  },
  data: () => ({
    closeOnContentClick: true
  }),
  computed: {
    ...mapGetters({
      operatorDisplayName: OPERATOR_DISPLAY_NAME,
      operatorUsername: OPERATOR_USERNAME
    })
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    }
  }
}
</script>

<style lang="scss">
#app {
  .user-menu-container {
    border-top: 1px solid currentColor;
    position: fixed;
    bottom: 0;
    width: calc(100% - 40px);
    display: flex;
    margin: 0 20px;
    padding: 10px 0;
    justify-content: space-between;
    .user-container {
      padding-left: 10px;
      padding-right: 5px;
      width: 100%;
      .user-items {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        &.is-active-route {
          cursor: default;
        }
      }
      h4 {
        position: relative;
        top: 6px;
      }
    }
    .user-menu-activator {
      position: relative;
      top: 5px;
    }
    .v-menu__content {
      .v-list {
        padding: 0;
        .v-list-item {
          &.is-active-route {
            cursor: default;
          }
          .v-list-item__title {
            font-weight: bold;
            font-size: 0.8rem;
            text-transform: uppercase;
          }
        }
      }
      .operator-display-name {
        min-height: 40px;
      }
      .divider-container {
        min-height: 4px;
        hr {
          margin: 0;
        }
      }
    }
  }
}
</style>
