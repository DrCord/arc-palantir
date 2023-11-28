<template>
  <div class="file-reader-container">
    <label class="file-reader" for="file" :class="{ required: required, valid: valid }">
      <span v-if="label" class="label">{{ label }}</span>
      <v-file-input
        type="file"
        name="file"
        hide-details
        :required="required"
        @change="loadTextFromFile"
      />
    </label>
    <div class="validation-msgs-container">
      <div v-show="!pristine && !valid">
        File is a required field
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileReader',
  props: {
    triggerReset: {
      default: false,
      type: Boolean
    },
    allowedFileTypes: {
      default: () => ['text/plain'],
      type: Array
    },
    required: {
      default: true,
      type: Boolean
    },
    label: {
      default: 'File',
      type: String
    },
    showValidation: {
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      fileName: null,
      fileType: null,
      pristine: true,
      valid: null
    }
  },
  computed: {
    fileTypeAllowed: function () {
      return this.allowedFileTypes.includes(this.fileType)
    }
  },
  watch: {
    triggerReset: function (newVal, oldVal) {
      if (newVal !== oldVal && newVal === true) {
        this.$refs.file.value = ''
        this.fileType = null
        this.fileName = null
        this.$emit('reset')
        this.pristine = true
      }
    },
    fileTypeAllowed: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.valid = newVal
        this.$emit('valid', newVal)
      }
    },
    pristine: function (newVal, oldVal) {
      if (newVal !== oldVal && newVal === false) {
        this.$emit('touched')
      }
    }
  },
  methods: {
    loadTextFromFile (event) {
      if (!event) {
        this.fileType = null
        this.fileName = null
        this.$emit('empty')
        this.pristine = false
        return
      }
      const file = event
      this.fileType = file.type
      this.fileName = file.name

      const reader = new FileReader()
      reader.onload = e => {
        const payload = {
          content: e.target.result,
          filename: this.fileName,
          fileType: this.fileType
        }
        this.$emit('load', payload)
        this.pristine = false
      }
      reader.readAsText(file)
    }
  }
}
</script>

<style lang="scss">
#app {
  form {
    .file-reader-container {
      margin-bottom: 20px;
      .file-reader {
        display: block;
        &.required {
          &:after {
            color: transparent;
            content: "";
            font-size: 0;
            width: 0;
          }
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
</style>
