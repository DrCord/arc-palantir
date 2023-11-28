<template>
  <div class="location-update-container">
    <h3>Edit Location Details</h3>
    <vue-form :state="formstate" @submit.prevent>

      <validate tag="div" class="location-name form-field">
        <label for="locationName" class="required">Location Name</label>
        <v-text-field
          id="location-name"
          v-model="model.locationName"
          name="locationName"
          type="text"
          clearable
          required
          outlined
          :error-messages="locationNameErrorMessages"
        >
        <v-icon
            v-if="locationNameErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>

      <div class="street-number form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="street-number">
              <label for="streetNumber">Street Number</label>
              <v-text-field
                id="street-number"
                v-model.number="model.streetNumber"
                name="streetNumber"
                type="number"
                min="1"
                clearable
                outlined
                hide-details
              />
            </validate>
          </div>
        </div>
      </div>

      <div class="structure-name form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="structure-name">
              <label for="structureName">Structure Name
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>House or building name if aplicable</span>
                </v-tooltip>
              </label>
              <v-text-field
                id="structure-name"
                v-model="model.structureName"
                name="structureName"
                type="text"
                clearable
                outlined
                hide-details
              />
            </validate>
          </div>
        </div>
      </div>

      <div class="street-number-suffix form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="street-number-suffix">
              <label for="streetNumberSuffix">Street Number Suffix
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>A, B, etc. Maximum 5 characters.</span>
                </v-tooltip>
              </label>
              <v-text-field
                id="street-number-suffix"
                v-model="model.streetNumberSuffix"
                name="streetNumberSuffix"
                type="text"
                maxlength="5"
                clearable
                outlined
                hide-details
              />
            </validate>
          </div>
        </div>
      </div>

      <div class="street-name form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="street-name">
              <label for="streetName">Street Name</label>
              <v-text-field
                id="street-name"
                v-model="model.streetName"
                name="streetName"
                type="text"
                clearable
                outlined
                hide-details
              />
            </validate>
          </div>
        </div>
      </div>

      <div class="street-type form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="street-type">
              <label for="streetType">Street Type
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>street, avenue, lane, loop, etc.</span>
                </v-tooltip>
              </label>
              <v-text-field
                id="street-type"
                v-model="model.streetType"
                name="streetType"
                type="text"
                clearable
                outlined
                hide-details
              />
            </validate>
          </div>
        </div>
      </div>

      <div class="street-direction form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="street-direction">
              <label for="streetDirection">Street Direction</label>
                <v-select
                  v-model="model.streetDirection"
                  name="streetDirection"
                  :items="directions"
                  dense
                  item-text="direction"
                  item-value="direction"
                  clearable
                  outlined
                  hide-details
              ></v-select>
            </validate>
          </div>
        </div>
      </div>

      <div class="address-type form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="address-type">
              <label for="addressType">Alternate Address Type
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>Non-standard street address. i.e PO Box, Floor, Apartment, etc. </span>
                </v-tooltip>
              </label>
                <v-select
                  v-model="model.addressType"
                  name="addressType"
                  :items="locationsAddressTypes"
                  dense
                  item-text="addressType"
                  item-value="addressType"
                  clearable
                  outlined
                  hide-details
              ></v-select>
            </validate>
          </div>
        </div>
      </div>

      <div v-if="addressTypeSelected" class="address-type-identifier form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="address-type-identifier">
              <label for="addressType">{{ model.addressType }} Descriptor
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>Descriptor for alternate address type. i.e floor #, PO Box #, Building, etc. </span>
                </v-tooltip>
              </label>
              <v-text-field
                id="address-type-identifier"
                v-model="model.addressTypeIdentifier"
                name="addressTypeIdentifier"
                type="text"
                clearable
                outlined
                hide-details
              />
            </validate>
          </div>
        </div>
      </div>

      <div class="city form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="city">
              <label for="city">City</label>
              <v-text-field
                id="city"
                v-model="model.city"
                name="city"
                type="text"
                clearable
                outlined
                hide-details
              />
            </validate>
          </div>
        </div>
      </div>

      <div class="governing-district form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="governing-district">
              <label for="governingDistrict">Governing District
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>State (U.S.), Province (Canada), Federal District (Mexico), County (U.K.), etc.</span>
                </v-tooltip>
              </label>
              <v-text-field
                id="governing-district"
                v-model="model.governingDistrict"
                name="governingDistrict"
                type="text"
                clearable
                outlined
                hide-details
              />
            </validate>
          </div>
        </div>
      </div>

      <div class="local-municipality form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="local-municipality">
              <label for="localMunicipality">Local Municipality
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>For example, hamlet/village appears in the address before the city/town</span>
                </v-tooltip>
              </label>
              <v-text-field
                id="local-municipality"
                v-model="model.localMunicipality"
                name="localMunicipality"
                type="text"
                clearable
                outlined
                hide-details
              />
            </validate>
          </div>
        </div>
      </div>

      <div class="postal-area form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="postal-area">
              <label for="postalArea">Zip/Postal Code
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>Zip (U.S.), Postal Code (Canada, Mexico), Postcode (U.K.), etc.</span>
                </v-tooltip>
              </label>
              <v-text-field
                id="postal-area"
                v-model="model.postalArea"
                name="postalArea"
                type="text"
                clearable
                outlined
                hide-details
              />
            </validate>
          </div>
        </div>
      </div>

      <div class="country form-field">
        <div class="field">
          <div class="label">
            <validate tag="div" class="country">
              <label for="country">Country</label>
                <v-select
                  v-model="model.country"
                  name="country"
                  :items="locationsCountries"
                  dense
                  item-text="countryName"
                  item-value="countryCode"
                  clearable
                  outlined
                  hide-details
              ></v-select>
            </validate>
          </div>
        </div>
      </div>

    </vue-form>
    <div class="btn-container">
      <v-btn
        class="cancel"
        color="error"
        dark
        @click="locationUpdateCancel"
      >Cancel<v-icon>mdi-close-circle</v-icon>
      </v-btn>
      <v-btn
        class="save"
        color="success"
        type="button"
        :disabled="formstate.$pristine || formstate.$invalid"
        @click="locationUpdateSave"
      >Update<v-icon>mdi-update</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  LOCATION_UPDATE,
  LOCATIONS_ADDRESS_TYPES_SUMMON,
  LOCATIONS_COUNTRIES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  LOCATION,
  LOCATIONS_ADDRESS_TYPES,
  LOCATIONS_COUNTRIES
} from '@/store/getter-types'

