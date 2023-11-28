import * as requestsLib from './requests'

const requests = {
  ...requestsLib.default,
  recallCreate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  recallRemedyCreate (data) {
    const nextRequestBody = {
      method: 'PUT',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/${data.id}/remedy`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, false, true)
  },
  recallGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/${data.id}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallDelete (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/${data.id}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallEdit (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/${data.id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallsDateUpdatedInitialGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/date/initial`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallsDateUpdatedLastGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/date`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallsDateUpdatedGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/date/${data.id}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallsDateUpdatedSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/date/updated`,
      headers: {
        'Content-Type': 'application/json'
      },
      // in order to set the Content-Type header axios requires a body
      // https://github.com/axios/axios/issues/86
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallsGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallsRemediesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/remedies`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallsRemedyDelete (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/remedies/${data.id}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallsRemedyEdit (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/remedies/${data.id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  recallVehicleGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/${data.id}/vehicles/${data.vin}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallVehicleAdd (data) {
    const nextRequestBody = {
      method: 'PUT',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/${data.id}/vehicles`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, false, true)
  },
  recallVehicleDelete (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/${data.id}/vehicles/${data.vin}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  recallVehicleEdit (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/${data.id}/vehicles/${data.vin}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  recallVehicleService (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/${data.id}/vehicles/service`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  recallVehiclesAdd (data) {
    const nextRequestBody = {
      method: 'PUT',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/${data.id}/vehicles`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, false, true)
  },
  recallVehiclesService (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/recalls/${data.id}/vehicles/service`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  }
}

export default requests
