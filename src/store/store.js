import Vue from 'vue'
import Vuex from 'vuex'

import authorities from './modules/authorities'
import cognito from './modules/cognito'
import main from './modules/main'
import operator from './modules/operator'
import recalls from './modules/recalls'
import session from './modules/session'
import permissions from './modules/permissions'
import users from './modules/users'
import vehicles from './modules/vehicles'
import fleets from './modules/fleets'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    authorities,
    cognito,
    main,
    operator,
    recalls,
    session,
    permissions,
    users,
    vehicles,
    fleets
  }
})
