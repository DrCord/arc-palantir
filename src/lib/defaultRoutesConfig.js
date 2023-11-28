const defaultRoutesConfig = {
  bugReport: {
    component: 'BugReport',
    icon: 'list',
    menu: false,
    name: 'bug-report',
    path: '/bug-report',
    requires: {
      authentication: true,
      abilities: []
    },
    title: 'Bug Report',
    menuGroup: 'all'
  },

  changePassword: {
    component: 'ChangePassword',
    icon: 'fas fa-unlock',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'User',
            to: { name: 'profile' }
          },
          {
            text: 'Change Password'
          }
        ]
      }
    },
    name: 'change-password',
    path: '/change-password',
    requires: {
      authentication: true,
      abilities: []
    },
    title: 'Change Password',
    menuGroup: 'all'
  },

  forgotPassword: {
    component: 'ForgotPassword',
    icon: 'fas fa-ban',
    menu: true,
    meta: {
      breadCrumb (route) {
        return [
          {
            text: 'Login',
            to: { name: 'login' }
          },
          {
            text: 'Forgot Password'
          }
        ]
      }
    },
    name: 'forgot-password',
    path: '/forgot-password',
    requires: {
      authentication: false,
      abilities: []
    },
    title: 'Forgot Password',
    menuGroup: 'all'
  },

  login: {
    component: 'Login',
    icon: 'fas fa-key',
    menu: true,
    name: 'login',
    path: '/login',
    requires: {
      authentication: false,
      abilities: []
    },
    title: 'Login',
    menuGroup: 'all'
  },
  logout: {
    component: 'Logout',
    icon: 'fas fa-sign-out-alt',
    menu: true,
    name: 'logout',
    path: '/logout',
    requires: {
      authentication: true,
      abilities: []
    },
    title: 'Logout',
    menuGroup: 'all'
  },
  requestAccount: {
    component: 'RequestAccount',
    icon: 'list',
    menu: false,
    name: 'request-account',
    path: '/request-account',
    requires: {
      authentication: false,
      abilities: []
    },
    title: 'Request Account',
    menuGroup: 'all'
  }
}

export default defaultRoutesConfig
