<template>
  <div class="firmware-sync-confirm">
    <b>Important</b>
    <p>Provisioning sets the selected model release firmware versions as the vehicle firmware versions in the database.</p>
    <p>Before proceeding verify that all vehicle firmware is updated to the model release selected.</p>
    <validate>
      <v-checkbox
        v-model="firmwareSyncConfirmLocal"
        label="Vehicle Firmware Synchronized"
        name="firmware-sync-confirm"
        required
      />
    </validate>
  </div>
</template>

<script>
export default {
  name: 'ProvisionFormFirmwareSyncConfirm',
  props: {
    firmwareSyncConfirm: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    firmwareSyncConfirmLocal: {
      get () { return this.firmwareSyncConfirm },
      set (val) { this.valueUpdated(val) }
    }
  },
  methods: {
    valueUpdated (val) {
      this.$emit('value-updated', { itemName: 'firmwareSyncConfirm', val })
    }
  }
}
</script>

<style lang="scss">
#app {
  .firmware-sync-confirm {
    font-size: 0.9rem;
    margin-top: 20px;
    b {
      color: red;
      font-size: 1.2rem;
      font-weight: bold;
    }
    p {
      line-height: 20px;
      margin-bottom: 5px;
      font-weight: normal;
    }
    .v-input {
      margin-top: 7px;
      padding: 0 10px 10px 10px;
    }
    .v-input--checkbox {
      .v-input__slot {
        margin-bottom: 0;
      }
    }
    label {
      margin-bottom: 0;
      margin-top: 1px;
    }
  }
  &.theme--dark {
    p {
      color: lightgrey
    }
  }
}
</style>
