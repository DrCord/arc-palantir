<template>
  <div class="vin-text-input-form-field">
    <validate
      tag="div"
      class="vin form-field"
      :class="{ prefix: environment !== 'prod', valid: valid }"
      :custom="{
        vinCasingValidator: $vinValidator.validateCasing,
        vinChecksumValidator: function (value, attrValue, vnode) {
          return $vinValidator.validate(value)
        }
      }"
    >
          <v-text-field
            v-model="vinLocal"
            name="vin"
            label="VIN"
            :prefix="vinPrefix"
            hide-details
            dense
            required
          >
          <template v-slot:append>
            <v-tooltip bottom>
              <template #activator="{ on }">
                  <v-icon v-on='on' >mdi-information</v-icon>
              </template>
              <span>Vehicle Identification Numbers (VINs) contain a checksum to confirm validity</span>
            </v-tooltip>
            </template>
          </v-text-field>

      <field-messages name="vin" class="validation-msgs-container">
        <div v-show="!formstatePristine" slot="required">VIN is a required field</div>
        <div slot="vinChecksumValidator">VIN checksum failed</div>
        <div slot="vinCasingValidator">VIN must only contain uppercase letters</div>
      </field-messages>
    </validate>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ENVIRONMENT,
  ENVIRONMENT_VIN_PREFIX
} from '@/store/getter-types'

import utility from '@/lib/utility'

export default {
  name: 'VinTextInputFormField',
  props: {
    formstatePristine: {
      default: true,
      type: Boolean
    },
    valid: {
      default: false,
      type: Boolean
    },
    vin: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      environment: ENVIRONMENT,
      vinPrefix: ENVIRONMENT_VIN_PREFIX
    }),
    prefixedInputCssProps () {
      return utility.prefixedInputCssProps(this)
    },
    vinLocal: {
      get () { return this.vin },
      set (val) { this.vinUpdated(val) }
    },
    vinPrefixed () {
      return this.vinLocal ? `${this.vinPrefix}${this.vinLocal}` : this.vinLocal
    }
  },
  methods: {
    vinUpdated (val) {
      this.$emit('value-updated', { itemName: 'vin', val })
    }
  }
}
</script>

<style lang="scss">
#app {
  form {
    .vin-text-input-form-field {
      label {
        &:after {
          color: red;
          content: " *";
        }
      }
      .prefix {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        label {
          margin-bottom: 0;
          top: 0.5px;
        }
        .v-text-field__prefix {
          background-color: #eee;
          border: 1px solid #ccc;
          border-right: 0;
          border-radius: 4px 0px 0px 4px;
          color: #555;
          display: inline-block;
          height: 100%;
          font-size: 16px;
          font-weight: 400;
          padding: 5px 12px 5px;
          position: relative;
          text-align: center;
          top: 0;
          width: auto;
        }
        .v-input {
          margin-top: 0;
          padding-top: 15px;
          .v-input__slot {
            &::before,
            &::after {
              border: none;
            }
          }
          input {
            margin-bottom: 0;
            padding: 6px 12px;
            position: relative;
            border: 1px solid #ccc;
            margin: 0;
            border-radius: 0px 4px 4px 0px;
            display: inline-block;
            width: calc(99.6% - var(--prefixed-input-width));
          }
          .v-input__append-inner {
            cursor: pointer;
            position: absolute;
            left: 25px;
            top: -20px;
          }
          &:not(.v-input--is-focused) {
            label {
              left: 0 !important;
              top: 0.5px !important;
            }
          }
        }
        &.vf-field-pristine,
        &.vf-field-invalid {
          .v-input {
            label {
              font-size: 0.75rem;
              left: 0 !important;
              top: -20px !important;
            }
          }
          .v-input--is-focused {
            label {
              font-size: 16px;
              top: 0.5px !important;
            }
          }
        }
      }
      .validation-msgs-container {
        text-align: center;
      }
      .valid {
        .validation-msgs-container {
          display: none;
        }
      }
    }
  }
  &.theme--dark {
    form {
      .vin-select-form-field {
        .prefix {
          .v-text-field__prefix {
            background-color: #666;
            color: #eee;
          }
        }
        label {
          &.required {
            span.label {
              &:after {
                color: red;
                content: " *";
              }
            }
          }
        }
      }
    }
  }
}
</style>