export default {
  name: 'LocationUpdate',
  props: {
    locationId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      formstate: {},
      model: {
        locationName: null,
        streetNumber: null,
        structureName: null,
        streetNumberSuffix: null,
        streetName: null,
        streetType: null,
        streetDirection: null,
        addressType: null,
        addressTypeIdentifier: null,
        city: null,
        governingDistrict: null,
        postalArea: null,
        localMunicipality: null,
        country: null
      },
      directions: [
        { direction: 'N' },
        { direction: 'E' },
        { direction: 'S' },
        { direction: 'W' },
        { direction: 'NE' },
        { direction: 'SE' },
        { direction: 'NW' },
        { direction: 'SW' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      locationGet: LOCATION,
      locationsAddressTypes: LOCATIONS_ADDRESS_TYPES,
      locationsCountries: LOCATIONS_COUNTRIES
    }),
    addressTypeSelected () {
      return this.model.addressType
    },
    addressTypeId () {
      return this.model.addressType ? this.findAddressTypeId(this.model.addressType) : null
    },
    formstatePristine () {
      if (this.formstate.$pristine) {
        return true
      }
      return false
    },
    location () {
      return this.locationId ? this.locationGet(this.locationId) : {}
    },
    locationNameErrorMessages () {
      if (this.locationNameErrorStateRequired) {
        return 'Location Name is required'
      }
      return null
    },
    locationNameErrorStateRequired () {
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { locationName } = formstate
      if (!locationName || locationName.$pristine) {
        return null
      }
      if (locationName.$invalid && locationName.$error.required) {
        return true
      }
      return null
    }
  },
  watch: {
    addressTypeSelected: {
      handler (newVal, oldVal) {
        if (oldVal) {
          if (!this.addressTypeSelected) {
            this.model.addressTypeIdentifier = null
          }
        }
      },
      immediate: true
    },
    location: {
      handler (newVal, oldVal) {
        if (newVal) {
          const locationValue = this.location
          if (locationValue) {
            this.model = { ...locationValue }
          }
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
      locationUpdateAction: LOCATION_UPDATE,
      locationsAddressTypesSummonAction: LOCATIONS_ADDRESS_TYPES_SUMMON,
      locationsCountriesSummonAction: LOCATIONS_COUNTRIES_SUMMON
    }),
    init () {
      this.addressTypesSummon()
      this.countriesSummon()
    },
    async addressTypesSummon () {
      const componentSelf = this
      await this.locationsAddressTypesSummonAction({ componentSelf })
    },
    async countriesSummon () {
      const componentSelf = this
      await this.locationsCountriesSummonAction({ componentSelf })
    },
    findAddressTypeId (addressTypeName) {
      return this.locationsAddressTypes.find(addressType => addressType.addressType === addressTypeName).id
    },
    locationUpdateCancel () {
      this.$emit('location-update-cancel')
    },
    async locationUpdateSave () {
      const componentSelf = this
      const locationId = this.locationId
      const payload = {
        locationId,
        body: {
          location_name: this.model.locationName ? this.model.locationName : null,
          location_code: this.model.locationCode ? this.model.locationCode : null,
          street_number: this.model.streetNumber ? this.model.streetNumber : null,
          structure_name: this.model.structureName ? this.model.structureName : null,
          street_number_suffix: this.model.streetNumberSuffix ? this.model.streetNumberSuffix : null,
          street_name: this.model.streetName ? this.model.streetName : null,
          street_type: this.model.streetType ? this.model.streetType : null,
          street_direction: this.model.streetDirection ? this.model.streetDirection : null,
          address_type: this.addressTypeId ? this.addressTypeId : null,
          address_type_identifier: this.model.addressTypeIdentifier ? this.model.addressTypeIdentifier : null,
          city: this.model.city ? this.model.city : null,
          governing_district: this.model.governingDistrict ? this.model.governingDistrict : null,
          postal_area: this.model.postalArea ? this.model.postalArea : null,
          local_municipality: this.model.localMunicipality ? this.model.localMunicipality : null,
          country: this.model.country ? this.model.country : null,
          gps_latitude: null,
          gps_longitude: null
        }
      }
      await this.locationUpdateAction({ componentSelf, payload })
      this.$emit('location-update-complete')
    }
  }
}
</script>

<style lang="scss">
#app {
  .location-update-container {
    form {
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
    }
    h3 {
      margin-bottom: 0px;
    }
    .btn-container {
      margin-top: 0px;
      margin-bottom: 50px;
      display: flex;
      justify-content: flex-end;
      button {
        margin-left: 20px;
        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
