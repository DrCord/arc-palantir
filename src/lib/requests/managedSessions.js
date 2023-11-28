import * as requestsLib from './requests'
const requests = {
  ...requestsLib.default,
  managedSessionGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/managed-sessions/${data.id}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  managedSessionsGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/managed-sessions`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  managedSessionTelemetryGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/managed-sessions/${data.id}/telemetry`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  vehicleManagedSessionEnd (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/managed-sessions/end`,
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  vehicleManagedSessionStart (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/managed-sessions/start`,
      body: {
        ...data.body // expected: pin
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  vehicleManagedSessionsGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/managed-sessions`
    }
    return this.axiosRequest(data, nextRequestBody)
  }
}

export default requests
