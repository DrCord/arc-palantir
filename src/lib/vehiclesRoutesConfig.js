import {
  FLEETS_GROUP_READ,
  RECALLS_READ,
  MANAGED_SESSION_ADMIN,
  VEHICLE_READ,
  VERIFY_DL
} from '@/lib/ability-types'

const vehiclesRoutesConfig = {
  fleet: {
    component: 'Fleet',
    icon: 'layer-group',
    menu: false,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Fleets',
            to: { name: 'fleets' }
          },
          {
            text: 'Fleet'
          }
        ]
      }
    },
    name: 'fleet',
    path: '/fleets/:fleetId',
    props: {
      default: true,
      fleetId: null
    },
    requires: {
      authentication: true,
      abilities: []
    },
    menuGroup: 'vehicles'
  },
  location: {
    component: 'Location',
    menu: false,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Locations',
            to: { name: 'locations' }
          },
          {
            text: 'Location'
          }
        ]
      }
    },
    name: 'location',
    path: '/location/:id',
    requires: {
      authentication: true,
      abilities: []
    },
    menuGroup: 'vehicles'
  },
  locations: {
    component: 'Locations',
    icon: 'location-arrow',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Locations'
          }
        ]
      }
    },
    name: 'locations',
    path: '/locations',
    requires: {
      authentication: true,
      abilities: []
    },
    title: 'Locations',
    menuGroup: 'vehicles'
  },
  managedSession: {
    component: 'ManagedSession',
    menu: false,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Managed Sessions',
            to: { name: 'managed-sessions' }
          },
          {
            text: 'Managed Session'
          }
        ]
      }
    },
    name: 'managed-session',
    path: '/managed-sessions/:id',
    requires: {
      authentication: true,
      abilities: [MANAGED_SESSION_ADMIN]
    },
    menuGroup: 'vehicles'
  },
  managedSessions: {
    component: 'ManagedSessions',
    icon: 'stopwatch',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Managed Sessions'
          }
        ]
      }
    },
    name: 'managed-sessions',
    path: '/managed-sessions',
    requires: {
      authentication: true,
      abilities: [MANAGED_SESSION_ADMIN]
    },
    title: 'Managed Sessions',
    menuGroup: 'vehicles'
  },
  modelReleases: {
    component: 'ModelReleases',
    icon: 'fingerprint',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Model Info'
          },
          {
            text: 'Model Releases'
          }
        ]
      }
    },
    name: 'model-releases',
    path: '/model-releases',
    requires: {
      authentication: true,
      abilities: [VEHICLE_READ]
    },
    title: 'Model Releases',
    menuGroup: 'vehicles'
  },
  models: {
    component: 'Models',
    icon: 'filter',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Model Info'
          },
          {
            text: 'Models'
          }
        ]
      }
    },
    name: 'models',
    path: '/models',
    requires: {
      authentication: true,
      abilities: [VEHICLE_READ]
    },
    title: 'Models',
    menuGroup: 'vehicles'
  },
  operatorFleets: {
    component: 'Fleets',
    icon: ['fas', 'cars'],
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Fleets'
          }
        ]
      }
    },
    name: 'fleets',
    path: '/fleets',
    requires: {
      authentication: true,
      abilities: []
    },
    title: 'Fleets - Operator',
    menuGroup: 'vehicles'
  },
  recall: {
    component: 'Recall',
    icon: 'bug',
    menu: false,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Recalls',
            to: { name: 'recalls' }
          },
          {
            text: 'Recall'
          }
        ]
      }
    },
    name: 'recall',
    path: '/recalls/:id',
    props: {
      default: true,
      id: null
    },
    requires: {
      authentication: true,
      abilities: [RECALLS_READ]
    },
    title: 'Recall',
    menuGroup: 'vehicles'
  },
  recalls: {
    component: 'Recalls',
    icon: 'bug',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Recalls'
          }
        ]
      }
    },
    name: 'recalls',
    path: '/recalls',
    requires: {
      authentication: true,
      abilities: [RECALLS_READ]
    },
    title: 'Recalls',
    menuGroup: 'vehicles'
  },
  reports: {
    component: 'Reports',
    icon: 'clipboard-list',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Reports'
          }
        ]
      }
    },
    name: 'reports',
    path: '/vehicles/reports',
    requires: {
      authentication: true,
      abilities: [VEHICLE_READ]
    },
    title: 'Reports',
    menuGroup: 'vehicles'
  },
  vehicle: {
    component: 'Vehicle',
    icon: 'car-side',
    menu: false,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Vehicle'
          }
        ]
      }
    },
    name: 'vehicle',
    path: '/vehicles/:vin',
    props: {
      default: true,
      vin: null
    },
    requires: {
      authentication: true,
      abilities: []
    },
    menuGroup: 'vehicles'
  },
  vehicleGroup: {
    component: 'VehicleGroup',
    menu: false,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Vehicle Groups',
            to: { name: 'vehicle-groups' }
          },
          {
            text: 'Vehicle Group'
          }
        ]
      }
    },
    name: 'vehicle-group',
    path: '/vehicle-groups/:groupId',
    props: true,
    requires: {
      authentication: true,
      abilities: [FLEETS_GROUP_READ]
    },
    menuGroup: 'vehicles'
  },
  vehicleGroups: {
    component: 'VehicleGroups',
    icon: ['fas', 'garage-car'],
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Vehicles',
            to: { name: 'vehicles' }
          },
          {
            text: 'Vehicle Groups'
          }
        ]
      }
    },
    name: 'vehicle-groups',
    path: '/vehicle-groups',
    props: true,
    title: 'Fleets - All',
    requires: {
      authentication: true,
      abilities: [FLEETS_GROUP_READ]
    },
    menuGroup: 'vehicles'
  },
  vehicles: {
    component: 'Vehicles',
    icon: 'car-side',
    menu: true,
    name: 'vehicles',
    path: '/vehicles',
    requires: {
      authentication: true,
      abilities: [VEHICLE_READ]
    },
    title: 'Vehicles',
    menuGroup: 'vehicles'
  },
  verifyDriversLicense: {
    component: 'VerifyDriversLicense',
    icon: ['fas', 'badge-check'],
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Verify'
          },
          {
            text: 'Drivers License'
          }
        ]
      }
    },
    name: 'verify-drivers-license',
    path: '/verify/dl',
    props: false,
    title: 'Verify Drivers License',
    requires: {
      authentication: true,
      abilities: [VERIFY_DL]
    },
    menuGroup: 'vehicles'
  }
}

export default vehiclesRoutesConfig
