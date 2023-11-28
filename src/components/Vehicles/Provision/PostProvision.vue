<template>
  <div v-if="provisionDataAvailable" class="post-provision">
    <h3>{{ provisionData.vin }} {{reprovision ? 'Re-' : null}}Provisioned</h3>
    <a
      id="downloadAnchorElement"
      :href="jsonDownload"
      download="identity.json"
      class="btn btn-info"
      >Download Identity File</a
    >
    <h4>PIN: {{ provisionData.pin }}</h4>
    <h4 v-if="modelName">Model: {{ modelName }}</h4>
    <h4>Model Release Id: {{ provisionData.model_release_id }}</h4>
    <div class="manufactured-options">
      <h5>Manufactured Options</h5>
      <ul>
        <li>
          <v-checkbox
            v-model="provisionData.options.heated_grips"
            label="Heated Grips"
            readonly
          />
        </li>
        <li>
          <v-checkbox
            v-model="provisionData.options.heated_seats"
            label="Heated Seats"
            readonly
          />
        </li>
        <li>
          <v-checkbox
            v-model="provisionData.managed_session_mode"
            label="Managed Session Mode"
            readonly
          />
        </li>
        <li>
          <v-checkbox
            v-model="provisionData.options.stereo_enabled"
            label="Stereo"
            readonly
          />
        </li>
      </ul>
    </div>
    <v-btn
        class="close-context"
        color="warning"
        type="button"
        @click="close"
      >Finish &amp; Close
      </v-btn>
  </div>
</template>

<script>
export default {
  name: 'VehiclePostProvision',
  props: {
    modelName: {
      default: null,
      type: String
    },
    provisionData: {
      default: () => {},
      type: Object
    },
    reprovision: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    jsonDownload () {
      if (this.provisionData.vin) {
        return 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.provisionData))
      }
      return '#'
    },
    provisionDataAvailable () {
      return Object.keys(this.provisionData).length > 0
    }
  },
  methods: {
    close () {
      this.$emit('close-context')
    }
  }
}
</script>

<style lang="scss">
#app {
  .post-provision {
    text-align: center;
    #downloadAnchorElement {
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 7px 16px;
      margin-bottom: 25px;
      margin-top:10px;
      text-transform: uppercase;
      &:hover {
        text-decoration: none;
      }
    }
    h4,
    h5 {
      padding-left: 15px;
      text-align: left;
    }
    h5 {
      font-size: 18px;
      margin-top: 25px;
      padding-left: 0;
    }
    .manufactured-options {
      padding-left: 15px;
      ul {
        list-style-type: none;
        padding-left: 0;
        .v-input--checkbox {
          margin-top: 0;
          padding-top: 0;
          label {
            margin-bottom: 0;
            margin-top: 1px;
          }
          .v-messages {
            display: none;
          }
        }
      }
    }
  }
}
</style>
