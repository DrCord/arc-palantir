<template>
  <div class="remedy-edit-container">
    <h3>Edit Remedy</h3>
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
        @click="remedyEditCancel"
      >Cancel<v-icon>mdi-close-circle</v-icon>
      </v-btn>
      <v-btn
        class="save"
        color="success"
        type="button"
        :disabled="formstate.$pristine || formstate.$invalid"
        @click="remedyEditSave"
      >Update<v-icon>mdi-update</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { RECALL_REMEDY_EDIT } from '@/store/action-types'
import { RECALL } from '@/store/getter-types'

export default {
  name: 'RemedyEdit',
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
    ...mapGetters({
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
    recall () {
      return this.recallId ? this.recallGet(this.recallId) : null
    },
    remedy () {
      return this.recall.remedyId ? this.recall.remedy : null
    }
  },
  watch: {
    remedy: {
      handler (newVal, oldVal) {
        if (newVal) {
          if (this.remedy) {
            this.model.description = this.remedy.description
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      remedyEditAction: RECALL_REMEDY_EDIT
    }),
    remedyEditCancel () {
      this.$emit('remedy-edit-cancel')
    },
    async remedyEditSave () {
      const componentSelf = this
      const recallId = this.recallId
      const remedyId = this.recall.remedyId
      const payload = {
        recallId,
        remedyId,
        body: {
          description: this.model.description
        }
      }
      await this.remedyEditAction({ componentSelf, payload })
      this.$emit('remedy-edit-complete')
    }
  }
}
</script>

<style lang="scss">
#app {
  .remedy-edit-container {
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
