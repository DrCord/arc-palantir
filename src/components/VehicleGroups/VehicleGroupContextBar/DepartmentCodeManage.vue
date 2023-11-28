<template>
  <div class="department-code-manage-container">
    <h3>Link Department Code</h3>
    <vue-form :state="formstate" @submit.prevent>
        <div class="department-enable">
          <validate tag="div" class="department-enable">
            <div class="field">
              <label for="department-enable">
                Enable Department Code
              </label>
              <v-switch
                id="department-enable"
                v-model="model.departmentCodeEnable"
                name="department-enable"
                type="checkbox"
                @change="departmentEnableCodeToggled"
              />
            </div>
          </validate>
        </div>
      <div v-if="availableDepartments.length">
        <div class="department-code form-field">
          <div class="field">
            <div class="label">
              <validate tag="div" class="department-code">
                <label for="department-code">Department Code</label>
                <v-tooltip bottom>
                  <template #activator="{ on }">
                      <v-icon v-on='on'>mdi-information</v-icon>
                  </template>
                  <span>Department Code used by Accounting</span>
                </v-tooltip>
                <v-select
                  v-model="model.departmentCodeId"
                  :items="availableDepartments"
                  item-value="id"
                  :item-text="(row) => {return row.code + ' - ' + row.description;}"
                  name="departmentCode"
                  outlined
                  hide-details
                  dense
                  :disabled="!model.departmentCodeEnable"
                  :placeholder="!model.departmentCodeEnable ? 'DISABLED' : ''"
                ></v-select>
              </validate>
            </div>
          </div>
        </div>
      </div>

      <div class="btn-container">
        <v-btn
          class="cancel"
          color="error"
          dark
          @click="departmentCodeManageCancel"
        >Cancel<v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          class="save"
          color="success"
          type="button"
          :disabled="formInvalid"
          @click="departmentCodeSet"
        >Update<v-icon>mdi-update</v-icon>
        </v-btn>
      </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEETS_DEPARTMENT_CODE_SET,
  FLEETS_DEPARTMENT_CODES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  FLEET,
  FLEETS_DEPARTMENT_CODES
} from '@/store/getter-types'

import DepartmentCodeManage from '@/mixins/DepartmentCodeManage.js'

export default {
  name: 'DepartmentCodeManage',
  mixins: [DepartmentCodeManage],
  props: {
    departmentId: {
      type: Number,
      default: null
    },
    fleetId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      formstate: {},
      model: {
        departmentCodeEnable: false,
        departmentCodeId: null
      }
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      fleetGet: FLEET,
      departmentCodes: FLEETS_DEPARTMENT_CODES
    }),
    formInvalid () {
      const { model } = this
      // if still initial state - invalid
      if (!this.departmentCodeId) {
        // has set enable and department code - valid
        if (model.departmentCodeId && model.departmentCodeEnable) {
          return false
        }
        return true
      }
      // already had department code - changed code - valid
      if (this.departmentCodeId) {
        if (model.departmentCodeId && this.departmentCodeId !== model.departmentCodeId) {
          if (model.departmentCodeEnable) {
            return false
          }
        }
      }
      // if departmentCode enabled but no code set - invalid
      if (!model.departmentCodeId && model.departmentCodeEnable) {
        return true
      }
      // had department code to start, disabled departmentCodeEnable - valid
      if (this.departmentCodeId && !model.departmentCodeEnable) {
        return false
      }
      // default invalid
      return true
    },
    departmentCodeId () {
      if (this.departmentCode) {
        const deparmentCodeObjects = [...this.departmentCodes]
        var departmentCode = deparmentCodeObjects.find(item => item.code === this.fleet.code)
        if (departmentCode) {
          return departmentCode.id
        }
      }
      return null
    },
    fleet () {
      return this.fleetId ? this.fleetGet(this.fleetId) : null
    },
    departmentCode () {
      return this.fleet ? this.fleet.code : null
    },
    department () {
      return this.departmentId ? this.departmentGet(this.departmentId) : null
    }
  },
  methods: {
    ...mapActions({
      departmentCodeSetAction: FLEETS_DEPARTMENT_CODE_SET,
      departmentCodesSummonAction: FLEETS_DEPARTMENT_CODES_SUMMON
    }),
    init () {
      this.departmentCodesSummon()
      this.model.departmentCodeId = this.departmentCodeId
    },
    async departmentCodeSet () {
      const componentSelf = this
      const departmentCodeObject = this.getDepartmentCodeObjectFromId(this.model.departmentCodeId)
      const payload = {
        fleetId: this.fleetId,
        body: {
          accounting_department_code_id: this.model.departmentCodeId,
          code: departmentCodeObject.code,
          description: departmentCodeObject.description
        }

      }
      await this.departmentCodeSetAction({ componentSelf, payload })
      this.$emit('department-code-manage-complete')
    }
  }
}
</script>

<style lang="scss">
#app {
  .department-code-manage-container {
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
