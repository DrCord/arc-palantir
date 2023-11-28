  <template>
  <div class="department-code-delete-container">
    <h3>Delete Department Code</h3>
    <h5>This action will remove the code from all linked departments.</h5>
    <vue-form :state="formstate" @submit.prevent>

      <div v-if="availableDepartmentCodes.length">
      <label for="departmentCodeDeleteId" class="required">Delete Department Code</label>
        <v-select ref="selected-code"
          v-model="model.departmentCodeDeleteId"
          :items="availableDepartmentCodes"
          name="departmentCodeDeleteId"
          :item-text="(row) => {return row.code + ' - ' + row.description;}"
          item-value="id"
          dense
          outlined
        ></v-select>
        <div class="btn-container">
          <v-btn
            class="cancel"
            color="error"
            dark
            @click="departmentCodeDeleteCancel"
          >Cancel<v-icon>mdi-close-circle</v-icon>
          </v-btn>
          <v-btn
            class="submit"
            color="success"
            type="button"
            :disabled="!model.departmentCodeDeleteId"
            @click="departmentCodeDeleteSubmit"
          >Delete Code<v-icon>mdi-delete-circle</v-icon>
          </v-btn>
        </div>
        <br />
      </div>

      <div v-else>
        <h4 v-if="loading">Loading Data...</h4>
      </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEETS_DEPARTMENT_CODE_DELETE,
  FLEETS_DEPARTMENT_CODES_SUMMON
} from '@/store/action-types'
import {
  LOADING,
  FLEETS_DEPARTMENT_CODES
} from '@/store/getter-types'

export default {
  name: 'DepartmentCodeDelete',
  data () {
    return {
      formstate: {},
      model: {
        departmentCode: null,
        departmentCodeDeleteId: null
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
    availableDepartmentCodes () {
      const departmentCodeObjects = this.departmentCodes.filter(departmentCodeObjects => {
        return departmentCodeObjects.id !== 1
      })
      departmentCodeObjects.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))
      return departmentCodeObjects
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      departmentCodeDeleteAction: FLEETS_DEPARTMENT_CODE_DELETE,
      departmentCodesSummonAction: FLEETS_DEPARTMENT_CODES_SUMMON
    }),
    init () {
      this.departmentCodesSummon()
    },
    async departmentCodesSummon () {
      const componentSelf = this
      await this.departmentCodesSummonAction({ componentSelf })
    },
    departmentCodeDeleteCancel () {
      this.$emit('department-code-delete-cancel')
    },
    async departmentCodeDeleteSubmit () {
      const componentSelf = this
      const departmentCodeDeleteId = this.model.departmentCodeDeleteId
      const payload = {
        id: departmentCodeDeleteId,
        code: this.getDepartmentCodeFromId(departmentCodeDeleteId),
        body: {}
      }
      await this.departmentCodeDeleteAction({ componentSelf, payload })
      this.model.departmentCodeDeleteId = null
      this.$refs['selected-code'].reset()
      this.departmentCodesSummon()
      this.$emit('department-code-delete-complete')
    },
    getDepartmentCodeFromId (id) {
      const departmentObject = this.availableDepartmentCodes.find(departmentObject => {
        return departmentObject.id === id
      })
      return departmentObject.code
    }

  }
}
</script>

<style lang="scss">
#app {
  .department-code-delete-container {
    form {
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
    }
    h3 {
      margin-bottom: 10px;
    }
    h5{
      font-size: smaller;
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
