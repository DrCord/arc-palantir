<template>
  <div id="vehicles-container">
    <div id="vehicles">
      <v-data-table
        :footer-props="dataTableDefaultFooterProps"
        :headers="tableHeaders"
        :items="vehicleData"
        :items-per-page="defaultTableRows"
        :sort-by="['vin']"
        item-key="vin"
        @update:items-per-page="capturePagination"
      >
        <template v-slot:top>
          <v-expansion-panels
            class="filter"
            :value="0"
            flat
            focusable
          >
            <v-expansion-panel>
              <v-expansion-panel-header class="header">
                <h3>Search/Filter</h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="filters">
                <v-container fluid class="filter">
                  <v-row class="filter-fields">
                    <v-col cols="12" :xl="columnCount + 1" lg="6" md="6" sm="12">
                      <v-row class="pa-3">
                        <v-text-field
                          v-model="vinFilterValue"
                          append-icon="search"
                          clearable
                          dense
                          hide-details
                          outlined
                          placeholder="Filter by text match"
                          aria-label="Filter by text match"
                          class="text-filter vin-filter"
                        />
                      </v-row>
                    </v-col>
                    <v-col cols="12" :xl="columnCount" lg="6" md="6" sm="12">
                      <v-row class="pa-3">
                        <v-select
                          v-model="modelFilterValue"
                          :items="vehicleModelNames"
                          label="Model"
                          clearable
                          dense
                          multiple
                          small-chips
                          hide-details
                          outlined
                          class="model-names"
                        />
                      </v-row>
                    </v-col>
                    <v-col cols="12" :xl="columnCount - 1" lg="6" md="6" sm="12">
                      <v-row class="pa-3">
                        <v-select
                          v-model="yearFilterValue"
                          :items="vehiclesYears"
                          label="Year"
                          clearable
                          dense
                          multiple
                          small-chips
                          hide-details
                          outlined
                          class="vehicles-years"
                        />
                      </v-row>
                    </v-col>
                    <v-col
                      v-if="operatorCanAccessAuthorities"
                       cols="12"
                       :xl="columnCount"
                       lg="6"
                       md="6"
                       sm="12"
                    >
                      <v-row class="pa-3">
                        <v-select
                          v-model="authoritiesFilterValue"
                          :items="authorityNames"
                          append-icon="search"
                          label="Authority"
                          clearable
                          dense
                          hide-details
                          outlined
                          multiple
                          small-chips
                          placeholder="Filter by authority"
                          aria-label="Filter by authority"
                          class="text-filter authority-filter"
                        />
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>

        <template #[`item.vin`]="{ item }">
          <router-link :to="vehicleLinkObject(item.vin)">{{
            item.vin
          }}</router-link>
        </template>

        <template #[`item.authorities`]="{ item }">
          <ul>
            <li v-for="authority in item.authorities" :key="authority.id">
              <router-link :to="authorityLinkObject(authority.id)">
                {{ authorityIdToNameMap[authority.id] }}
              </router-link>
            </li>
          </ul>
        </template>
      </v-data-table>
    </div>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <context-bar
      :content-type="contextBarContentType"
      :visible="contextBarVisible"
      @change-context="changeContext"
      @close-context="closeContextBar"
      @context-bar-visible="toggleContextBar($event)"
      @create-cancel="createCancel"
      @create-complete="createComplete"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_AUTHORITIES,
  ACCESS_VEHICLE_PROVISION,
  AUTHORITIES,
  VEHICLES,
  VEHICLES_MODELS
} from '@/store/getter-types'
import {
  LOADING_END,
  LOADING_START
} from '@/store/mutation-types'
import ContextBarToggle from '@/components/ContextBarToggle.vue'
import ContextBar from '@/components/Vehicles/VehiclesContextBar/ContextBar.vue'

import utility from '@/lib/utility'
import TableRowsDefault from '@/mixins/TableRowsDefault.js'

