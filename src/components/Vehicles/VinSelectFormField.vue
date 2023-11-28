<template>
  <div class="vin-select-form-field">
    <validate
      tag="div"
      class="vin"
      :class="{ prefix: environment !== 'prod' }"
    >
      <v-autocomplete
        v-model="vinLocal"
        name="vin"
        label="VIN"
        hide-details
        :prefix="vinPrefix"
        :items="vinsUnPrefixed"
        required
      />
    </validate>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VEHICLES_SUMMON } from '@/store/action-types'
import {
  VEHICLES_LIST,
  VEHICLES_WITH_AUTHORITIES_LIST
} from '@/lib/constants'
import {
  ACCESS_VEHICLES,
  ACCESS_VEHICLES_WITH_AUTHORITIES,
  ENVIRONMENT,
  ENVIRONMENT_VIN_PREFIX,
  VINS
} from '@/store/getter-types'

import utility from '@/lib/utility'

export default {
  name: 'VinSelectFormField',
  props: {
    vin: {
      default: null,
      type: String
    },
    inputVins: {
      default: () => [],
      type: Array
    }
  },
  computed: {
    ...mapGetters({
      environment: ENVIRONMENT,
      operatorCanAccessVehicles: ACCESS_VEHICLES,
      operatorCanAccessVehiclesWithAuthorities: ACCESS_VEHICLES_WITH_AUTHORITIES,
      vinPrefix: ENVIRONMENT_VIN_PREFIX,
      vins: VINS
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
    },
    vinsUnPrefixed () {
      if (this.inputVins.length) {
        return this.inputVins.map(vin => vin.replace(this.vinPrefix, ''))
      }
      return this.vins.map(vin => vin.replace(this.vinPrefix, ''))
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      vehiclesSummonAction: VEHICLES_SUMMON
    }),
    init () {
      if (!this.inputVins.length) {
        this.vehiclesSummon()
      }
    },
    vinUpdated (val) {
      this.$emit('value-updated', { itemName: 'vin', val })
    },
    vehiclesSummon (force = false) {
      const componentSelf = this
      const { operatorCanAccessVehicles, operatorCanAccessVehiclesWithAuthorities } = this
      let listType = 'fleets'
      if (operatorCanAccessVehiclesWithAuthorities) {
        listType = VEHICLES_WITH_AUTHORITIES_LIST
      } else if (operatorCanAccessVehicles) {
        listType = VEHICLES_LIST
      }
      this.vehiclesSummonAction({ componentSelf, listType, force })
    }
  }
}
</script>

<style lang="scss">
#app {
  .vin-select-form-field {
    margin: 0 auto 10px;
    width: auto;
    max-width: 400px;
    min-width: 130px;
    padding-top: 10px;
    label {
      &:after {
        color: red;
        content: " *";
      }
    }
    .prefix {
      display: flex;
      flex-wrap: wrap;
      label {
        margin-bottom: 0;
        top: 0.5px !important;
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
        padding: 5px 12px;
        position: relative;
        text-align: center;
        top: 0;
        width: auto;
      }
      .v-autocomplete {
        margin-top: 0;
        padding-top: 10px;
        .v-input__slot {
          &::before,
          &::after {
            border: none;
          }
        }
        input {
          font-weight: normal;
          margin-bottom: 0;
          padding: 6px 12px;
          position: relative;
          border: 1px solid #ccc;
          margin: 1px 0;
          border-radius: 0px 4px 4px 0px;
          display: inline-block;
          width: calc(99.6% - var(--prefixed-input-width));
        }
        .v-icon {
          &.mdi-menu-down,
          &.mdi-menu-up {
            cursor: pointer;
          }
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
  }
  &.theme--dark {
    .vin-select-form-field {
      .prefix {
        .v-text-field__prefix {
          background-color: #666;
          color: #eee;
        }
      }
      label {
        &:after {
          color: red;
          content: " *";
        }
      }
    }
  }
}
</style>
