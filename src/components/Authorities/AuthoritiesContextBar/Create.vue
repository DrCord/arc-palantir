<template>
  <div class="authority-create-container">
    <h3>Create Authority</h3>
    <vue-form :state="formstate">

      <validate tag="div" class="name form-field">
        <label for="name" class="required">Name</label>
        <v-text-field
          id="name"
          v-model="model.name"
          name="name"
          type="text"
          required
          outlined
          :error-messages="nameErrorMessages"
        >
          <v-icon
            v-if="nameErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>
    </vue-form>

    <div class="btn-container">
      <v-btn
        class="save"
        color="success"
        type="button"
        :disabled="formstate.$pristine || formstate.$invalid"
        @click="authorityCreate"
      >Create<v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { AUTHORITY_CREATE } from '@/store/action-types'

export default {
  name: 'AuthorityCreate',
  data () {
    return {
      formstate: {},
      model: {
        name: null
      }
    }
  },
  computed: {
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    nameErrorMessages () {
      if (this.nameErrorStateRequired) {
        return 'Name is required'
      }
      return null
    },
    nameErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { name } = formstate
      if (!name || name.$untouched) {
        return null
      }
      if (name.$invalid && name.$error.required) {
        return true
      }
      return null
    }
  },
  methods: {
    ...mapActions({
      authorityCreateAction: AUTHORITY_CREATE
    }),
    authorityCreate () {
      const componentSelf = this
      const { authorityCreateAction, model } = this
      const description = model.name
      const payload = {
        body: {
          description
        }
      }
      authorityCreateAction({ componentSelf, payload })
        .then(() => {
          this.$emit('authority-create-complete')
        })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .authority-create-container {
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
      }
    }
  }
}
</style>
