import Vue from 'vue'
import Router from 'vue-router'
import ls from 'local-storage'

import ChangePassword from './views/ChangePassword.vue'

import ForgotPassword from './views/ForgotPassword.vue'
import Login from './views/Login.vue'
import Logout from './views/Logout.vue'

import Abilities from './views/Abilities.vue'
import Authorities from './views/Authorities/Authorities.vue'
import Authority from './views/Authorities/Authority.vue'
import BugReport from './views/BugReport.vue'
import Fleet from './views/Fleets/Fleet.vue'
import Fleets from './views/Fleets/Fleets.vue'
import Location from './views/Locations/Location.vue'
import Locations from './views/Locations/Locations.vue'
import ManagedSessions from './views/ManagedSessions/ManagedSessions.vue'
import ManagedSession from './views/ManagedSessions/ManagedSession.vue'
import ModelReleases from './views/ModelReleases.vue'
import Models from './views/Models.vue'
import PermissionGroup from './views/PermissionGroups/PermissionGroup.vue'
import PermissionGroups from './views/PermissionGroups/PermissionGroups.vue'
import Permissions from './views/Permissions.vue'
import Profile from './views/Users/Profile.vue'
import Recall from './views/Recalls/Recall.vue'
import Recalls from './views/Recalls/Recalls.vue'
import Reports from './views/Reports/Reports.vue'
import RequestAccount from './views/RequestAccount.vue'
import User from './views/Users/User.vue'
import Users from './views/Users/Users.vue'
import Vehicle from './views/Vehicles/Vehicle.vue'
import Vehicles from './views/Vehicles/Vehicles.vue'
import VehicleGroup from './views/VehicleGroups/VehicleGroup.vue'
import VehicleGroups from './views/VehicleGroups/VehicleGroups.vue'
import VerifyDriversLicense from './views/VerifyDriversLicense.vue'

import defaultRoutesConfig from '@/lib/defaultRoutesConfig'
import vehicleRoutesConfig from '@/lib/vehiclesRoutesConfig'
import usersRoutesConfig from '@/lib/usersRoutesConfig'

import {
  LOCAL_STORAGE_APPLICATION,
  LOCAL_STORAGE_NAMESPACE
} from '@/lib/constants'

const components = {
  Abilities,
  Authorities,
  Authority,
  BugReport,
  ChangePassword,
  ForgotPassword,
  Login,
  Logout,
  Fleet,
  Fleets,
  Location,
  Locations,
  ManagedSessions,
  ManagedSession,
  ModelReleases,
  Models,
  PermissionGroup,
  PermissionGroups,
  Permissions,
  Profile,
  Recall,
  Recalls,
  Reports,
  RequestAccount,
  User,
  Users,
  Vehicle,
  VehicleGroup,
  VehicleGroups,
  Vehicles,
  VerifyDriversLicense
}

Vue.use(Router)

// loads most routes from routesConfig import
const routes = [
  {
    path: '/',
    redirect: {
      name: 'login'
    }
  }
]

const routesConfig = { ...vehicleRoutesConfig, ...usersRoutesConfig, ...defaultRoutesConfig }

const addRoutes = function () {
  for (const item of Object.entries(routesConfig)) {
    const routeConfig = item[1]
    if (routeConfig.path) {
      const route = {
        path: routeConfig.path,
        name: routeConfig.name,
        title: routeConfig.title,
        component: components[routeConfig.component],
        meta: {
          breadCrumb: routeConfig.meta ? routeConfig.meta.breadCrumb : [],
          requires: {
            authentication: routeConfig.requires.authentication,
            abilities: routeConfig.requires.abilities
          },
          menuGroup: routeConfig.menuGroup
        }

      }
      if (routeConfig.props) {
        // if the value of routeConfig.props is the actual value 'true', set props = true, otherwise key-pair them
        if (routeConfig.props === true) {
          route.props = true
        } else {
          route.props = {}
          for (const [key, value] of Object.entries(routeConfig.props)) {
            route.props[key] = value
          }
        }
      }
      routes.push(route)
    }
  }
}

addRoutes()

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  const now = new Date()
  const session = ls.get(`${LOCAL_STORAGE_NAMESPACE}.${LOCAL_STORAGE_APPLICATION}.session`)
  const isTokenValid = (
    currentTimestamp,
    sessionTokenTimestamp,
    validityLength = 3600000,
    sessionMaxExpiration
  ) => {
    const validityStart = currentTimestamp - validityLength
    const tokenPastCurrentExpiration =
      sessionTokenTimestamp < validityStart
    const tokenPastMaxExpiration = currentTimestamp > sessionMaxExpiration
    const tokenInvalid =
      tokenPastCurrentExpiration || tokenPastMaxExpiration
    return !tokenInvalid
  }

  const requiresAuth = to.matched.some(record => record.meta.requires.authentication)
  const sessionValid = (session)
    ? isTokenValid(now, session.currentExpiration, session.validityLength, session.maxExpiration)
    : false

  const loggingOut = (from.name === 'logout')

  if (!to.matched.length) {
    next({
      name: 'login'
    })
  } else if (!sessionValid || loggingOut) {
    // path is in established routes but no auth necessary
    // edge case: logout has a session
    if (!requiresAuth) {
      next()
    // either the path is bad or you need to login
    } else {
      next({
        name: 'login'
      })
    }
  } else {
    // valid session and trying to reach junk or login... deny navigation
    if (to.name === 'login') {
      next({
        name: from.name
      })
      // otherwise go with our blessing
    } else {
      next()
    }
  }
})

export default router
