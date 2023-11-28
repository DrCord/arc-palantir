<template>
  <div class="department-code-create-container">
    <h3>Create Department Code</h3>
    <vue-form :state="formstate" @submit.prevent>
      <div class = "department-code">
      <validate tag="div" class="form-field">
        <label for="departmentCode" class="required">Add Department Code</label>
        <v-text-field
          id="department-code"
          v-model="model.departmentCode"
          name="departmentCode"
          type="text"
          required
          outlined
          :error-messages="departmentCodeErrorMessages"
        >
        <v-icon
            v-if="departmentCodeErrorMessages && !formstate.$pristine"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>

      <validate tag="div" class="form-field">
        <label for="departmentDescription" class="required">Add Department Description</label>
        <v-text-field
          id="department-description"
          v-model="model.departmentDescription"
          name="departmentDescription"
          type="text"
          required
          outlined
          :error-messages="departmentDescriptionErrorMessages"
        >
        <v-icon
            v-if="departmentDescriptionErrorMessages && !formstate.$pristine"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-text-field>
      </validate>

      <div class="btn-container">
        <v-btn
          class="cancel"
          color="error"
          dark
          @click="departmentCodeCreateCancel"
        >Cancel<v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          class="save"
          color="success"
          type="button"
          :disabled="saveButtonDisabled"
          @click="departmentCodeCreateSave"
        >Create Code<v-icon>mdi-delete-circle</v-icon>
        </v-btn>
      </div>
    </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEETS_DEPARTMENT_CODE_CREATE,
  FLEETS_DEPARTMENT_CODES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  FLEETS_DEPARTMENT_CODES
} from '@/store/getter-types'

export default {
  name: 'DepartmentCodeCreate',
  data () {
    return {
      formstate: {},
      model: {
        departmentCode: null,
        departmentDescription: null
      }
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      departmentCodes: FLEETS_DEPARTMENT_CODES
    }),
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    departmentCodeErrorMessages () {
      if (this.formstateUntouched) {
        return null
      }
      if (this.departmentCodeFound) {
        return 'Department Code must be unique'
      }
      if (!this.departmentCodeCorrectFormat) {
        return 'Department Code must be three or four digits (ex., 345, 8020, 088)'
      }
      return null
    },
    departmentDescriptionErrorMessages () {
      if (this.formstateUntouched) {
        return null
      }
      if (!this.departmentDescriptionCorrectFormat) {
        return 'Department Code must be alphnumeric and less than 64 characters '
      }
      return null
    },
    departmentCodeFound () {
      return this.departmentCodes.some(el => el.code === this.model.departmentCode)
    },
    departmentCodeCorrectFormat () {
      return (/^[0-9]{3,4}$/.test(this.model.departmentCode))
    },
    departmentDescriptionCorrectFormat () {
      return (/^[A-Za-z0-9_ ]{1,64}$/.test(this.model.departmentDescription))
    },
    departmentCodeErrorStateRequired () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { departmentCode } = formstate
      if (!departmentCode || departmentCode.$untouched) {
        return null
      }
      if (departmentCode.$invalid && departmentCode.$error.required) {
        return true
      }
      return null
    },
    saveButtonDisabled () {
      return this.formstate.$pristine ||
        this.formstate.$invalid ||
        this.departmentCodeErrorMessages !== null ||
        this.departmentDescriptionErrorMessages !== null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      departmentCodeCreateAction: FLEETS_DEPARTMENT_CODE_CREATE,
      departmentCodesSummonAction: FLEETS_DEPARTMENT_CODES_SUMMON
    }),
    init () {
      this.departmentCodesSummon()
    },
    async departmentCodesSummon () {
      const componentSelf = this
      await this.departmentCodesSummonAction({ componentSelf })
    },
    departmentCodeCreateCancel () {
      this.$emit('department-code-create-cancel')
    },
    async departmentCodeCreateSave () {
      const componentSelf = this
      const payload = {
        body: {
          code: this.model.departmentCode,
          description: this.model.departmentDescription
        }
      }
      await this.departmentCodeCreateAction({ componentSelf, payload })
      this.$emit('department-code-create-complete')
    }
  }
}
</script>

<style lang="scss">
#app {
  .department-code-create-container {
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
