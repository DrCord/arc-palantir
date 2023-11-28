<template>
  <div class="manufactured-options">
    <h4>Manufactured Options</h4>
    <div class="manufactured-option-heated-grips">
      <v-radio-group
        v-model="manufacturedOptionHeatedGripsLocal"
        name="manufactured-option-heated-grips"
        label="Heated Grips"
        hide-details
        row
      >
        <v-radio
          label="Enable"
          :value="true"
        />
        <v-radio
          label="Disable"
          :value="false"
        />
      </v-radio-group>
    </div>
    <div class="manufactured-option-heated-seats">
      <v-radio-group
        v-model="manufacturedOptionHeatedSeatsLocal"
        name="manufactured-option-heated-seats"
        label="Heated Seats"
        hide-details
        row
      >
        <v-radio
          label="Enable"
          :value="true"
        />
        <v-radio
          label="Disable"
          :value="false"
        />
      </v-radio-group>
    </div>
    <div class="managed-session-mode-enable">
      <v-radio-group
        v-model="managedSessionModeEnableLocal"
        name="managed-session-mode-enable"
        label="Managed Session Mode"
        hint="Enable for ALL Arcimoto owned or rental vehicles"
        persistent-hint
        row
      >
        <v-radio
          label="Enable"
          :value="true"
        />
        <v-radio
          label="Disable"
          :value="false"
        />
      </v-radio-group>
    </div>
    <div class="manufactured-option-stereo-enabled">
      <v-radio-group
        v-model="manufacturedOptionStereoEnabledLocal"
        name="manufactured-option-stereo-enabled"
        label="Stereo"
        hide-details
        row
      >
        <v-radio
          label="Enable"
          :value="true"
        />
        <v-radio
          label="Disable"
          :value="false"
        />
      </v-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProvisionFormManufacturedOptions',
  props: {
    managedSessionModeEnable: {
      default: null,
      type: Boolean
    },
    manufacturedOptionHeatedGrips: {
      default: null,
      type: Boolean
    },
    manufacturedOptionHeatedSeats: {
      default: null,
      type: Boolean
    },
    manufacturedOptionStereoEnabled: {
      default: null,
      type: Boolean
    }
  },
  computed: {
    managedSessionModeEnableLocal: {
      get () { return this.managedSessionModeEnable },
      set (val) { this.valueUpdated('managedSessionModeEnable', val) }
    },
    manufacturedOptionHeatedGripsLocal: {
      get () { return this.manufacturedOptionHeatedGrips },
      set (val) { this.valueUpdated('manufacturedOptionHeatedGrips', val) }
    },
    manufacturedOptionHeatedSeatsLocal: {
      get () { return this.manufacturedOptionHeatedSeats },
      set (val) { this.valueUpdated('manufacturedOptionHeatedSeats', val) }
    },
    manufacturedOptionStereoEnabledLocal: {
      get () { return this.manufacturedOptionStereoEnabled },
      set (val) { this.valueUpdated('manufacturedOptionStereoEnabled', val) }
    }
  },
  methods: {
    updateValue (event) {
      this[`${event.itemName}Local`] = event.val
    },
    valueUpdated (itemName, val) {
      this.$emit('value-updated', { itemName, val })
    }
  }
}
</script>

<style lang="scss">
#app {
  .manufactured-options {
    margin-top: 20px;
    padding: 0 10px 10px 10px;
    h4 {
      margin-bottom: 0;
    }
    .v-input {
      margin-top: 7px;
    }
    .v-input--checkbox {
      .v-input__slot {
        margin-bottom: 0;
      }
    }
    .v-input--radio-group {
      margin-bottom: 10px;
      .v-input--radio-group__input {
        display: flex;
        justify-content: space-between;
        .v-label {
          font-size: 1rem;
        }
        legend.v-label {
          font-size: 1rem;
        }
      }
    }
    label {
      margin-bottom: 0;
      margin-top: 1px;
    }
  }
}
</style>
