
<template>
  <div class="v-bread-crumbs-container">
    <div v-if="breadCrumbs.length" class="v-breadcrumbs-prepend">
      <div v-if="!parentLink">
          <span class="left" :class="{leftInactive: inactive}">
            <v-icon v-if="inactive" color="primary" class="fuv">$fuv</v-icon>
          </span>
      </div>
      <div v-else>
        <a :href="parentLink">
          <span class="left" :class="{leftInactive: inactive}"></span>
        </a>
      </div>
    </div>
    <v-breadcrumbs :items="breadCrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :to="item.to"
          class="text-subtitle-2 crumb-item"
          :disabled="item.disabled"
          exact
        >
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ACCESS_VEHICLES } from '@/store/getter-types'

export default {
  name: 'BreadCrumbs',
  data () {
    return {
      inactive: true,
      parentLink: null
    }
  },
  computed: {
    ...mapGetters({
      operatorCanAccessVehicles: ACCESS_VEHICLES
    }),
    breadCrumbs () {
      let breadCrumbs = null
      if (this.$route.name === 'login') {
        return []
      } else if (typeof this.$route.meta.breadCrumb === 'function') {
        breadCrumbs = this.$route.meta.breadCrumb.call(this, this.$route)
      } else {
        breadCrumbs = this.$route.meta.breadCrumb
      }
      if (breadCrumbs.length === 0) {
        const capped = this.$route.name[0].toUpperCase() + this.$route.name.slice(1)
        const myCrumbs = [{
          text: capped,
          to: { name: this.$route.name }
        }]
        breadCrumbs = myCrumbs
      }
      // remove link for vehicles item if user does not have access to read vehicles
      if (breadCrumbs.length && !this.operatorCanAccessVehicles) {
        const vehiclesItemIndex = breadCrumbs.findIndex(breadCrumb => {
          return breadCrumb.text === 'Vehicles'
        })
        if (vehiclesItemIndex !== -1 && breadCrumbs[vehiclesItemIndex]) {
          delete breadCrumbs[vehiclesItemIndex].to
        }
      }
      return breadCrumbs
    }
  },
  watch: {
    breadCrumbs: {
      handler (newVal, oldVal) {
        this.parentLinkSet()
        if (!newVal || newVal.length < 2) {
          this.borderDeactivate()
        } else {
          this.borderActivate()
        }
      }
    }
  },
  methods: {
    borderDeactivate () {
      this.inactive = true
    },
    borderActivate () {
      this.inactive = false
    },
    parentLinkSet () {
      const { breadCrumbs } = this
      var link = '#/'
      if (breadCrumbs == null || breadCrumbs.length < 2) {
        this.parentLink = null
        return this.parentLink
      }
      const linkIndex = breadCrumbs.findIndex(index => {
        return index.to !== undefined
      })
      if (linkIndex !== -1 && breadCrumbs[linkIndex]) {
        this.parentLink = link + breadCrumbs[linkIndex].to.name
      }
      return this.parentLink
    }
  }
}
</script>

<style lang="scss">
#app {
  .v-bread-crumbs-container{
    position: absolute;
    top: 35px;
    margin-left: 2.65rem;
    z-index: 999;
    .v-breadcrumbs {
      color: #fff;
      padding: 3px;
      float: left;
      a {
        color: #fff;
      }
      .v-breadcrumbs__divider {
        color: #fff;
        margin: 0;
        padding: 0 3px;
        font-size: smaller;
        font-weight:normal;
      }
      .v-breadcrumbs__item{
        font-size: smaller;
        font-weight:normal;
      }
    }
    .v-breadcrumbs-prepend {
      float: left;
      color: #fff;
      top: 25px;
      left: 72px;
      padding: 0;
      vertical-align: middle;
      text-align: center;
      div {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        a {
          display: inline-block;
          border-radius: 50%;
          border-color:#ebebeb;
          &:hover {
            .left {
              border: 0.2em solid white;
              &:after {
                border-top: 0.2em solid white;
                border-right: 0.2em solid white;
              }
            }
          }
        }
        .left {
          display: inline-block;
          width: 2em;
          height: 2em;
          border: 0.2em solid gray;
          border-radius: 50%;
          position: relative;
          &.leftInactive {
            .fuv {
              left: -0.2px;
              top: -0.5px;
            }
            &:after {
              display: none;
            }
          }
          &:after {
            content: '';
            display: inline-block;
            margin-left: .2em;
            width: .5em;
            height: .5em;
            border-top: 0.2em solid white;
            border-right: 0.2em solid white;
            -moz-transform: rotate(-135deg);
            -webkit-transform: rotate(-135deg);
            transform: rotate(-135deg);
          }
        }
      }
    }
  }
}
</style>
