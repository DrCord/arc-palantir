import {
  SESSION_ACCESS_TOKEN_SET,
  SESSION_CREATION_SET,
  SESSION_CURRENT_EXPIRATION_SET,
  SESSION_ID_TOKEN_SET,
  SESSION_MAX_EXPIRATION_SET,
  SESSION_REFRESH_TOKEN_SET,
  SESSION_TOTP_TOKEN_SECRET_CODE_SET
} from '@/store/mutation-types'

import {
  SESSION,
  SESSION_ACCESS_TOKEN,
  SESSION_ID_TOKEN,
  SESSION_TOTP_TOKEN_SECRET_CODE
} from '@/store/getter-types'

const session = {
  state: {
    accessToken: '',
    creation: null,
    currentExpiration: null,
    idToken: '',
    isTokenValid: (
      currentTimestamp,
      sessionTokenTimestamp,
      validityLength,
      sessionMaxExpiration
    ) => {
      const validityStart = currentTimestamp - validityLength
      const tokenPastCurrentExpiration =
        sessionTokenTimestamp < validityStart
      const tokenPastMaxExpiration = currentTimestamp > sessionMaxExpiration
      const tokenInvalid =
        tokenPastCurrentExpiration || tokenPastMaxExpiration
      return !tokenInvalid
    },
    isTokenApproachingInvalid: (
      currentTimestamp,
      sessionTokenTimestamp,
      validityLength,
      sessionMaxExpiration
    ) => {
      const validityStart = currentTimestamp - validityLength
      const tokenPastCurrentExpiration = sessionTokenTimestamp < validityStart
      const tokenPastMaxExpiration = currentTimestamp > sessionMaxExpiration - 30 * 1000
      const tokenInvalid = tokenPastCurrentExpiration || tokenPastMaxExpiration
      return tokenInvalid
    },
    maxExpiration: null,
    refreshToken: '',
    totpTokenSecretCode: null,
    validityLength: process.env.VUE_APP_ENVIRONMENT === 'prod' ? 1000 * 60 * 5 : 1000 * 60 * 60 // 5 Minutes prod, 60 other
  },
  getters: {
    [SESSION]: state => {
      return {
        idToken: state.idToken,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        creation: state.creation,
        currentExpiration: state.currentExpiration,
        maxExpiration: state.maxExpiration,
        validityLength: state.validityLength,
        isTokenApproachingInvalid: state.isTokenApproachingInvalid,
        isTokenValid: state.isTokenValid
      }
    },
    [SESSION_ACCESS_TOKEN]: state => {
      return state.accessToken
    },
    [SESSION_ID_TOKEN]: state => {
      return state.idToken
    },
    [SESSION_TOTP_TOKEN_SECRET_CODE]: state => {
      return state.totpTokenSecretCode
    }
  },
  mutations: {
    [SESSION_ID_TOKEN_SET] (state, val) {
      state.idToken = val
    },
    [SESSION_ACCESS_TOKEN_SET] (state, val) {
      state.accessToken = val
    },
    [SESSION_REFRESH_TOKEN_SET] (state, val) {
      state.refreshToken = val
    },
    [SESSION_CREATION_SET] (state, val) {
      state.creation = val
    },
    [SESSION_CURRENT_EXPIRATION_SET] (state, val) {
      state.currentExpiration = val
    },
    [SESSION_MAX_EXPIRATION_SET] (state, val) {
      state.maxExpiration = val
    },
    [SESSION_TOTP_TOKEN_SECRET_CODE_SET] (state, val) {
      state.totpTokenSecretCode = val
    }
  }
}

export default session
