<template>
  <div class="ability-edit-container">
    <h3>Edit Ability</h3>
    <vue-form :state="formstate">

      <div class="abilities">
        <label for="abilities" class="required">Abilities</label>
        <v-select
          v-model="model.abilityId"
          dense
          name="abilities"
          :items="abilities"
          item-text="ability"
          item-value="id"
          required
          hide-details="auto"
          outlined
          @change="abilitySelected"
        ></v-select>
      </div>

      <div v-show="model.abilityId">
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
            deletable-chips
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
          :disabled="formstate.$invalid || !propChanged"
          color=success
          type="button"
          @click="abilityEdit"
        >Update<v-icon>mdi-update</v-icon>
        </v-btn>
      </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  PERMISSIONS_SUMMON,
  USERS_ABILITY_EDIT
} from '@/store/action-types'
import {
  ABILITIES,
  PERMISSIONS
} from '@/store/getter-types'

export default {
  name: 'AbilityEdit',
  data () {
    return {
      formstate: {},
      model: {
        abilityId: null,
        ability: null,
        constant: null,
        description: null,
        permissions: []
      }
    }
  },
  computed: {
    ...mapGetters({
      abilities: ABILITIES,
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
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { abilityName } = formstate
      if (!abilityName || abilityName.$pristine) {
        return null
      }
      if (abilityName.$invalid && abilityName.$error.excludedCharactersValidator) {
        return true
      }
      return null
    },
    abilityNameErrorStateMinLength () {
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { abilityName } = formstate
      if (!abilityName || abilityName.$pristine) {
        return null
      }
      if (abilityName.$invalid && abilityName.$error.minlength) {
        return true
      }
      return null
    },
    abilityNameErrorStateRequired () {
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { abilityName } = formstate
      if (!abilityName || abilityName.$pristine) {
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
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { abilityConstant } = formstate
      if (!abilityConstant || abilityConstant.$pristine) {
        return null
      }
      if (abilityConstant.$invalid && abilityConstant.$error.macroCaseValidator) {
        return true
      }
      return null
    },
    abilityConstantErrorStateRequired () {
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { abilityConstant } = formstate
      if (!abilityConstant || abilityConstant.$pristine) {
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
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { abilityDescription } = formstate
      if (!abilityDescription || abilityDescription.$pristine) {
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
      const { formstate, formstatePristine } = this
      if (formstatePristine) {
        return null
      }
      const { abilityPermissions } = formstate
      if (!abilityPermissions || abilityPermissions.$pristine) {
        return null
      }
      if (abilityPermissions.$invalid && abilityPermissions.$error.required) {
        return true
      }
      return null
    },
    abilityPropChanged () {
      const { selectedAbility, model } = this
      const { ability, abilityId } = model
      if (abilityId) {
        return selectedAbility.ability !== ability
      }
      return false
    },
    constantPropChanged () {
      const { selectedAbility, model } = this
      const { constant, abilityId } = model
      if (abilityId) {
        return selectedAbility.constant !== constant
      }
      return false
    },
    descriptionPropChanged () {
      const { selectedAbility, model } = this
      const { description, abilityId } = model
      if (abilityId) {
        return selectedAbility.description !== description
      }
      return false
    },
    formstatePristine () {
      if (this.formstate.$pristine) {
        return true
      }
      return false
    },
    permissionsPropChanged () {
      const { selectedAbility, model } = this
      const { permissions, abilityId } = model
      if (abilityId) {
        // abilities have to have a permission so must be edited
        if (!permissions.length) {
          return true
        }
        // if we don't know the permissions of the selected item can't compare
        if (!selectedAbility.permissions.length) {
          return false
        }
        const modelPermissionsArray = permissions.map(permission => {
          if (typeof permission === 'string') {
            return permission
          }
          return permission.permission
        }).sort()
        const selectedPermissionsArray = selectedAbility.permissions.map(permission => {
          return permission.permission
        }).sort()
        const arraysEqualLength = modelPermissionsArray.length === selectedPermissionsArray.length
        const modelAbilityContains = arraysEqualLength && modelPermissionsArray.every((value, index) => { return value === selectedPermissionsArray[index] })
        const selectedAbilityContains = arraysEqualLength && selectedPermissionsArray.every((value, index) => { return value === modelPermissionsArray[index] })
        return !(modelAbilityContains && selectedAbilityContains)
      }
      return false
    },
    propChanged () {
      const { abilityPropChanged, constantPropChanged, descriptionPropChanged, permissionsPropChanged } = this
      return abilityPropChanged ||
             constantPropChanged ||
             descriptionPropChanged ||
             permissionsPropChanged
    },
    abilityPermissionsWithResource () {
      const output = this.model.permissions.map(permission => {
        return { permission, resource: '*' }
      })
      return output
    },
    selectedAbility () {
      const { findAbility, model } = this
      const { abilityId } = model
      if (abilityId) {
        return findAbility(abilityId)
      }
      return false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      abilityEditAction: USERS_ABILITY_EDIT,
      permissionsSummonAction: PERMISSIONS_SUMMON
    }),
    init () {
      this.permissionsSummon()
    },
    abilityEdit () {
      const componentSelf = this
      const { abilityEditAction, model } = this
      const { ability, abilityId, constant, description } = model
      const payload = {
        abilityId,
        body: {
          abilityId,
          ability,
          constant,
          description,
          permissions: this.abilityPermissionsWithResource.map(item => item.permission)
        }
      }
      abilityEditAction({ componentSelf, payload })
        .then(() => {
          this.$emit('ability-edit-complete')
        })
    },
    abilitySelected (abilityId) {
      const { ability, constant, description, permissions } = this.findAbility(abilityId)
      this.model = {
        abilityId,
        ability,
        constant,
        description,
        permissions: JSON.parse(JSON.stringify(permissions))
      }
    },
    findAbility (abilityId) {
      return this.abilities.find(ability => ability.id === abilityId)
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
  .ability-edit-container {
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
        .v-icon {
          top: -4px;
          color: red;
        }
      }
    }
    .v-btn {
      margin-top: 0px;
    }
  }
}
</style>
