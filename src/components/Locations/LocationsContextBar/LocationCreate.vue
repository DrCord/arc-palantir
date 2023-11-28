<template>
  <div class="location-create-container">
    <h3>Create Location</h3>
    <vue-form :state="formstate" @submit.prevent>

      <validate tag="div" class="location-name form-field">
        <label for="locationName" class="required">Location Name</label>
        <v-text-field
          id="location-name"
          v-model="model.locationName"
          name="locationName"
          type="text"
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
            <label for="streetNumber">Street Number</label>
            <v-text-field
            id="street-number"
            v-model.number="model.streetNumber"
            name="streetNumber"
            type="number"
            min="1"
            outlined
            hide-details
            />
          </div>
        </div>
      </div>

      <div class="structure-name form-field">
        <div class="field">
          <div class="label">
            <label for="structureName">Structure Name
              <v-tooltip bottom>
                <template #activator="{ on }">
                    <v-icon v-on='on'>mdi-information</v-icon>
                </template>
                <span>House or building name if applicable</span>
              </v-tooltip>
            </label>
            <v-text-field
              id="structure-name"
              v-model="model.structureName"
              name="structureName"
              type="text"
              outlined
              hide-details
            />
          </div>
        </div>
      </div>

      <div class="street-number-suffix form-field">
        <div class="field">
          <div class="label">
            <label for="streetNumberSuffix">Street Number Suffix
              <v-tooltip bottom>
                <template #activator="{ on }">
                    <v-icon v-on='on'>mdi-information</v-icon>
                </template>
                <span>A, B, etc.</span>
              </v-tooltip>
            </label>
            <v-text-field
              id="street-number-suffix"
              v-model="model.streetNumberSuffix"
              name="streetNumberSuffix"
              type="text"
              outlined
              hide-details
            />
          </div>
        </div>
      </div>

      <div class="street-name form-field">
        <div class="field">
          <div class="label">
            <label for="streetName">Street Name</label>
            <v-text-field
              id="street-name"
              v-model="model.streetName"
              name="streetName"
              type="text"
              outlined
              hide-details
            />
          </div>
        </div>
      </div>

      <div class="street-type form-field">
        <div class="field">
          <div class="label">
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
              outlined
              hide-details
            />
          </div>
        </div>
      </div>

      <div class="street-direction form-field">
        <div class="field">
          <div class="label">
            <label for="streetDirection">Street Direction</label>
            <v-select
              v-model="model.streetDirection"
              :items="directions"
              dense
              item-text="direction"
              item-value="direction"
              clearable
              outlined
              hide-details
          ></v-select>
          </div>
        </div>
      </div>

      <div class="address-type form-field">
        <div class="field">
          <div class="label">
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
              :items="locationsAddressTypes"
              dense
              item-text="addressType"
              item-value="id"
              clearable
              return-object
              outlined
              hide-details
          ></v-select>
          </div>
        </div>
      </div>

      <div v-if="addressTypeSelected" class="address-type-identifier form-field">
        <div class="field">
          <div class="label">
            <label for="addressType">{{ model.addressType.addressType }} Description
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
              outlined
              hide-details
            />
          </div>
        </div>
      </div>

      <div class="city form-field">
        <div class="field">
          <div class="label">
            <label for="city">City</label>
            <v-text-field
              id="city"
              v-model="model.city"
              name="city"
              type="text"
              outlined
              hide-details
            />
          </div>
        </div>
      </div>

      <div class="governing-district form-field">
        <div class="field">
          <div class="label">
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
              outlined
              hide-details
            />
          </div>
        </div>
      </div>

      <div class="local-municipality form-field">
        <div class="field">
          <div class="label">
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
              outlined
              hide-details
            />
          </div>
        </div>
      </div>

      <div class="postal-area form-field">
        <div class="field">
          <div class="label">
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
              outlined
              hide-details
            />
          </div>
        </div>
      </div>

      <div class="country form-field">
        <div class="field">
          <div class="label">
            <label for="country">Country</label>
            <v-select
              v-model="model.country"
              :items="locationsCountries"
              dense
              item-text="countryName"
              item-value="countryCode"
              clearable
              outlined
              hide-details
          ></v-select>
          </div>
        </div>
      </div>
      <entity-navigation-control
        entity-name="location"
        @go-to-entity="navUpdate"
      />
    </vue-form>
    <div class="btn-container">
      <v-btn
        class="cancel"
        color="error"
        dark
        @click="locationCreateCancel"
      >Cancel<v-icon>mdi-close-circle</v-icon>
      </v-btn>
      <v-btn
        class="save"
        color="success"
        type="button"
        :disabled="formstate.$pristine || formstate.$invalid"
        @click="locationCreateSave"
      >Create<v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  LOCATION_CREATE,
  LOCATIONS_ADDRESS_TYPES_SUMMON,
  LOCATIONS_COUNTRIES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  LOCATIONS_ADDRESS_TYPES,
  LOCATIONS_COUNTRIES
} from '@/store/getter-types'

import EntityNavigationControl from '@/components/EntityNavigationControl.vue'

export default {
  name: 'LocationCreate',
  components: {
    EntityNavigationControl
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
        country: 'US'
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
      ],
      goToLocation: true
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      locationsAddressTypes: LOCATIONS_ADDRESS_TYPES,
      locationsCountries: LOCATIONS_COUNTRIES
    }),
    addressTypeSelected () {
      return this.model.addressType
    },
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    locationNameErrorMessages () {
      if (this.locationNameErrorStateRequired) {
        return 'Location Name is required'
      }
      return null
    },
    locationNameErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { locationName } = formstate
      if (!locationName || locationName.$untouched) {
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
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      locationCreateAction: LOCATION_CREATE,
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
    locationCreateCancel () {
      this.$emit('location-create-cancel')
    },
    async locationCreateSave () {
      const componentSelf = this
      const addressTypeId = this.model.addressType ? this.model.addressType.id : null
      const payload = {
        body: {
          location_name: this.model.locationName,
          street_number: this.model.streetNumber,
          structure_name: this.model.structureName,
          street_number_suffix: this.model.streetNumberSuffix,
          street_name: this.model.streetName,
          street_type: this.model.streetType,
          street_direction: this.model.streetDirection,
          address_type: addressTypeId,
          address_type_identifier: this.model.addressTypeIdentifier,
          city: this.model.city,
          governing_district: this.model.governingDistrict,
          postal_area: this.model.postalArea,
          local_municipality: this.model.localMunicipality,
          country: this.model.country,
          gps_latitude: null,
          gps_longitude: null
        }
      }
      const result = await this.locationCreateAction({ componentSelf, payload })
      const emitPayload = { id: result, navigate: this.goToLocation }
      this.$emit('location-create-complete', emitPayload)
    },
    navUpdate (event) {
      this.goToLocation = event.value
    }
  }
}
</script>

<style lang="scss">
#app {
  .location-create-container {
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
