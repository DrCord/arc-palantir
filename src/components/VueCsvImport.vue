<template>
  <div class="vue-csv-uploader">
    <div class="form">
      <div class="form-group csv-import-file">
        <v-file-input
            v-model="csvUpload"
            type="file"
            :class="inputClass"
            name="csv"
            :error-messages="csvUploadErrorMessages"
            @change="fileChanged"
        >
          <v-icon
            v-if="csvUploadErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-file-input>
      </div>
    </div>
  </div>
</template>

<script>
import { every, forEach, get, isArray, map, set } from 'lodash'
import Papa from 'papaparse'
import mimeTypes from 'mime-types'

export default {
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    mapFields: {
      type: Array,
      default: () => ([]),
      required: true
    },
    callback: {
      type: Function,
      default: () => ({})
    },
    catch: {
      type: Function,
      default: () => ({})
    },
    finally: {
      type: Function,
      default: () => ({})
    },
    parseConfig: {
      type: Object,
      default () {
        return {}
      }
    },
    loadBtnText: {
      type: String,
      default: 'Next'
    },
    submitBtnText: {
      type: String,
      default: 'Submit'
    },
    autoMatchFields: {
      type: Boolean,
      default: false
    },
    autoMatchIgnoreCase: {
      type: Boolean,
      default: false
    },
    tableClass: {
      type: String,
      default: 'table'
    },
    checkboxClass: {
      type: String,
      default: 'form-check-input'
    },
    buttonClass: {
      type: String,
      default: 'btn btn-primary'
    },
    inputClass: {
      type: String,
      default: 'form-control-file'
    },
    validation: {
      type: Boolean,
      default: true
    },
    fileMimeTypes: {
      type: Array,
      default: () => {
        return ['text/csv', 'text/x-csv', 'application/vnd.ms-excel', 'text/plain']
      }
    },
    tableSelectClass: {
      type: String,
      default: 'form-control'
    },
    canIgnore: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    csv: null,
    csvUpload: null,
    fieldsToMap: [],
    fileSelected: false,
    headersMatchFail: null,
    isValidFileMimeType: false,
    form: {
      csv: null
    },
    map: {}
  }),
  computed: {
    csvUploadErrorMessages () {
      if (!this.fileSelected) {
        return null
      }
      if (!this.isValidFileMimeType) {
        return 'Invalid file type'
      }
      if (this.headersMatchFail) {
        return 'Unable to load data from CSV'
      }
      return null
    },
    disabledNextButton () {
      return !this.isValidFileMimeType
    }
  },
  watch: {
    csvUpload (newVal, oldVal) {
      this.headersMatchFail = null
      if (newVal && newVal !== oldVal) {
        this.load()
      }
    },
    map: {
      deep: true,
      handler: function (newVal) {
        const hasAllKeys = Array.isArray(this.mapFields)
          ? every(this.mapFields, function (item) {
            return Object.prototype.hasOwnProperty.call(newVal, item)
          })
          : every(this.mapFields, function (item, key) {
            return Object.prototype.hasOwnProperty.call(newVal, key)
          })

        if (hasAllKeys) {
          this.submit()
        }
      }
    },
    csv (newVal) {
      if (this.autoMatchFields) {
        if (newVal !== null) {
          this.fieldsToMap.forEach((field) => {
            newVal[0].forEach((columnName, index) => {
              if (this.autoMatchIgnoreCase === true) {
                if (field.label.toLowerCase().trim() === columnName.toLowerCase().trim()) {
                  this.$set(this.map, field.key, index)
                }
              } else {
                if (field.label.trim() === columnName.trim()) {
                  this.$set(this.map, field.key, index)
                }
              }
            })
          })
          // if no matching header row found then no data put into this.map
          if (this.map &&
            Object.keys(this.map).length === 0 &&
            Object.getPrototypeOf(this.map) === Object.prototype
          ) {
            this.$emit('headers-match-fail')
            this.headersMatchFail = true
          }
        }
      }
    },
    mapFields () {
      this.initializeFromProps()
    },
    fileSelected: {
      handler (newVal) {
        this.$emit('file-selected', newVal)
      }
    }
  },
  created () {
    this.initializeFromProps()
  },
  methods: {
    initializeFromProps () {
      if (isArray(this.mapFields)) {
        this.fieldsToMap = map(this.mapFields, (item) => {
          return {
            key: item,
            label: item
          }
        })
      } else {
        this.fieldsToMap = map(this.mapFields, (label, key) => {
          return {
            key: key,
            label: label
          }
        })
      }
    },
    submit () {
      const _this = this
      this.form.csv = this.buildMappedCsv()
      this.$emit('input', this.form.csv)
      _this.callback(this.form.csv)
    },
    buildMappedCsv () {
      const _this = this
      return map(this.csv, (row) => {
        const newRow = {}
        forEach(_this.map, (column, field) => {
          set(newRow, field, get(row, column))
        })
        return newRow
      })
    },
    fileChanged () {
      this.$emit('file-changed')
      this.validFileMimeType()
      const file = this.csvUpload
      this.fileSelected = !!file
    },
    validFileMimeType () {
      const file = this.csvUpload
      if (file) {
        const mimeType = file.type === '' ? mimeTypes.lookup(file.name) : file.type
        this.fileSelected = true
        this.isValidFileMimeType = this.validation ? this.validateMimeType(mimeType) : true
      } else {
        this.isValidFileMimeType = !this.validation
        this.fileSelected = false
      }
    },
    validateMimeType (type) {
      return this.fileMimeTypes.indexOf(type) > -1
    },
    load () {
      const _this = this
      this.readFile((output) => {
        _this.csv = get(Papa.parse(output, { skipEmptyLines: true }), 'data')
      })
    },
    readFile (callback) {
      const file = this.csvUpload
      if (file) {
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')

        reader.onload = (evt) => {
          const result = evt.target.result
          this.csv = result
          callback(result)
        }
        reader.onerror = () => {}
      }
    },
    makeId (id) {
      return `${id}${this._uid}`
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vue-csv-uploader {

    .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
  }
}
</style>
