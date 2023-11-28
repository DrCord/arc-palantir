<template>
  <div class="part-set-container">
    <h3>Model Release - Part Set</h3>
    <vue-form :state="formstate">
      <div class="model-release">
        <label for="modelRelease" class="required">Model Release</label>
        <v-select
          v-model="model.modelReleaseId"
          dense
          name="modelRelease"
          :items="modelReleases"
          item-text="modelReleaseDescription"
          item-value="modelReleaseId"
          required
          outlined
        ></v-select>
        <h4 v-if="!model.modelReleaseId">Select a model release to continue</h4>
      </div>

      <div v-if="model.modelReleaseId" class="part-type">
        <label for="partType" class="required">Part Type</label>
        <v-select
          v-model="model.partType"
          dense
          name="partType"
          :items="partTypes"
          required
          outlined
          hide-details="auto"
        ></v-select>
      </div>

      <validate
        v-if="model.partType"
        tag="div"
        class="part-number"
      >
        <label for="partNumber" class="required">Part Number</label>
        <v-text-field
          id="partNumber"
          v-model="model.partNumber"
          name="partNumber"
          type="text"
          required
          minlength="6"
          maxlength="6"
          outlined
          :error-messages="partNumberErrorMessages"
        >
        <v-icon
            v-if="partNumberErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>

      <v-btn
        v-if="model.modelReleaseId"
        :disabled="!formstate.$valid || !model.partType"
        color=success
        type="button"
        @click="partSet"
      >Set Part<v-icon>mdi-progress-wrench</v-icon>
      </v-btn>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_MODEL_RELEASE_PART_SAVE } from '@/store/action-types'
import { VEHICLES_MODEL_RELEASES } from '@/store/getter-types'

export default {
  name: 'ModelReleasePartSet',
  props: {
    modelReleaseId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      formstate: {},
      model: {
        modelReleaseId: null,
        partType: null,
        partNumber: null
      }
    }
  },
  computed: {
    ...mapGetters({
      modelReleases: VEHICLES_MODEL_RELEASES
    }),
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    modelRelease () {
      return this.modelReleases.find(modelRelease => modelRelease.modelReleaseId === this.model.modelReleaseId)
    },
    parts () {
      return this.modelRelease.parts !== undefined ? this.modelRelease.parts : []
    },
    partNumberErrorMessages () {
      if (this.partNumberErrorStateMinLength) {
        return 'Minimum length is 6 characters'
      }
      if (this.partNumberErrorStateRequired) {
        return 'Part number is required'
      }
      return null
    },
    partNumberErrorStateMinLength () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { partNumber } = formstate
      if (!partNumber || partNumber.$untouched) {
        return null
      }
      if (partNumber.$invalid && partNumber.$error.minlength) {
        return true
      }
      return null
    },
    partNumberErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { partNumber } = formstate
      if (!partNumber || partNumber.$untouched) {
        return null
      }
      if (partNumber.$invalid && partNumber.$error.required) {
        return true
      }
      return null
    },
    partTypes () {
      return this.parts.map(part => part.partType)
    }
  },
  methods: {
    ...mapActions({
      modelReleasePartSetAction: VEHICLES_MODEL_RELEASE_PART_SAVE
    }),
    async partSet () {
      const componentSelf = this
      const { modelReleaseId, partType, partNumber } = this.model
      const payload = {
        modelReleaseId,
        partType,
        partNumber
      }
      await this.modelReleasePartSetAction({ componentSelf, payload })
      this.$emit('part-set-complete')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .part-set-container {
    .part-type {
      margin-bottom: 20px;
    }
    form {
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
    }
    height: 100%;
    ul {
      list-style-type: none;
      padding-left: 2px;
      li {
        h4 {
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 0;
          margin-top: 5px;
          text-align: left;
        }
      }
    }
    button {
      margin-top: 0px;
      margin-bottom: 50px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
