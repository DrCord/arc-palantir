export default {
  computed: {
    vehicle () {
      return this.vin ? this.vehicleGet(this.vin) : null
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : null
    },
    vehicleModel () {
      return this.vin && this.vehicleLoaded ? this.vehicleModelGet(this.vin) : null
    },
    vehicleModelRelease () {
      return this.vin && this.vehicleLoaded ? this.vehicleModelReleaseGet(this.vin) : null
    },
    vehicleModelReleaseDescription () {
      const { vehicleLoaded, vehicleModel, vehicleModelRelease, vin } = this
      if (!vin || !vehicleLoaded || !vehicleModelRelease || !vehicleModelRelease.modelReleaseDescription) {
        return null
      }
      return vehicleModelRelease.modelReleaseDescription.replace(`${vehicleModel}: `, '')
    },
    vehicleModelInfo () {
      const { vehicleModel, vehicleModelReleaseDescription, vin } = this
      return vin && vehicleModelReleaseDescription ? `${vehicleModel} [${vehicleModelReleaseDescription}]` : null
    }

  }

}
