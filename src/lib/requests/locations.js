import * as requestsLib from './requests'

const requests = {
  ...requestsLib.default,
  addressTypesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/locations/address-types`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  countriesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/locations/countries`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  locationCodeCreate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/locations/location-codes`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  locationCodeDelete (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/locations/location-codes/${data.id}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  locationCodesList (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/locations/location-codes`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  locationCodeSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/locations/${data.locationId}/location-code`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  locationCreate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/locations`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  locationDelete (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/locations/${data.id}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  locationGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/locations/${data.locationId}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  locationLookupAddress (data) {
    const requestBody = {
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.lat},${data.long}&key=${this.googleMapsGeoCodeApiKey}`
    }
    return this.axios(requestBody)
  },
  locationUpdate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/locations/${data.id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  locationsGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/locations`
    }
    return this.axiosRequest(data, nextRequestBody)
  }
}

export default requests
