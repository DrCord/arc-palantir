import axios from 'axios'

// Add a response interceptor that camelCases response data
axios.interceptors.response.use(function (response) {
  const processVal = val => (
    (typeof val !== 'object' || val === null)
      ? val
      : Array.isArray(val)
        ? val.map(processVal)
        : renameKeys(val)
  )
  const renameKeys = obj => Object.fromEntries(
    Object.entries(obj)
      .map(([key, val]) => [
        key.replace(/_(.)/g, g => g[1].toUpperCase()),
        processVal(val)
      ])
  )
  // Any status code that lie within the range of 2xx cause this function to trigger
  // convert all snake_case keys to camelCase
  const responseCamelCase = renameKeys(response)
  return responseCamelCase
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

const requests = {
  apiPrefix: 'palantir',
  axios,
  googleMapsGeoCodeApiKey: 'AIzaSyBd9SxM7WVXSwJUKpwTJJ6tYdIQUhM6okc',
  baseUrl: process.env.VUE_APP_ENVIRONMENT === 'prod' ? 'api.arcimoto.com' : `${process.env.VUE_APP_ENVIRONMENT}.api.arcimoto.com`,
  proxyServer: process.env.VUE_APP_CONNECTION_TYPE !== 'localhostproxy' ? false : 'http://localhost:3000',
  axiosRequest (data, nextRequestBody, postRequest = false, putRequest = false) {
    // checks if you are in production (during build) or not
    // uses proxyServer value from state if in dev
    // uses direct endpoint in prod
    let axiosFunc
    const requestBody = nextRequestBody
    if (!this.proxyServer) {
      this.axios.defaults.headers.common.Authorization = data.idToken
      if (postRequest) {
        axiosFunc = this.axios.post(requestBody.url, requestBody.body)
      } else if (putRequest) {
        axiosFunc = this.axios.put(requestBody.url, requestBody.body)
      } else {
        axiosFunc = this.axios(requestBody)
      }
    } else {
      requestBody.jwtToken = data.idToken
      axiosFunc = this.axios.post(this.proxyServer, requestBody)
    }

    return axiosFunc
  }
}

export default requests
