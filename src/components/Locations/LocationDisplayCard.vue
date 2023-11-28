<template>
  <v-card
    v-if="locationName"
    class="mx-auto location-card location-display-card"
    width="500px"
  >
    <v-card-title>
    {{ locationName }} {{formattedLocationCode}}<v-spacer /><span class="location-id">{{ locationId }}</span>
    </v-card-title>
    <v-card-text>
      <address>
        <span v-if="streetNumber">
        {{ streetNumber }}{{ streetNumberSuffix }} {{ streetDirection }} {{ streetName }} {{ streetType }}<br>
        </span>
        <span v-if="structureName">{{ structureName }}<br></span>
        <span v-if="addressType">{{ addressType }} {{ addressTypeIdentifier }}<br></span>
        <span v-if="localMunicipality || city || governingDistrict || postalArea">
        {{ localMunicipality }} {{ city }} {{ governingDistrict }} {{ postalArea }}<br>
        </span>
        <span v-if="countryCode">
        {{ countryName }} ({{ countryCode }})<br>
        </span>
        <div v-if="gpsLatitude && gpsLongitude" class="address-group">
        <span class="gps-latitude">
            <h4>GPS Position</h4>
            <span class="key">Latitude</span>
            <span class="value">{{ gpsLatitude }}</span>
        </span>
        <span class="gps-longitude">
            <span class="key">Longitude</span>
            <span class="value">{{ gpsLongitude }}</span>
        </span>
        </div>
      </address>
      <div v-if="operatorIsLocationsAdmin && createdBy" class="creator">
        <span>Creator: <router-link
          :to="userLinkObject(createdBy)"
        >{{ userGet(createdBy) ? userGet(createdBy).displayName : createdBy }}</router-link></span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  LOCATIONS_COUNTRIES_SUMMON,
  USERS_SUMMON
} from '@/store/action-types'
import {
  ACCESS_LOCATIONS_ADMIN,
  ACCESS_USERS,
  LOCATION,
  LOCATIONS_COUNTRIES,
  OPERATOR_LOADED,
  USER
} from '@/store/getter-types'

export default {
  name: 'LocationDisplayCard',
  props: {
    locationId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      operatorCanAccessUsers: ACCESS_USERS,
      operatorIsLocationsAdmin: ACCESS_LOCATIONS_ADMIN,
      locationGet: LOCATION,
      locationsCountries: LOCATIONS_COUNTRIES,
      operatorLoaded: OPERATOR_LOADED,
      userGet: USER
    }),
    addressType () {
      return this.locationId && this.location.addressType ? this.location.addressType : null
    },
    addressTypeIdentifier () {
      return this.locationId && this.location.addressTypeIdentifier ? this.location.addressTypeIdentifier : null
    },
    city () {
      return this.locationId && this.location.city ? this.location.city : null
    },
    countryCode () {
      return this.locationId && this.location.country ? this.location.country : null
    },
    countryName () {
      if (this.countryCode) {
        const item = this.locationsCountries.find(e => e.countryCode === this.countryCode)
        return item && item.countryName ? item.countryName : null
      }
      return null
    },
    createdBy () {
      return this.locationId && this.location.createdBy ? this.location.createdBy : null
    },
    gpsLatitude () {
      return this.locationId && this.location.gpsLatitude ? this.location.gpsLatitude : null
    },
    gpsLongitude () {
      return this.locationId && this.location.gpsLongitude ? this.location.gpsLongitude : null
    },
    governingDistrict () {
      return this.locationId && this.location.governingDistrict ? this.location.governingDistrict : null
    },
    localMunicipality () {
      return this.locationId && this.location.localMunicipality ? this.location.localMunicipality : null
    },
    location () {
      return this.locationId ? this.locationGet(this.locationId) : {}
    },
    formattedLocationCode () {
      let formattedLocationCode = this.location.locationCode
      if (this.location.locationCode) {
        formattedLocationCode = '(' + this.location.locationCode + ')'
      }
      return this.locationId && this.location ? formattedLocationCode : null
    },
    locationName () {
      return this.locationId && this.location ? this.location.locationName : null
    },
    postalArea () {
      return this.locationId && this.location.postalArea ? this.location.postalArea : null
    },
    streetDirection () {
      return this.locationId && this.location.streetDirection ? this.location.streetDirection : null
    },
    streetName () {
      return this.locationId && this.location.streetName ? this.location.streetName : null
    },
    streetNumber () {
      return this.locationId && this.location.streetNumber ? this.location.streetNumber : null
    },
    streetNumberSuffix () {
      return this.locationId && this.location.streetNumberSuffix ? this.location.streetNumberSuffix : null
    },
    streetType () {
      return this.locationId && this.location.streetType ? this.location.streetType : null
    },
    structureName () {
      return this.locationId && this.location.structureName ? this.location.structureName : null
    }
  },
  watch: {
    operatorCanAccessUsers: {
      handler (newVal) {
        if (newVal) {
          this.usersSummonAction({ componentSelf: this, force: false })
        }
      },
      immediate: true
    },
    operatorLoaded: {
      handler (newVal) {
        if (newVal) {
          this.countriesSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      locationsCountriesSummonAction: LOCATIONS_COUNTRIES_SUMMON,
      usersSummonAction: USERS_SUMMON
    }),
    async countriesSummon () {
      const componentSelf = this
      await this.locationsCountriesSummonAction({ componentSelf })
    },
    userLinkObject (username) {
      return {
        name: 'user',
        params: {
          username
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .location {
    display: flex;
    justify-content: center;
    .location-id {
      color: grey;
    }
    address {
      margin-bottom: 0;
      .address-group {
        display: flex;
        flex-direction: column;
        h4 {
          margin-top: 10px;
          text-align: left;
        }
      }
      .key {
        &:after {
          content: ':';
          padding-right: 5px;
        }
      }
    }
    .v-card__text {
      display: flex;
      .creator {
        display: flex;
        flex-direction: column-reverse;
        margin-left: auto;
      }
    }
  }
}
</style>
