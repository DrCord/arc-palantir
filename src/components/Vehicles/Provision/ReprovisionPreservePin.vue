<template>
  <div class="reprovision-preserve-pin">
    <v-checkbox
      v-model="preservePin"
      label="Preserve Existing PIN"
      name="reprovision-preserve-pin"
      @click="preservePinClicked"
    />
  </div>
</template>

<script>
export default {
  name: 'ReprovisionPreservePin',
  data () {
    return {
      preservePin: true
    }
  },
  methods: {
    preservePinClicked () {
      this.$emit('preserve-pin', this.preservePin)
    }
  }
}
</script>

<style lang="scss">
#app {
  .reprovision-preserve-pin {
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
