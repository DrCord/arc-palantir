import * as requestsLib from './requests'

const requests = {
  ...requestsLib.default,
  authoritiesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/authorities?include_vin=true`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  authoritiesVehicleGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/authorities/vehicles/${data.vin}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  authoritiesVehicleProvision (data) {
    const nextRequestBody = {
      method: 'PUT',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/authorities/vehicles/${data.vin}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, false, true)
      .catch(e => {
        throw e
      })
  },
  authoritiesVehiclesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/authorities/vehicles`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  authorityCreate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/authorities`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  authorityDelete (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/authorities/${data.authorityId}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  authorityGrantVehicleAccess (data) {
    const nextRequestBody = {
      method: 'PUT',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/authorities/${data.authorityId}/vehicles/${data.vin}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  authorityRevokeVehicleAccess (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/authorities/${data.authorityId}/vehicles/${data.vin}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  authorityGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/authorities/${data.authorityId}`
    }
    return this.axiosRequest(data, nextRequestBody)
  }
}

export default requests
