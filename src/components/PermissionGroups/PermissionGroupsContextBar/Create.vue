<template>
  <div class="permission-group-create-container">
    <h3>Create Permission Group</h3>
    <vue-form :state="formstate" @submit.prevent>

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
        @click="permissionGroupCreate"
      >Create<v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { PERMISSION_GROUP_CREATE } from '@/store/action-types'

export default {
  name: 'PermissionGroupCreate',
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
      permissionGroupCreateAction: PERMISSION_GROUP_CREATE
    }),
    async permissionGroupCreate () {
      const componentSelf = this
      const name = this.model.name
      const payload = {
        body: {
          name
        }
      }
      await this.permissionGroupCreateAction({ componentSelf, payload })
      this.$emit('permission-group-create-complete')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .permission-group-create-container {
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
