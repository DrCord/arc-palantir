<template>
  <div class="location-code-manage-container">
    <h3>Link Location Code to  {{ model.locationName }}</h3>
    <vue-form :state="formstate" @submit.prevent>
        <div class="location-enable">
          <validate tag="div" class="location-enable">
            <div class="field">
              <label for="location-enable">
                Enable Location Code
              </label>
              <v-switch
                id="location-enable"
                v-model="model.locationCodeEnable"
                name="location-enable"
                type="checkbox"
                @change="locationEnableCodeToggled"
              />
            </div>
          </validate>
        </div>
      <div v-if="availableLocations.length">
        <div class="location-code form-field">
          <div class="field">
            <div class="label">
              <validate tag="div" class="location-code">
                <label for="location-code">Location Code</label>
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>Location Code used by Accounting</span>
                </v-tooltip>
                <v-select
                  v-model="model.locationCodeId"
                  :items="availableLocations"
                  item-value="id"
                  item-text="code"
                  name="locationCode"
                  outlined
                  hide-details
                  dense
                  :disabled="!model.locationCodeEnable"
                  :placeholder="!model.locationCodeEnable ? 'DISABLED' : ''"
                ></v-select>
              </validate>
            </div>
          </div>
        </div>
      </div>

      <div class="btn-container">
        <v-btn
          class="cancel"
          color="error"
          dark
          @click="locationCodeManageCancel"
        >Cancel<v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          class="save"
          color="success"
          type="button"
          :disabled="formInvalid"
          @click="locationsLocationCodeSet"
        >Update<v-icon>mdi-update</v-icon>
        </v-btn>
      </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  LOCATIONS_LOCATION_CODE_SET,
  LOCATIONS_LOCATION_CODES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  LOCATION,
  LOCATIONS_LOCATION_CODES
} from '@/store/getter-types'

export default {
  name: 'LocationCodeManage',
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
        locationCodeEnable: false,
        locationCodeId: null
      }
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      locationGet: LOCATION,
      locationCodes: LOCATIONS_LOCATION_CODES
    }),
    formInvalid () {
      const { model } = this
      // if still initial state - invalid
      if (!this.locationCodeId) {
        // has set enable and location code - valid
        if (model.locationCodeId && model.locationCodeEnable) {
          return false
        }
        return true
      }
      // already had location code - changed code - valid
      if (this.locationCodeId) {
        if (model.locationCodeId && this.locationCodeId !== model.locationCodeId) {
          if (model.locationCodeEnable) {
            return false
          }
        }
      }
      // if locationCode enabled but no code set - invalid
      if (!model.locationCodeId && model.locationCodeEnable) {
        return true
      }
      // had location code to start, disabled locationCodeEnable - valid
      if (this.locationCodeId && !model.locationCodeEnable) {
        return false
      }
      // default invalid
      return true
    },
    locationCodeId () {
      if (this.locationCode) {
        const lcs = [...this.locationCodes]
        var locationCode = lcs.find(item => item.code === this.location.locationCode)
        if (locationCode) {
          return locationCode.id
        }
      }
      return null
    },
    locationCode () {
      return this.location ? this.location.locationCode : null
    },
    availableLocations () {
      const lcs = [...this.locationCodes]
      return lcs.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))
    },
    formstatePristine () {
      if (this.formstate.$pristine) {
        return true
      }
      return false
    },
    location () {
      return this.locationId ? this.locationGet(this.locationId) : null
    }
  },
  watch: {
    locationCodeId: {
      handler (newVal) {
        if (newVal) {
          if (newVal) {
            this.setLocationCodeEnable(true)
            this.model.locationCodeId = newVal
          } else {
            this.setLocationCodeEnable(false)
            this.model.locationCodeId = null
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
      locationsLocationCodeSetAction: LOCATIONS_LOCATION_CODE_SET,
      locationCodesSummonAction: LOCATIONS_LOCATION_CODES_SUMMON
    }),
    init () {
      this.codesSummon()
      this.model.locationCodeId = this.locationCodeId
    },
    locationEnableCodeToggled: function (toggleEvent) {
      if (!toggleEvent) {
        this.model.locationCodeId = null
      }
    },
    setLocationCodeEnable (val) {
      this.model.locationCodeEnable = val
    },
    async codesSummon () {
      const componentSelf = this
      await this.locationCodesSummonAction({ componentSelf })
    },
    locationCodeManageCancel () {
      this.$emit('location-code-manage-cancel')
    },
    async locationsLocationCodeSet () {
      const componentSelf = this
      const locationId = this.locationId
      const payload = {
        locationId: locationId,
        body: {
          accounting_location_code_id: this.model.locationCodeId
        }

      }
      await this.locationsLocationCodeSetAction({ componentSelf, payload })
      this.$emit('location-code-manage-complete')
    }
  }
}
</script>

<style lang="scss">
#app {
  .location-code-manage-container {
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
