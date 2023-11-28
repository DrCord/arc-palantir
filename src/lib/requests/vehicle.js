import * as requestsLib from './requests'

const requests = {
  ...requestsLib.default,
  configurationSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/configuration`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  firmwareVersionGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/firmware/version`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  firmwareVersionSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/firmware/version`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: firmware_modules_input
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  fleetAdd (data) {
    const nextRequestBody = {
      method: 'PUT',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.id}/vehicles/${data.vin}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, false, true)
  },
  fleetRemove (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.id}/vehicles/${data.vin}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  gpsRecordSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/gps`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: record_gps
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  modelReleaseSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/model-releases/${data.modelReleaseId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  noteCreate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/notes`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: tags, content, (body is pulled from $input.json('$'))
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  partSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/parts`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: part_type, part_number
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  shadowSynchronized (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/synchronized`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  signToken (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/token`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: authority_id, token
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  telemetrySetPoints (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/telemetry`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: telemetry points at root of json input {}
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  telemetryBackfillPresignUpload (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/telemetry/backfill/presign-upload`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: file_name
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  telemetryBackfillProcess (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}/telemetry/backfill/process`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: file_name, file_length
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  vehicleGet (data, getType = 'vehicle') {
    // also handles subRoutes appended to base getVehicle route
    const subRoutes = [
      'authorities',
      'gps',
      'managed-sessions',
      'notes',
      'recalls'
    ]
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/vehicles/${data.vin}`
    }
    if (getType !== 'vehicle' && subRoutes.includes(getType)) {
      nextRequestBody.url += `/${getType}`
    }
    return this.axiosRequest(data, nextRequestBody)
  }
}

export default requests
