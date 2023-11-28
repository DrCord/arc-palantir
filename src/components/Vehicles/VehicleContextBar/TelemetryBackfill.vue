<template>
  <div class="vehicle-telemetry-backfill-container">
    <h3>Telemetry Backfill</h3>
    <div class="file-reader-container">
      <FileReader
        label="Backfill Text File"
        :trigger-reset="resetFileFormField"
        @load="fileLoaded"
        @empty="fileEmpty"
        @reset="resetFileFormFieldTriggered"
        @touched="fileInputTouched"
        @valid="fileReaderValidation"
      ></FileReader>
      <div class="btn-container">
        <v-btn
          :disabled="!fileReaderValid"
          color=success
          @click="telemetryBackfillInitiate"
        >Backfill</v-btn>
      </div>
    </div>
    <div>
      <ul>
        <li>You will be notified via email when your backfill request is complete.</li>
        <li>Depending on the size request, completion of the data ingestion could take from a few seconds upwards.</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  VEHICLE_TELEMETRY_BACKFILL_PRESIGN_UPLOAD,
  VEHICLE_TELEMETRY_BACKFILL_PROCESS
} from '@/store/action-types'

import errors from '@/lib/errors'
import FileReader from '@/components/FileReader'
import utilityLib from '@/lib/utility'
import utilityStore from '@/store/utility'

export default {
  name: 'VehicleTelemetryBackfill',
  components: {
    FileReader
  },
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      model: {
        fileContent: null,
        filename: null
      },
      presignedURL: null,
      resetFileFormField: false,
      fileReaderValid: false,
      fileReaderPristine: true
    }
  },
  methods: {
    ...mapActions({
      vehicleTelemetryBackfillPresignUploadAction: VEHICLE_TELEMETRY_BACKFILL_PRESIGN_UPLOAD,
      vehicleTelemetryBackfillProcessAction: VEHICLE_TELEMETRY_BACKFILL_PROCESS
    }),
    telemetryBackfillInitiate () {
      this.handleRequests()
    },
    async handleRequests () {
      const componentSelf = this
      const payload = {
        body: {
          file_name: this.model.filename
        }
      }
      this.presignedURL = await this.vehicleTelemetryBackfillPresignUploadAction({ componentSelf, payload })

      utilityStore.setLoadingAndToast(componentSelf, true, null, 'Uploading to S3')
      /* eslint-disable prefer-const */
      this.s3PresignedUpload(this.presignedURL, this.model.fileContent)
        .then(() => {
          utilityStore.setLoadingAndToast(componentSelf, false, null, 'Upload Finished')
          this.startProcessing()
        })
        .catch(e => {
          utilityStore.setLoadingAndToast(componentSelf, false, null, null)
          errors.handleAxiosRequestError(this, 'Upload Failed')
        })
    },
    s3PresignedUpload (presignedPostData, file) {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        Object.keys(presignedPostData.fields).forEach(key => {
          formData.append(key, presignedPostData.fields[key])
        })
        // Actual file has to be appended last
        formData.append('file', file)
        const xhr = new XMLHttpRequest()
        xhr.open('POST', presignedPostData.url, true)
        xhr.send(formData)
        xhr.onload = function () {
          this.status === 204 ? resolve() : reject(this.responseText)
        }
      })
    },
    showToast (config) {
      utilityLib.messageSet(this, config.msg, config.icon, config.duration, config.className)
    },
    async startProcessing () {
      const componentSelf = this
      const payload = {
        vin: this.vin,
        body: {
          file_name: this.model.filename,
          file_length: Buffer.byteLength(this.model.fileContent, 'utf8')
        }
      }
      await this.vehicleTelemetryBackfillProcessAction({ componentSelf, payload })
      this.resetFileFormField = true
      this.fileReaderPristine = true
      this.$emit('vehicle-telemetry-backfill-complete')
    },
    fileLoaded (event) {
      this.model.fileContent = event.content
      this.model.filename = event.filename
    },
    fileEmpty () {
      this.model.fileContent = null
      this.model.filename = null
    },
    resetFileFormFieldTriggered () {
      this.resetFileFormField = false
    },
    fileReaderValidation (valid) {
      this.fileReaderValid = valid
    },
    fileInputTouched () {
      this.fileReaderPristine = false
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-telemetry-backfill-container {
    h3 {
      margin-bottom: 20px;
    }
    .file-reader-container {
      .btn-container {
        display: flex;
        justify-content: flex-end;
        margin-right: 30px;
        margin-bottom: 20px;
      }
    }
    li {
      font-size: 1rem;
      margin-bottom: 10px;
    }
  }
}
</style>
