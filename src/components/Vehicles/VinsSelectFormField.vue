<template>
  <div class="vins-select-form-field-container">
    <div v-if="allowLoadFromCsvFile" class="load-from-csv-file">
      <v-switch
        v-model="loadFromCsv"
        label="Load VINs from CSV File"
      ></v-switch>
      <div v-if="loadFromCsv" class="load-from-csv-file-fields">
        <div v-if="!vinsFromCsv.length">
          <p>CSV file must contain a column with a header row containing the text "vin" and at least 1 subsequent row of the column containing a VIN.</p>
          <vue-csv-import
            v-model="dataFromCsv"
            auto-match-fields
            auto-match-fields-ignore-case
            headers
            load-btn-text="Load VINs from CSV"
            :map-fields="['vin']"
            show-error-message
            @file-changed="csvFileHeadersMatchFail = null"
            @file-selected="fileSelectedSet"
          >
            <template slot="thead"></template>
          </vue-csv-import>
        </div>
        <div v-if="vinsFromCsvNotAvailable.length" class="vins-from-csv-not-available">
          <h4>Unavailable VINs from CSV</h4>
          <ul>
            <li v-for="vin in vinsFromCsvNotAvailable" :key="vin">{{ vin }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="vins-select-form-field">
      <validate
        tag="div"
        class="vins"
      >
        <v-autocomplete
          v-model="vinsLocal"
          name="vins"
          label="VINs"
          multiple
          chips
          clearable
          deletable-chips
          :items="vinsList"
        >
          <template v-if="allowSelectAll" v-slot:prepend-item>
            <v-list-item
                ripple
                @click="selectAllToggle"
              >
                <v-list-item-action>
                  <v-icon :color="vinsSelected.length > 0 ? 'indigo darken-4' : ''">{{ icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Select All</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </template>
        </v-autocomplete>
      </validate>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueCsvImport from '@/components/VueCsvImport.vue'
import { VINS } from '@/store/getter-types'

export default {
  name: 'VinsSelectFormField',
  components: {
    VueCsvImport
  },
  props: {
    allowLoadFromCsvFile: {
      default: false,
      type: Boolean
    },
    allowSelectAll: {
      default: false,
      type: Boolean
    },
    vinsAvailable: {
      default: null,
      type: Array
    },
    vinsSelected: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {
      fileSelected: false,
      loadFromCsv: false,
      dataFromCsv: []
    }
  },
  computed: {
    ...mapGetters({
      vins: VINS
    }),
    allAvailableVehiclesSelected () {
      if (this.vinsAvailable) {
        return this.vinsSelected.length === this.vinsAvailable.length
      }
      return this.vinsSelected.length === this.vins.length
    },
    icon () {
      if (this.allAvailableVehiclesSelected) return 'mdi-close-box'
      if (this.someAvailableVehiclesSelected) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    someAvailableVehiclesSelected () {
      return this.vinsSelected.length > 0 && !this.allAvailableVehiclesSelected
    },
    vinsFromCsv () {
      const vinsFromCsv = [...this.dataFromCsv].map(item => item.vin)
      // knock off first element to remove header row text 'vin'
      vinsFromCsv.shift()
      return vinsFromCsv
    },
    vinsFromCsvAvailable () {
      return this.vinsFromCsv.filter(i => this.vinsList.includes(i))
    },
    vinsFromCsvNotAvailable () {
      return this.vinsFromCsv.filter(i => !this.vinsList.includes(i))
    },
    vinsList () {
      return this.vinsAvailable ? this.vinsAvailable : this.vins
    },
    vinsLocal: {
      get () { return this.vinsSelected },
      set (val) { this.vinsUpdated(val) }
    }
  },
  watch: {
    loadFromCsv: {
      handler (newVal) {
        if (newVal === false) {
          this.resetLoadFromCsv()
        }
      },
      immediate: true
    },
    vinsFromCsvAvailable: {
      handler (newVal) {
        if (newVal && newVal.length) {
          this.vinsLocal = newVal
        }
      },
      immediate: true
    }
  },
  methods: {
    fileSelectedSet (event) {
      this.fileSelected = event
    },
    resetLoadFromCsv () {
      this.dataFromCsv = []
    },
    selectAllToggle () {
      this.$nextTick(() => {
        if (this.allAvailableVehiclesSelected || this.someAvailableVehiclesSelected) {
          this.vinsLocal = []
        } else {
          this.vinsLocal = this.vinsAvailable ? this.vinsAvailable.slice() : this.vins.slice()
        }
      })
    },
    vinsUpdated (val) {
      this.$emit('vins-updated', val)
    }
  }
}
</script>

<style lang="scss">
#app {
  .vins-select-form-field-container {
    margin-top: 10px;
    .vins-select-form-field {
      label {
        &:after {
          color: red;
          content: " *";
        }
      }
      .v-select__selections {
        .v-chip {
          margin-bottom: 2px;
          margin-top: 2px;
          .v-icon {
            top: -5px;
            color: red;
          }
        }
      }
    }
    .load-from-csv-file {
      margin-bottom: 20px;
      .load-from-csv-file-fields {
        border: 2px solid #555;
        border-radius: 10px;
        margin-left: 20px;
        margin-right: 40px;
        padding: 15px;
        .form-group {
          &:last-of-type {
            margin-bottom: 0;
          }
        }
        .vue-csv-uploader {
          input[type="file"] {
              font-size: 1rem;
            }
          .btn-container {
            margin-bottom: 0;
          }
        }
        .vins-from-csv-not-available {
          margin-top: 0;
          h4 {
            text-align: center;
            color: red;
            font-size: 1.1rem;
            text-shadow: 1px 1px 2px #000;
          }
          ul {
            margin-bottom: 0;
            list-style-type: disc;
            margin-left: 10px;
          }
        }
        .csv-unable-to-load {
          margin-top: 10px;
          h4 {
            text-align: left;
            color: red;
            font-size: 1.1rem;
            text-shadow: 1px 1px 2px #000;
          }
        }
        .invalid-feedback {
          margin-top: 10px;
          color: red;
          font-size: 1.1rem;
          text-shadow: 1px 1px 2px #000;
        }
      }
    }
  }
  &.theme--dark {
    .vins-select-form-field-container {
      .load-from-csv-file {
        .load-from-csv-file-fields {
          background-color: #666;
          .vue-csv-uploader {
            input[type="file"] {
              color: #0093D8;
              text-shadow: 1px 1px 2px #000;
            }
          }
        }
      }
    }
  }
}
</style>
