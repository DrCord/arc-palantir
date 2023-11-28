<template>
  <div class="recall-create-container">
    <h3>Create Recall</h3>
    <vue-form :state="formstate" @submit.prevent>
      <validate
        tag="div"
        class="recall-title"
        :custom="{
          excludedCharactersValidator: function (value, attrValue, vnode) {
            // only allows uppercase/lowercase letters, numbers, space and dash
            return !(/[^a-zA-Z0-9\-: ]/.test(value))
          }
        }"
      >
        <label for="title" class="required">Recall Title</label>
        <v-text-field
          id="title"
          v-model="model.title"
          name="title"
          type="text"
          required
          minlength="6"
          maxlength="80"
          outlined
          :error-messages="titleErrorMessages"
        >
        <v-icon
            v-if="titleErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>

      <validate tag="div" class="recall-description">
        <label for="description" class="required">Description</label>
        <v-textarea
          id="recall-description"
          v-model="model.description"
          name="description"
          rows="1"
          auto-grow
          required
          outlined
          :error-messages="descriptionErrorMessages"
        >
        <v-icon
            v-if="descriptionErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-textarea>
      </validate>

      <validate tag="div" class="nhtsa-number form-field">
        <label for="nhtsaNumber" class="required">NHTSA Number</label>
        <v-text-field
          id="nhtsa-number"
          v-model="model.nhtsaNumber"
          name="nhtsaNumber"
          type="text"
          required
          outlined
          :error-messages="nhtsaNumberErrorMessages"
        >
        <v-icon
            v-if="nhtsaNumberErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>

      <div class="mfr-campaign-id form-field">
        <div class="field">
          <div class="label">
            <label for="mfrCampaignId">Manufacturer Campaign Id</label>
            <v-text-field
              id="mfr-campaign-id"
              v-model="model.mfrCampaignId"
              name="mfrCampaignId"
              type="text"
              outlined
              hide-details="auto"
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
              hide-details="auto"
          ></v-select>
          </div>
        </div>
      </div>

      <div class="safety-recall-check form-field">
        <label for="safetyRecall">Safety Recall</label>
        <v-checkbox
          id="safety-recall"
          v-model="model.safetyRecall"
          hide-details="auto"
        />
      </div>

      <div v-if="model.safetyRecall" class="safety-recall-description form-field">
        <validate tag="div" class="safety-recall-description">
          <label for="safetyDescription" class="required">Safety Description</label>
          <v-textarea
            id="safety-recall-description"
            v-model="model.safetyDescription"
            name="safetyDescription"
            rows="1"
            auto-grow
            required
            outlined
            :error-messages="safetyDescriptionErrorMessages"
          >
          <v-icon
              v-if="safetyDescriptionErrorMessages"
              slot="append"
              class="field-error-icon"
              large
              color="red"
            >mdi-alert</v-icon>
          </v-textarea>
        </validate>
      </div>

      <div class="add-all-vins form-field">
        <label for="addAllVins">Add all VINs to created recall</label>
        <v-checkbox
          id="add-all-vins"
          v-model="model.addAllVins"
          name="addAllVins"
          hide-details="auto"
        />
      </div>
      <div v-show="model.addAllVins" class="add-all-vins-verify form-field">
        <label for="addAllVinsVerify">VERIFY: You are sure you want to add all VINs to created recall?</label>
        <v-checkbox
          id="add-all-vins-verify"
          v-model="model.addAllVinsVerify"
          name="addAllVinsVerify"
          hide-details="auto"
        />
      </div>
      <entity-navigation-control
        entity-name="recall"
        @go-to-entity="navUpdate"
      />
    </vue-form>
    <div class="btn-container">
      <v-btn
        class="cancel"
        color="error"
        dark
        @click="recallCreateCancel"
      >Cancel<v-icon>mdi-close-circle</v-icon>
      </v-btn>
      <v-btn
        class="save"
        color="success"
        type="button"
        :disabled="formstateDisabled"
        @click="recallCreateSave"
      >Create<v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  RECALL_CREATE,
  RECALL_VEHICLES_ADD,
  LOCATIONS_COUNTRIES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  LOCATIONS_COUNTRIES,
  VINS
} from '@/store/getter-types'

import EntityNavigationControl from '@/components/EntityNavigationControl.vue'

