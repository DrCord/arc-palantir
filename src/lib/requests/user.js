import * as requestsLib from './requests'

const requests = {
  ...requestsLib.default,
  create (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: email, phone, display_name, enable_mfa (optional)
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  disable (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/disable`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  enable (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/enable`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  fleetAdd (data) {
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
  fleetRemove (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/fleets/${data.fleetId}/users/${data.username}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  fleetsGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/fleets`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  grantAbility (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/abilities/${data.abilityId}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  mfaSmsDisable (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/mfa/sms/disable`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  mfaSmsEnable (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/mfa/sms/enable`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  mfaTotpDisable (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/mfa/totp/disable`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  mfaTotpEnable (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/mfa/totp/enable`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  mfaTotpTokenAssociate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/mfa/totp/token/associate`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: access_token
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  mfaTotpTokenVerify (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/mfa/totp/token/verify`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: access_token, user_code, friendly_device_name
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  noteCreate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/notes`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: tags, content, (body is pulled from $input.json('$'))
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  notesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/notes`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  permissionGroupAdd (data) {
    const nextRequestBody = {
      method: 'PUT',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups/${data.permissionGroupId}/users/${data.username}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, false, true)
  },
  permissionGroupRemove (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups/${data.permissionGroupId}/users/${data.username}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  preferenceSet (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/preferences`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: preference_identifier, preference_value
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  preferencesGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/preferences`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  profileEdit (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/profile`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body // expected: email, phone, display_name, avatar
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  resendInvite (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}/resend-invite`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {}
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  userGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/users/${data.username}`
    }
    return this.axiosRequest(data, nextRequestBody)
  }
}

export default requests
