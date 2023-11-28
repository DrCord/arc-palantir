<template>
  <div class="remedy-create-container">
    <h3>Create Remedy</h3>
    <vue-form :state="formstate" @submit.prevent>

      <validate tag="div" class="remedy-description">
        <label for="description" class="required">Description</label>
        <v-textarea
          id="remedy-description"
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

    </vue-form>
    <div class="btn-container">
      <v-btn
        class="cancel"
        color="error"
        dark
        @click="remedyCreateCancel"
      >Cancel<v-icon>mdi-close-circle</v-icon>
      </v-btn>
      <v-btn
        class="save"
        color="success"
        type="button"
        :disabled="formstate.$pristine || formstate.$invalid"
        @click="remedyCreateSave"
      >Create<v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  RECALL_REMEDY_CREATE
} from '@/store/action-types'

export default {
  name: 'RemedyCreate',
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
        description: null
      }
    }
  },
  computed: {
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
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    }
  },
  methods: {
    ...mapActions({
      remedyCreateAction: RECALL_REMEDY_CREATE
    }),
    remedyCreateCancel () {
      this.$emit('remedy-create-cancel')
    },
    async remedyCreateSave () {
      const componentSelf = this
      const recallId = this.recallId
      const payload = {
        recallId,
        body: {
          description: this.model.description
        }
      }
      await this.remedyCreateAction({ componentSelf, payload })
      this.$emit('remedy-create-complete')
    }
  }
}
</script>

<style lang="scss">
#app {
  .remedy-create-container {
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
