<template>
  <div class="recall-update-container">
    <h3>Edit Recall</h3>
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
            <validate tag="div" class="mfr-campaign-id">
              <label for="mfrCampaignId">Manufacturer Campaign Id</label>
              <v-text-field
                id="mfr-campaign-id"
                v-model="model.mfrCampaignId"
                name="mfrCampaignId"
                type="text"
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

      <div class="safety-recall-check form-field">
        <validate tag="div" class="safety-recall">
          <label for="safetyRecall">Safety Recall</label>
          <v-checkbox
            id="safetyRecall"
            v-model="model.safetyRecall"
            name="safetyRecall"
            :disabled="true"
            hide-details
          />
        </validate>
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

    </vue-form>
    <div class="btn-container">
      <v-btn
        class="cancel"
        color="error"
        dark
        @click="recallUpdateCancel"
      >Cancel<v-icon>mdi-close-circle</v-icon>
      </v-btn>
      <v-btn
        class="save"
        color="success"
        type="button"
        :disabled="formstate.$pristine || formstate.$invalid"
        @click="recallUpdateSave"
      >Update<v-icon>mdi-update</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  LOCATIONS_COUNTRIES_SUMMON,
  RECALL_UPDATE
} from '@/store/action-types'
import {
  LOADING,
  LOCATIONS_COUNTRIES,
  RECALL
} from '@/store/getter-types'

export default {
  name: 'RecallUpdate',
  props: {
    recallId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      formstate: {},
      model: {
        title: null,
        description: null,
        nhtsaNumber: null,
        mfrCampaignId: null,
        country: null,
        safetyRecall: true,
        safetyDescription: null
      }
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      locationsCountries: LOCATIONS_COUNTRIES,
      recallGet: RECALL
    }),
    descriptionErrorMessages () {
      if (this.descriptionErrorStateRequired) {
        return 'Description is required'
      }
      return null
    },
    descriptionErrorStateRequired () {
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { description } = formstate
      if (!description || description.$pristine) {
        return null
      }
      if (description.$invalid && description.$error.required) {
        return true
      }
      return null
    },
    formstatePristine () {
      if (this.formstate.$pristine) {
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
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { nhtsaNumber } = formstate
      if (!nhtsaNumber || nhtsaNumber.$pristine) {
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
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { safetyDescription } = formstate
      if (!safetyDescription || safetyDescription.$pristine) {
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
    recall () {
      return this.recallId ? this.recallGet(this.recallId) : {}
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
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { title } = formstate
      if (!title || title.$pristine) {
        return null
      }
      if (title.$invalid && title.$error.excludedCharactersValidator) {
        return true
      }
      return null
    },
    titleErrorStateMinLength () {
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { title } = formstate
      if (!title || title.$pristine) {
        return null
      }
      if (title.$invalid && title.$error.minlength) {
        return true
      }
      return null
    },
    titleErrorStateRequired () {
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { title } = formstate
      if (!title || title.$pristine) {
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
    },
    recall: {
      handler (newVal, oldVal) {
        if (newVal) {
          const recallValue = this.recall
          if (recallValue) {
            this.model = { ...recallValue }
            if (recallValue.country === 'USA') {
              this.model.country = 'US'
            }
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
      recallUpdateAction: RECALL_UPDATE,
      locationsCountriesSummonAction: LOCATIONS_COUNTRIES_SUMMON
    }),
    init () {
      this.countriesSummon()
    },
    async countriesSummon () {
      const componentSelf = this
      await this.locationsCountriesSummonAction({ componentSelf })
    },
    recallUpdateCancel () {
      this.$emit('recall-update-cancel')
    },
    async recallUpdateSave () {
      const componentSelf = this
      const recallId = this.recallId
      const payload = {
        recallId,
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
      await this.recallUpdateAction({ componentSelf, payload })
      this.$emit('recall-update-complete')
    }
  }
}
</script>

<style lang="scss">
#app {
  .recall-update-container {
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
