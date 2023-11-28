export default {
  methods: {
    copyToClipboard (copyTarget) {
      this.$clipboard(copyTarget)
    }
  }
}