export default {
  name: 'VehiclesList',
  components: {
    ContextBarToggle,
    ContextBar
  },
  mixins: [TableRowsDefault],
  props: {
    quickLinkAction: {
      default: null,
      type: Object
    }
  },
  data () {
    return {
      contextBarContentType: null,
      contextBarVisible: false,
      yearFilterValue: '',
      authoritiesFilterValue: '',
      modelFilterValue: '',
      vinFilterValue: '',
      currentYear: new Date().getFullYear(),
      startYear: 2019
    }
  },
  computed: {
    ...mapGetters({
      authorities: AUTHORITIES,
      operatorCanAccessAuthorities: ACCESS_AUTHORITIES,
      operatorCanProvisionVehicle: ACCESS_VEHICLE_PROVISION,
      vehicles: VEHICLES,
      vehiclesModels: VEHICLES_MODELS
    }),
    columnCount () {
      return this.operatorCanAccessAuthorities ? 3 : 4
    },
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanProvisionVehicle
    },
    tableHeaders () {
      const headers = [
        {
          text: 'VIN',
          value: 'vin',
          sortable: true,
          filter: this.filterVin
        },
        {
          text: 'Model',
          value: 'model',
          sortable: true,
          filter: this.filterModel
        },
        {
          text: 'Year',
          value: 'year',
          sortable: true,
          filter: this.filterYear
        }
      ]
      if (this.operatorCanAccessAuthorities) {
        headers.push({
          text: 'Authorities',
          value: 'authorities',
          sortable: true,
          filter: this.filterAuthorities
        })
      }
      return headers
    },
    vehicleModelNames () {
      const modelNames = []
      if (typeof this.vehiclesModels !== 'undefined') {
        this.vehiclesModels.forEach(model => {
          modelNames.push(model.modelName)
        })
      }
      return modelNames.sort()
    },
    authorityNames () {
      const names = []
      this.authorities.forEach(authority => {
        if (authority.id !== this.arcimotoAuthorityId) {
          names.push(authority.description)
        }
      })
      return names
    },
    vehiclesYears () {
      // Sequence generator function (commonly referred to as "range", e.g. Clojure, PHP etc)
      const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))

      const years = range(this.startYear, this.currentYear, 1)
      return years
    },
    authorityIdToNameMap () {
      const map = {}
      this.authorities.forEach(authority => { map[authority.id] = authority.description })
      return map
    },
    arcimotoAuthority () {
      if (!this.authorities.length) {
        return {
          description: 'Arcimoto',
          id: 1
        }
      }
      return this.authorities.filter(authority => authority.parentId === 0)[0]
    },
    arcimotoAuthorityId () {
      return this.arcimotoAuthority.id
    },
    vehicleData () {
      this.$store.commit(LOADING_START)
      const vehicles = [...this.vehicles]
      for (let i = 0; i < vehicles.length; i++) {
        if (vehicles[i].authorities && this.operatorCanAccessAuthorities) {
          for (let k = 0; k < vehicles[i].authorities.length; k++) {
            if (vehicles[i].authorities[k].id === this.arcimotoAuthorityId) {
              vehicles[i].authorities.splice(k, 1)
            }
          }
        }
      }
      this.$store.commit(LOADING_END)
      return vehicles
    }
  },
  watch: {
    quickLinkAction: {
      handler: function (newVal) {
        this.changeContext({ contentType: newVal.quick })
      }
    }
  },
  methods: {
    vehicleLinkObject (vin) {
      return {
        name: 'vehicle',
        params: { vin }
      }
    },
    authorityLinkObject (id) {
      return {
        name: 'authority',
        params: { id }
      }
    },
    filterYear (value) {
      if (!this.yearFilterValue || this.yearFilterValue.length === 0) {
        return true
      }
      // Check if the current loop value equals to the selected value at the <v-select>.
      return this.yearFilterValue.includes(value)
    },
    filterModel (value) {
      if (!this.modelFilterValue || this.modelFilterValue.length === 0) {
        return true
      }
      // Check if the current loop value equals to the selected value at the <v-select>.
      return this.modelFilterValue.includes(value)
    },
    filterVin (value) {
      if (!this.vinFilterValue) {
        return true
      }
      // Check if the current loop value partially contains the searched word.
      return value.toLowerCase().includes(this.vinFilterValue.toLowerCase())
    },
    filterAuthorities (value) {
      if (!this.authoritiesFilterValue || this.authoritiesFilterValue.length === 0) {
        return true
      }
      let matches = null
      const authorityIds = value.map(v => v.id)

      authorityIds.forEach(authorityId => {
        const authority = this.authorities.find(el => {
          return el.id === authorityId
        })
        if (this.authoritiesFilterValue.includes(authority.description)) {
          matches = true
        }
      })
      return matches
    },
    cancel () {
      this.toggleContextBar(true, null)
    },
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
    },
    closeContextBar () {
      this.toggleContextBar(false)
    },
    createCancel () {
      this.cancel()
    },
    createComplete () {
      this.closeContextBar()
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    }
  }
}
</script>

<style scoped lang='scss'>
#app {
  .v-expansion-panel-header {
    min-height: 34px;
    padding-bottom: 0;
    padding-top: 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin-bottom: 0;
    li {
      margin-left: 0;
      margin-right: 3px;
      &:after {
        content: ",";
      }
      &:last-of-type:after {
        content: "";
      }
    }
  }
  .filter {
    padding-bottom: 0;
    padding-top: 0;
    .header {
      color: #fff;
      h3 {
        color: #333;
        font-size: 1.2rem;
        margin-bottom: 0;
        margin-right: 10px;
        text-align: right;
      }
      .toggle-view {
        text-align: right;
      }
    }
    .filters {
      .filter-fields {
        margin-top: 0;
        .col {
          min-width: 100%;
          padding: 0;
        }
      }
    }
  }
  &.theme--dark {
    .filter {
      .header {
        color: rgb(30, 30, 30);
        h3 {
          color: #fff;
        }
      }
    }
  }
}
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
#app {
  .filter {
    .filters {
      .filter-fields {
        .col-12 {
          &:nth-of-type(2n + 1) {
            padding-left: 0px;
          }
          &:last-of-type {
            padding-right: 10px;
          }
        }
      }
    }
  }
}
}
/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
#app {
  .filter {
    .filters {
      .filter-fields {
        .col-12 {
          &:first-of-type {
            padding-left: 0;
          }
          &:last-of-type {
            padding-right: 0;
          }
        }
      }
    }
  }
}
}
</style>
