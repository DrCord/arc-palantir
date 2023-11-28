import {
  ABILITIES_READ,
  AUTHORITIES_LIST,
  PERMISSION_GROUPS_READ,
  PERMISSIONS_READ,
  USER_READ
} from '@/lib/ability-types'

const usersRoutesConfig = {
  abilities: {
    component: 'Abilities',
    icon: 'balance-scale',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Users',
            to: { name: 'users' }
          },
          {
            text: 'Abilities'
          }
        ]
      }
    },
    name: 'abilities',
    path: '/abilities',
    requires: {
      authentication: true,
      abilities: [ABILITIES_READ]
    },
    title: 'Abilities',
    menuGroup: 'users'
  },
  authorities: {
    component: 'Authorities',
    icon: 'bullhorn',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Users',
            to: { name: 'users' }
          },
          {
            text: 'Authorities'
          }
        ]
      }
    },
    name: 'authorities',
    path: '/authorities',
    requires: {
      authentication: true,
      abilities: [AUTHORITIES_LIST]
    },
    title: 'Authorities',
    menuGroup: 'users'
  },
  authority: {
    component: 'Authority',
    icon: 'list',
    menu: false,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Users',
            to: { name: 'users' }
          },
          {
            text: 'Authorities',
            to: { name: 'authorities' }
          },
          {
            text: 'Authority'
          }
        ]
      }
    },
    name: 'authority',
    path: '/authorities/:id',
    props: {
      default: true,
      id: null
    },
    requires: {
      authentication: true,
      abilities: [AUTHORITIES_LIST]
    },
    menuGroup: 'users'
  },
  permissions: {
    component: 'Permissions',
    icon: 'hat-wizard',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Users',
            to: { name: 'users' }
          },
          {
            text: 'Permissions'
          }
        ]
      }
    },
    name: 'permissions',
    path: '/permissions',
    requires: {
      authentication: true,
      abilities: [PERMISSIONS_READ]
    },
    title: 'Permissions',
    menuGroup: 'users'
  },
  PermissionGroup: {
    component: 'PermissionGroup',
    menu: false,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Users',
            to: { name: 'users' }
          },
          {
            text: 'Permission Groups',
            to: { name: 'permission-groups' }
          },
          {
            text: 'Permission Group'
          }
        ]
      }
    },
    name: 'permission-group',
    path: '/permission-groups/:id',
    props: {
      default: true,
      id: null
    },
    requires: {
      authentication: true,
      abilities: [PERMISSION_GROUPS_READ]
    },
    menuGroup: 'users'
  },
  PermissionGroups: {
    component: 'PermissionGroups',
    icon: 'link',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Users',
            to: { name: 'users' }
          },
          {
            text: 'Permission Groups'
          }
        ]
      }
    },
    name: 'permission-groups',
    path: '/permission-groups',
    props: {
      default: true
    },
    requires: {
      authentication: true,
      abilities: [PERMISSION_GROUPS_READ]
    },
    title: 'Permission Groups',
    menuGroup: 'users'
  },
  profile: {
    component: 'Profile',
    icon: 'list',
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Users'
          },
          {
            text: 'Self'
          }
        ]
      }
    },
    name: 'profile',
    path: '/profile',
    requires: {
      authentication: true,
      abilities: []
    },
    title: 'Profile',
    menuGroup: 'users'
  },
  user: {
    component: 'User',
    icon: 'user',
    menu: false,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Users',
            to: { name: 'users' }
          },
          {
            text: 'User'
          }
        ]
      }
    },
    name: 'user',
    path: '/users/:username',
    props: {
      default: true,
      username: null
    },
    requires: {
      authentication: true,
      abilities: [USER_READ]
    },
    menuGroup: 'users'
  },
  users: {
    component: 'Users',
    icon: 'users',
    menu: true,
    name: 'users',
    path: '/users',
    requires: {
      authentication: true,
      abilities: [USER_READ]
    },
    title: 'Users',
    menuGroup: 'users'
  }
}

export default usersRoutesConfig
