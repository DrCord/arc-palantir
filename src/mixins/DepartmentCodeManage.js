
export default {
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
    availableDepartments () {
      const departmenCodeObjects = [...this.departmentCodes]
      return departmenCodeObjects.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))
    },
    formstatePristine () {
      return this.formstate.$pristine
    }
  },
  watch: {
    departmentCodeId: {
      handler (newVal) {
        if (newVal) {
          if (newVal) {
            this.setDepartmentCodeEnable(true)
            this.model.departmentCodeId = newVal
          } else {
            this.setDepartmentCodeEnable(false)
            this.model.departmentCodeId = null
          }
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    departmentEnableCodeToggled: function (toggleEvent) {
      if (!toggleEvent) {
        this.model.departmentCodeId = null
      }
    },
    setDepartmentCodeEnable (val) {
      this.model.departmentCodeEnable = val
    },
    async departmentCodesSummon () {
      const componentSelf = this
      await this.departmentCodesSummonAction({ componentSelf })
    },
    departmentCodeManageCancel () {
      this.$emit('department-code-manage-cancel')
    },
    getDepartmentCodeObjectFromId (id) {
      var departmentObject = {
        code: null,
        description: null
      }
      if (id) {
        departmentObject = this.availableDepartments.find(departmentObject => {
          return departmentObject.id === id
        })
      }
      return departmentObject
    }
  }
}