export default {
  name: 'RecallCreate',
  components: {
    EntityNavigationControl
  },
  data () {
    return {
      formstate: {},
      model: {
        addAllVins: false,
        addAllVinsVerify: false,
        title: null,
        description: null,
        nhtsaNumber: null,
        mfrCampaignId: null,
        country: 'US',
        safetyRecall: true,
        safetyDescription: null
      },
      goToRecall: true
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      locationsCountries: LOCATIONS_COUNTRIES,
      vins: VINS
    }),
    addAllVinsVerified () {
      if (this.model.addAllVins && this.model.addAllVinsVerify) {
        return true
      }
      return false
    },
    descriptionErrorMessages () {
      if (this.descriptionErrorStateRequired) {
        return 'Description is required'
      }
      return null
    },
    descriptionErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { description } = formstate
      if (!description || description.$untouched) {
        return null
      }
      if (description.$invalid && description.$error.required) {
        return true
      }
      return null
    },
    formstateDisabled () {
      const { formstate, model } = this
      const { addAllVins, addAllVinsVerify } = model
      if (formstate.$pristine || formstate.$invalid) {
        return true
      }
      if (addAllVins && !addAllVinsVerify) {
        return true
      }
      return false
    },
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    nhtsaNumberErrorMessages () {
      if (this.nhtsaNumberErrorStateRequired) {
        return 'NHTSA Number is required'
      }
      return null
    },
    nhtsaNumberErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { nhtsaNumber } = formstate
      if (!nhtsaNumber || nhtsaNumber.$untouched) {
        return null
      }
      if (nhtsaNumber.$invalid && nhtsaNumber.$error.required) {
        return true
      }
      return null
    },
    safetyDescriptionErrorMessages () {
      if (this.safetyDescriptionErrorStateRequired) {
        return 'Safety Description is required'
      }
      return null
    },
    safetyDescriptionErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { safetyDescription } = formstate
      if (!safetyDescription || safetyDescription.$untouched) {
        return null
      }
      if (safetyDescription.$invalid && safetyDescription.$error.required) {
        return true
      }
      return null
    },
    safetyRecallSelected () {
      return this.model.safetyRecall
    },
    titleErrorMessages () {
      if (this.titleErrorStateInvalidChars) {
        return 'Alphanumeric, colon and dash characters only'
      }
      if (this.titleErrorStateMinLength) {
        return 'Minimum length is 6 characters'
      }
      if (this.titleErrorStateRequired) {
        return 'Title is required'
      }
      return null
    },
    titleErrorStateInvalidChars () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { title } = formstate
      if (!title || title.$untouched) {
        return null
      }
      if (title.$invalid && title.$error.excludedCharactersValidator) {
        return true
      }
      return null
    },
    titleErrorStateMinLength () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { title } = formstate
      if (!title || title.$untouched) {
        return null
      }
      if (title.$invalid && title.$error.minlength) {
        return true
      }
      return null
    },
    titleErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { title } = formstate
      if (!title || title.$untouched) {
        return null
      }
      if (title.$invalid && title.$error.required) {
        return true
      }
      return null
    }
  },
  watch: {
    safetyRecallSelected: {
      handler (newVal, oldVal) {
        if (oldVal) {
          if (!this.safetyRecallSelected) {
            this.model.safetyDescription = null
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
      recallCreateAction: RECALL_CREATE,
      recallVehiclesAddAction: RECALL_VEHICLES_ADD,
      locationsCountriesSummonAction: LOCATIONS_COUNTRIES_SUMMON
    }),
    init () {
      this.countriesSummon()
    },
    async countriesSummon () {
      const componentSelf = this
      await this.locationsCountriesSummonAction({ componentSelf })
    },
    recallCreateCancel () {
      this.$emit('recall-create-cancel')
    },
    async recallCreateSave () {
      const componentSelf = this
      const payload = {
        body: {
          title: this.model.title,
          description: this.model.description,
          nhtsa_number: this.model.nhtsaNumber,
          mfr_campaign_id: this.model.mfrCampaignId,
          country: this.model.country,
          safety_recall: this.model.safetyRecall,
          safety_description: this.model.safetyDescription
        }
      }
      const recallId = await this.recallCreateAction({ componentSelf, payload })
      const addAllVins = this.addAllVinsVerified
      const event = { id: recallId, navigate: this.goToRecall }
      this.$emit('recall-create-complete', event)
      if (addAllVins) {
        this.recallVehiclesAdd(recallId)
      }
    },
    async recallVehiclesAdd (recallId) {
      const componentSelf = this
      const { vins } = this
      const payload = {
        recallId,
        body: {
          vins
        }
      }
      await this.recallVehiclesAddAction({ componentSelf, payload })
      this.$emit('vehicles-add-complete')
    },
    navUpdate (event) {
      this.goToRecall = event.value
    }
  }
}
</script>

<style lang="scss">
#app {
  .recall-create-container {
    form {
      #go-to-entity-container {
        padding-left: 0rem;
      }
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
    }
    h3 {
      margin-bottom: 0px;
    }
    .v-input--checkbox {
      margin-bottom: 20px;
      margin-top: 0px;
      padding: 0;
      .v-icon {
        font-size: 2rem;
      }
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
