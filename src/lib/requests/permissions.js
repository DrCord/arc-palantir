import * as requestsLib from './requests'

const requests = {
  ...requestsLib.default,
  permissionsGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permissions`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  permissionGroupCreate (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  permissionGroupDelete (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups/${data.permissionGroupId}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  permissionGroupGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups/${data.permissionGroupId}`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  permissionGroupAddPermission (data) {
    const nextRequestBody = {
      method: 'PUT',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups/${data.permissionGroupId}/permissions`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, false, true)
  },
  permissionGroupListPermissions (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups/${data.permissionGroupId}/permissions`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  permissionGroupRemovePermission (data) {
    const nextRequestBody = {
      method: 'POST',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups/${data.permissionGroupId}/permissions`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, true)
  },
  permissionGroupAddUser (data) {
    const nextRequestBody = {
      method: 'PUT',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups/${data.permissionGroupId}/users/${data.username}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody, false, true)
  },
  permissionGroupListUsers (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups/${data.permissionGroupId}/users`
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  permissionGroupRemoveUser (data) {
    const nextRequestBody = {
      method: 'DELETE',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups/${data.permissionGroupId}/users/${data.username}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        ...data.body
      }
    }
    return this.axiosRequest(data, nextRequestBody)
  },
  permissionsGroupsGet (data) {
    const nextRequestBody = {
      method: 'GET',
      url: `https://${this.baseUrl}/${this.apiPrefix}/v1/permission-groups`
    }
    return this.axiosRequest(data, nextRequestBody)
  }

}

export default requests
