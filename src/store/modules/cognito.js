import awsExports from '@/aws-exports'

import {
  COGNITO_USER,
  COGNITO_USER_POOL
} from '@/store/getter-types'
import {
  COGNITO_CREDENTIALS_SET,
  COGNITO_CREDENTIALS_USERNAME_SET,
  COGNITO_USER_POOL_SET,
  COGNITO_USER_RESET,
  COGNITO_USER_SET
} from '@/store/mutation-types'

const cognito = {
  state: {
    credentials: {
      username: '',
      password: ''
    },
    user: null,
    userPool: null,
    userPoolData: {
      UserPoolId: awsExports.userPoolId,
      ClientId: awsExports.userPoolWebClientId
    }
  },
  mutations: {
    [COGNITO_CREDENTIALS_SET] (state, val) {
      state.credentials = val
    },
    [COGNITO_CREDENTIALS_USERNAME_SET] (state, val) {
      state.credentials.username = val
    },
    [COGNITO_USER_POOL_SET] (state, val) {
      state.userPool = val
    },
    [COGNITO_USER_RESET] (state) {
      state.user = null
    },
    [COGNITO_USER_SET] (state, val) {
      state.user = val
    }
  },
  getters: {
    [COGNITO_USER]: (state) => {
      return state.user
    },
    [COGNITO_USER_POOL]: (state) => {
      return state.userPool
    }
  }
}

export default cognito
