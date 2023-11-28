<template>
  <div class="location-code-create-container">
    <h3>Create Location Code</h3>
    <vue-form :state="formstate" @submit.prevent>
      <div class = "location-code">
      <validate tag="div" class="form-field">
        <label for="locationCode" class="required">Add Location Code</label>
        <v-text-field
          id="location-code"
          v-model="model.locationCode"
          name="locationCode"
          type="text"
          required
          outlined
          :error-messages="locationCodeErrorMessages"
        >
        <v-icon
            v-if="locationCodeErrorMessages && !formstate.$pristine"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>

      <div class="btn-container">
        <v-btn
          class="cancel"
          color="error"
          dark
          @click="locationCodeCreateCancel"
        >Cancel<v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          class="save"
          color="success"
          type="button"
          :disabled="formstate.$pristine || formstate.$invalid || (locationCodeErrorMessages !== null)"
          @click="locationCodeCreateSave"
        >Create Code<v-icon>mdi-delete-circle</v-icon>
        </v-btn>
      </div>
    </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  LOCATIONS_LOCATION_CODE_CREATE,
  LOCATIONS_LOCATION_CODES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  LOCATIONS_LOCATION_CODES
} from '@/store/getter-types'

export default {
  name: 'LocationCodeCreate',
  data () {
    return {
      formstate: {},
      model: {
        locationCode: null
      }
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      locationCodes: LOCATIONS_LOCATION_CODES
    }),
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    locationCodeErrorMessages () {
      if (this.formstateUntouched) {
        return null
      }
      if (this.locationCodeFound) {
        return 'Location Code must be unique'
      }
      if (!this.locationCodeCorrectFormat) {
        return 'Location Code in the form XX-XX-XX'
      }
      return null
    },
    locationCodeFound () {
      return this.locationCodes.some(el => el.code === this.model.locationCode)
    },
    locationCodeCorrectFormat () {
      return (/^[A-Z]{2}-[A-Z]{2}-[A-Z]{2}$/.test(this.model.locationCode))
    },
    locationCodeErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { locationCode } = formstate
      if (!locationCode || locationCode.$untouched) {
        return null
      }
      if (locationCode.$invalid && locationCode.$error.required) {
        return true
      }
      return null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      locationCodeCreateAction: LOCATIONS_LOCATION_CODE_CREATE,
      locationCodesSummonAction: LOCATIONS_LOCATION_CODES_SUMMON
    }),
    init () {
      this.codesSummon()
    },
    async codesSummon () {
      const componentSelf = this
      await this.locationCodesSummonAction({ componentSelf })
    },
    locationCodeCreateCancel () {
      this.$emit('location-code-create-cancel')
    },
    async locationCodeCreateSave () {
      const componentSelf = this
      const payload = {
        body: {
          code: this.model.locationCode
        }
      }
      await this.locationCodeCreateAction({ componentSelf, payload })
      this.$emit('location-code-create-complete')
    }
  }
}
</script>

<style lang="scss">
#app {
  .location-code-create-container {
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
