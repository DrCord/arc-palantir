import * as requestsLib from './requests'

const requests = {
  ...requestsLib.default,
  firmwareComponentsGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/firmware/components`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  firmwareVersionsGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/firmware/version`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  modelReleaseGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/model-releases/${data.id}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  modelReleaseCreate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/model-releases`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  modelReleasesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/model-releases`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  modelReleasePartSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/parts/${data.id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  modelsGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/models`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  telemetryMetricsKeysGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/metrics`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  telemetryMetricsVersionGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/metrics/${data.versionId}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  vehiclesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  vehiclesTelemetryGet (vins, telemetryPoints, data) {
    const querystring = `vins=${vins.join()}&telemetry_points=${telemetryPoints.join()}`
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/telemetry?${querystring}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  vehiclesWithAuthoritiesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/authorities`
    }
    return this.axiosRequest(data, nextRequestBody)
  }
}

export default requests
