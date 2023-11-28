<template>
  <div class="location-code-delete-container">
    <h3>Delete Location Code</h3>
    <h5>This action will remove the code from all linked locations.</h5>
    <vue-form :state="formstate" @submit.prevent>

      <div v-if="availableLocationCodes.length">
      <label for="locationCodeDeleteId" class="required">Delete Location Code</label>
        <v-select ref="selected-code"
          v-model="model.locationCodeDeleteId"
          :items="availableLocationCodes"
          name="locationCodeDeleteId"
          item-text="code"
          item-value="id"
          outlined
        ></v-select>
        <div class="btn-container">
          <v-btn
            class="cancel"
            color="error"
            dark
            @click="locationCodeDeleteCancel"
          >Cancel<v-icon>mdi-close-circle</v-icon>
          </v-btn>
          <v-btn
            class="submit"
            color="success"
            type="button"
            :disabled="!model.locationCodeDeleteId"
            @click="locationCodeDeleteSubmit"
          >Delete Code<v-icon>mdi-delete-circle</v-icon>
          </v-btn>
        </div>
        <br />
      </div>

      <div v-else>
        <h4 v-if="loading">Loading Data...</h4>
      </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  LOCATIONS_LOCATION_CODE_DELETE,
  LOCATIONS_LOCATION_CODES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  LOCATIONS_LOCATION_CODES
} from '@/store/getter-types'

export default {
  name: 'LocationCodeDelete',
  data () {
    return {
      formstate: {},
      model: {
        locationCode: null,
        locationCodeDeleteId: null
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
    },
    availableLocationCodes () {
      const lcs = this.locationCodes.filter(lcs => {
        return lcs.id !== 1
      })
      lcs.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))
      return lcs
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      locationCodeDeleteAction: LOCATIONS_LOCATION_CODE_DELETE,
      locationCodesSummonAction: LOCATIONS_LOCATION_CODES_SUMMON
    }),
    init () {
      this.codesSummon()
    },
    async codesSummon () {
      const componentSelf = this
      await this.locationCodesSummonAction({ componentSelf })
    },
    locationCodeDeleteCancel () {
      this.$emit('location-code-delete-cancel')
    },
    async locationCodeDeleteSubmit () {
      const componentSelf = this
      const locationCodeDeleteId = this.model.locationCodeDeleteId
      const payload = {
        id: locationCodeDeleteId,
        body: {}
      }
      await this.locationCodeDeleteAction({ componentSelf, payload })
      this.model.locationCodeDeleteId = null
      this.$refs['selected-code'].reset()
      this.codesSummon()
    }
  }
}
</script>

<style lang="scss">
#app {
  .location-code-delete-container {
    form {
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
    }
    h3 {
      margin-bottom: 10px;
    }
    h5{
      font-size: smaller;
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
