import * as requestsLib from './requests'

const requests = {
  ...requestsLib.default,
  abilitiesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/abilities`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  abilityCreate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/abilities`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: description, permissions
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  abilityDelete (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/abilities/${data.abilityId}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  abilityEdit (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/abilities/${data.abilityId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: ability, description, permissions
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  abilityGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/abilities/${data.abilityId}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  usersGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  verifyDl (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/verify/dl`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: first_name, last_name, email, drivers_license_number, state
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  }
}

export default requests
