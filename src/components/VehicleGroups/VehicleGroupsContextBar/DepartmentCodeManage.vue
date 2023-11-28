<template>
  <div class="department-code-manage-container">
    <h3>Manage Department Codes</h3>
    <vue-form :state="formstate" @submit.prevent>
        <div class="department-enable">
          <validate tag="div" class="department-enable">
            <div class="field top">
              <label for="department-enable">
                <span v-if="model.departmentCodeEnable">Enable</span><span v-else>Disable</span>
                Department Code
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
                <v-select
                  v-model="model.departmentCodeId"
                  :items="availableDepartments"
                  item-value="id"
                  :item-text="(row) => {return row.code + ' - ' + row.description;}"
                  label="Department Code"
                  name="departmentCode"
                  outlined
                  hide-details
                  dense
                  :disabled="!model.departmentCodeEnable"
                  placeholder="Department Code"
                ></v-select>
            </div>
          </div>
        </div>
      </div>

      <div v-if="availableFleets.length">
        <div class="department-code form-field">
          <v-autocomplete
            v-model="fleetObjects"
            :items="availableFleets"
            item-text="name"
            clearable
            deletable-chips
            dense
            label="Fleets"
            multiple
            no-data-text="No Fleets To Add"
            open-on-clear
            outlined
            return-object
            small-chips
          ></v-autocomplete>
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
          @click="setAllCodes"
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
  FLEETS_DEPARTMENT_CODES_SUMMON,
  FLEETS_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  FLEETS,
  FLEETS_DEPARTMENT_CODES
} from '@/store/getter-types'

import DepartmentCodeManage from '@/mixins/DepartmentCodeManage.js'

export default {
  name: 'DepartmentCodeManage',
  mixins: [DepartmentCodeManage],
  data () {
    return {
      formstate: {},
      model: {
        departmentCodeEnable: false,
        departmentCodeId: null
      },
      fleetObjects: [],
      submitDisabled: false
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      fleets: FLEETS,
      departmentCodes: FLEETS_DEPARTMENT_CODES
    }),
    availableFleets () {
      const fleets = this.fleets.filter(fleet => {
        return fleet.id !== 1
      })
      fleets.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      return fleets
    },
    formInvalid () {
      const { model } = this
      if (this.fleetObjects.length < 1 || this.submitDisabled) {
        return true
      }
      if (!model.departmentCodeId && model.departmentCodeEnable) {
        return true
      }
      return false
    },
    departmentCodeId () {
      return this.model.departmentCodeId
    }
  },
  methods: {
    ...mapActions({
      departmentCodeSetAction: FLEETS_DEPARTMENT_CODE_SET,
      departmentCodesSummonAction: FLEETS_DEPARTMENT_CODES_SUMMON,
      fleetsSummonAction: FLEETS_SUMMON
    }),
    init () {
      this.departmentCodesSummon()
      this.fleetsSummon()
    },
    setAllCodes () {
      this.submitDisabled = true
      this.fleetObjects.forEach((fleet) => this.departmentCodeSet(fleet.id))
      this.$emit('department-code-manage-complete')
      this.submitDisabled = false
    },
    async departmentCodeSet (id) {
      const componentSelf = this
      const departmentCodeObject = this.getDepartmentCodeObjectFromId(this.model.departmentCodeId)
      const payload = {
        fleetId: id,
        body: {
          accounting_department_code_id: this.model.departmentCodeId,
          code: departmentCodeObject.code,
          description: departmentCodeObject.description
        }
      }
      await this.departmentCodeSetAction({ componentSelf, payload })
    },
    async fleetsSummon () {
      const componentSelf = this
      await this.fleetsSummonAction({ componentSelf })
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
      .top {
        margin-top: 3rem
      }
    }
    h3 {
      margin-bottom: 0px;
      white-space: nowrap;
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
