import * as requestsLib from './requests'

const requests = {
  ...requestsLib.default,
  fleetCreate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  fleetLocationSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.fleetId}/location`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  fleetTypeSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.fleetId}/type`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  fleetUpdate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.fleetId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  fleetDelete (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.fleetId}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  fleetGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.fleetId}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  fleetUserAdd (data) {
    const nextRequestBody = {
      method: 'PUT',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.fleetId}/users/${data.username}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, false, true)
  },
  fleetUserRemove (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.fleetId}/users/${data.username}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  fleetAddVehicle (data) {
    const nextRequestBody = {
      method: 'PUT',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.fleetId}/vehicles/${data.vin}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, false, true)
  },
  fleetRemoveVehicle (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.fleetId}/vehicles/${data.vin}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  fleetsDepartmentCodeCreate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/department-codes`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  fleetsDepartmentCodeDelete (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/department-codes/${data.id}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  fleetsDepartmentCodeSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.fleetId}/department-code`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  fleetsDepartmentCodesList (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/department-codes`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  fleetsGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  fleetsTypesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/types`
    }
    return this.axiosRequest(data, nextRequestBody)
  }

}

export default requests
