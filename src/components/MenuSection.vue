<template>
  <v-list
    class="menu-section"
    nav
  >
    <v-list-group :value="true">
      <template v-slot:activator>
        <v-list-item-title class="menu-section-title">
          <span class="title">{{ type | capitalize }}</span>
        </v-list-item-title>
      </template>
      <template v-for="(menuItem, key) in menuItems">
        <template v-if="menuItem.parent">
          <v-list-group
            :key="`${key}-parent-menu`"
            v-model="subMenusActive[key]"
            :group="menuItem.title"
            sub-group
            prepend-icon=""
          >
            <template v-slot:activator>
              <v-list-item-title class="menu-group">
                <v-list-item-icon>
                  <font-awesome-icon :icon="menuItem.icon" />
                </v-list-item-icon>
                <span class="title">{{ menuItem.title }}</span>
              </v-list-item-title>
            </template>
            <template #appendIcon>
              <v-icon class="active-icon">mdi-chevron-down</v-icon>
            </template>
            <v-list-item
              v-for="child in findChildren(menuItem.title)"
              :key="child.title"
              class="child-link"
              :class="[
                $route.path === child.href ? 'is-active-route' : null,
                typeof child.classes !== 'undefined' ? child.classes.join(' ') : ''
              ]"
              link
              @click="$route.path !== child.href ? navigateTo(child.href) : null"
            >
              <v-list-item-title>
                <v-list-item-icon>
                  <font-awesome-icon :icon="child.icon" />
                </v-list-item-icon>
                <span class="title">{{ child.title }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-else-if="!menuItem.childOf">
          <v-list-item
            :key="`${key}-link`"
            class="not-child"
            :class="[
              $route.path === menuItem.href ? 'is-active-route' : null,
              typeof menuItem.classes !== 'undefined' ? menuItem.classes.join(' ') : ''
            ]"
            @click="$route.path !== menuItem.href ? navigateTo(menuItem.href) : null"
          >
            <v-list-item-title>
              <v-list-item-icon>
                <font-awesome-icon :icon="menuItem.icon" />
              </v-list-item-icon>
              <span class="title">{{ menuItem.title }}</span>
            </v-list-item-title>
          </v-list-item>
        </template>
      </template>
    </v-list-group>
  </v-list>
</template>

<script>
export default {
  name: 'MenuSection',
  props: {
    activeNavSection: {
      default: null,
      type: String
    },
    menuItems: {
      default: () => [],
      type: Array
    },
    sidebarActive: {
      default: null,
      type: Boolean
    },
    type: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      open: true,
      subMenusActive: []
    }
  },
  computed: {
    active: {
      get () { return this.sidebarActive },
      set (val) { this.$emit(`menu-section-${this.type}-active`, val) }
    }
  },
  watch: {
    active: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.subMenusActive = []
          const matchingChildRoutes = this.menuItems.filter(item => {
            return item.name === this.$route.name && item.childOf
          })
          if (matchingChildRoutes.length) {
            const matchingChildRoute = matchingChildRoutes[0]
            const matchingChildParentName = matchingChildRoute.childOf
            const matchingParentRouteIndex = this.menuItems.findIndex(item => {
              return item.name.toLowerCase() === matchingChildParentName.toLowerCase()
            })
            if (matchingParentRouteIndex !== -1) {
              let count = 0
              this.menuItems.forEach(item => {
                if (count === matchingParentRouteIndex) {
                  this.subMenusActive.push(true)
                } else {
                  this.subMenusActive.push(false)
                }
                count++
              })
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    findChildren (menuTitle) {
      return this.menuItems.filter((item) => {
        return item.childOf === menuTitle
      })
    },
    navigateTo (route) {
      this.$router.push(route)
    }
  }
}
</script>

<style lang="scss">
#app {
  .menu-section {
    .child-link ::v-deep div {
      margin-right: 0;
      padding: 0;
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
    .is-active-route {
      .title,
      i.v-icon {
        color: #00a6ff;
      }
    }
    .v-list-group__items {
      padding-right: 0;
      .v-list-item {
        padding-left: 0;
      }
    }
    .v-list-group--sub-group {
      .child-link {
        &.v-list-item {
          padding-left: 0;
        }
      }
    }
    .v-list-item {
      margin-bottom: 0;
      .menu-section-title {
        .title {
          padding-left: 0;
        }
      }
      .v-icon {
        font-size: 1.3rem;
      }
      &:hover {
        i {
          color: #c94e50;
        }
      }
      &.theme--dark {
        &:hover {
          &::before {
            opacity: 0.08;
          }
        }
      }
      &.theme--light {
        &:hover {
          &::before {
            opacity: 0.12;
          }
          i {
            background-color: transparent;
          }
        }
      }
      &.not-child {
        &:before {
          bottom: 0;
          content: "";
          left: 0;
          opacity: 0;
          pointer-events: none;
          position: absolute;
          right: 0;
          top: 0;
          -webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
          transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
        }
        .title {
          margin-left: -16px;
        }
      }
    }
  }
  &.theme--light {
    .menu-section {
      .active-icon {
          color: #3f3f41;
      }
      a,
      div {
        color: #3f3f41 !important;
        .title {
          color: #3f3f41;
        }
      }
      .is-active-route {
        .title,
        i.v-icon {
          color: #00a6ff;
        }
      }
      .v-list-item {
        .v-icon {
          color: #3f3f41;
        }
        &.not-child {
          &:before {
            background-color: currentColor;
          }
        }
      }
    }
  }
  &.theme--dark {
    .menu-section {
      .active-icon {
          color: #fff;
      }
      a,
      div {
        color: #fff !important;
        .title {
          color: #fff;
        }
      }
      .is-active-route {
        .title,
        i.v-icon {
          color: #00a6ff;
        }
      }
      .v-list-item {
        .v-icon {
          color: #fff;
        }
        &.not-child {
          &:before {
            background-color: currentColor;
          }
        }
      }
    }
  }
}
</style>
