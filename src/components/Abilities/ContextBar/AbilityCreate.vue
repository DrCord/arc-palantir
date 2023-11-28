<template>
  <div class="ability-create-container">
    <h3>Create Ability</h3>
    <vue-form :state="formstate">

      <validate
        tag="div"
        class="ability-name"
        :custom="{
          excludedCharactersValidator: function (value, attrValue, vnode) {
            // only allows uppercase/lowercase letters, numbers, space and dash
            return !(/[^a-zA-Z0-9\- ]/.test(value))
          }
        }"
      >
        <label for="abilityName" class="required">Name</label>
        <v-text-field
          id="abilityName"
          v-model="model.ability"
          name="abilityName"
          type="text"
          required
          minlength="6"
          maxlength="70"
          outlined
          :error-messages="abilityNameErrorMessages"
        >
        <v-icon
            v-if="abilityNameErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>

      <validate
        tag="div"
        class="ability-constant"
        :custom="{
          macroCaseValidator: function (value, attrValue, vnode) {
            // only allows uppercase letters and underscore
            return !(/[^A-Z_]/.test(value))
          }
        }"
      >
        <label for="abilityConstant" class="required">Constant</label>
        <v-text-field
          id="abilityConstant"
          v-model="model.constant"
          name="abilityConstant"
          type="text"
          required
          outlined
          :error-messages="abilityConstantErrorMessages"
        >
        <v-icon
            v-if="abilityConstantErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>

      <validate tag="div" class="ability-description">
        <label for="abilityDescription" class="required">Description</label>
        <v-textarea
          id="abilityDescription"
          v-model="model.description"
          name="abilityDescription"
          rows="1"
          auto-grow
          required
          outlined
          :error-messages="abilityDescriptionErrorMessages"
        >
        <v-icon
            v-if="abilityDescriptionErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-textarea>
      </validate>

      <validate tag="div" class="ability-permissions">
        <label for="abilityPermissions" class="required">Permissions</label>
        <v-select
          v-model="model.permissions"
          dense
          multiple
          chips
          name="abilityPermissions"
          :items="permissions"
          item-text="permission"
          item-value="permission"
          required
          outlined
          :error-messages="abilityPermissionsErrorMessages"
        >
        <!-- this ignores permission => resource,
        this is fine while we always use * as we currently do,
        if that changes this needs to change as well -->
        <v-icon
            v-if="abilityPermissionsErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-select>
      </validate>

      <v-btn
        :disabled="!formstate.$valid"
        color=success
        type="button"
        @click="abilityCreate"
      >Create<v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  PERMISSIONS_SUMMON,
  USERS_ABILITY_CREATE
} from '@/store/action-types'
import { PERMISSIONS } from '@/store/getter-types'

export default {
  name: 'AbilityCreate',
  data () {
    return {
      formstate: {},
      model: {
        ability: null,
        constant: null,
        description: null,
        permissions: []
      }
    }
  },
  computed: {
    ...mapGetters({
      permissions: PERMISSIONS
    }),
    abilityNameErrorMessages () {
      if (this.abilityNameErrorStateInvalidChars) {
        return 'Alphanumeric and dash characters only'
      }
      if (this.abilityNameErrorStateMinLength) {
        return 'Minimum length is 6 characters'
      }
      if (this.abilityNameErrorStateRequired) {
        return 'Name is required'
      }
      return null
    },
    abilityNameErrorStateInvalidChars () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { abilityName } = formstate
      if (!abilityName || abilityName.$untouched) {
        return null
      }
      if (abilityName.$invalid && abilityName.$error.excludedCharactersValidator) {
        return true
      }
      return null
    },
    abilityNameErrorStateMinLength () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { abilityName } = formstate
      if (!abilityName || abilityName.$untouched) {
        return null
      }
      if (abilityName.$invalid && abilityName.$error.minlength) {
        return true
      }
      return null
    },
    abilityNameErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { abilityName } = formstate
      if (!abilityName || abilityName.$untouched) {
        return null
      }
      if (abilityName.$invalid && abilityName.$error.required) {
        return true
      }
      return null
    },
    abilityConstantErrorMessages () {
      if (this.abilityConstantErrorStateInvalidCase) {
        return 'Constant must be MACRO_CASE'
      }
      if (this.abilityConstantErrorStateRequired) {
        return 'Constant is required'
      }
      return null
    },
    abilityConstantErrorStateInvalidCase () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { abilityConstant } = formstate
      if (!abilityConstant || abilityConstant.$untouched) {
        return null
      }
      if (abilityConstant.$invalid && abilityConstant.$error.macroCaseValidator) {
        return true
      }
      return null
    },
    abilityConstantErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { abilityConstant } = formstate
      if (!abilityConstant || abilityConstant.$untouched) {
        return null
      }
      if (abilityConstant.$invalid && abilityConstant.$error.required) {
        return true
      }
      return null
    },
    abilityDescriptionErrorMessages () {
      if (this.abilityDescriptionErrorStateRequired) {
        return 'Description is required'
      }
      return null
    },
    abilityDescriptionErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { abilityDescription } = formstate
      if (!abilityDescription || abilityDescription.$untouched) {
        return null
      }
      if (abilityDescription.$invalid && abilityDescription.$error.required) {
        return true
      }
      return null
    },
    abilityPermissionsErrorMessages () {
      if (this.abilityPermissionsErrorStateRequired) {
        return 'Permission is required'
      }
      return null
    },
    abilityPermissionsErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { abilityPermissions } = formstate
      if (!abilityPermissions || abilityPermissions.$untouched) {
        return null
      }
      if (abilityPermissions.$invalid && abilityPermissions.$error.required) {
        return true
      }
      return null
    },
    abilityPermissionsWithResource () {
      const output = this.model.permissions.map(permission => {
        return { permission, resource: '*' }
      })
      return output
    },
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      abilityCreateAction: USERS_ABILITY_CREATE,
      permissionsSummonAction: PERMISSIONS_SUMMON
    }),
    abilityCreate () {
      const { abilityCreateAction, abilityPermissionsWithResource, model } = this
      const { ability, constant, description } = model
      const componentSelf = this
      const payload = {
        body: {
          ability,
          constant,
          description,
          permissions: abilityPermissionsWithResource
        }
      }
      abilityCreateAction({ componentSelf, payload })
        .then(() => {
          this.$emit('ability-create-complete')
        })
    },
    init () {
      this.permissionsSummon()
    },
    permissionsSummon () {
      const { permissionsSummonAction } = this
      const componentSelf = this
      const force = false
      permissionsSummonAction({ componentSelf, force })
    }
  }
}
</script>

<style lang="scss">
#app {
  .ability-create-container {
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
    .v-select__selections {
      .v-chip {
        margin-bottom: 2px;
        margin-top: 2px;
      }
    }
    .v-btn {
      margin-top: 0px;
    }
  }
}
</style>
