import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import { COGNITO_USER_POOL_SET } from './store/mutation-types'
import { mapState } from 'vuex'
import VueForm from 'vue-form'
import VueMoment from 'vue-moment'
import 'bootstrap/dist/css/bootstrap.min.css'
import IdleVue from 'idle-vue'
import IdleVueComponent from '@/components/Idle/components/Idle.vue'
import * as vinValidator from 'vin-validator'
import { VueMasonryPlugin } from 'vue-masonry'
import * as VueGoogleMaps from 'vue2-google-maps'
import GmapCluster from 'vue2-google-maps/src/components/cluster'
import Toasted from 'vue-toasted'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import Clipboard from 'v-clipboard'
import filters from '@/lib/filters'
import states from '@/lib/states'
import vuetify from './plugins/vuetify'
import VueMobileDetection from 'vue-mobile-detection'

import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/dist/vue-tel-input.css'

// font-awesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAnchor,
  faBalanceScale,
  faBug,
  faBullhorn,
  faCarSide,
  faCheckCircle,
  faClipboardList,
  faCode,
  faCog,
  faFilter,
  faFingerprint,
  faHatWizard,
  faIndustry,
  faLayerGroup,
  faLink,
  faList,
  faLocationArrow,
  faScroll,
  faRedoAlt,
  faSearch,
  faStopwatch,
  faSync,
  faTruck,
  faUser,
  faUsers,
  faWarehouse,
  faWrench
} from '@fortawesome/free-solid-svg-icons'
import {
  faBadgeCheck,
  faCars,
  faEngineWarning,
  faGarageCar
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('gmap-cluster', GmapCluster)

vinValidator.validateCasing = function (value) {
  return !/[a-z]/.test(value)
}
Vue.prototype.$vinValidator = vinValidator

Vue.prototype.$validators = {
  driversLicenseNumberValidate: (value, stateCode) => {
    const stateData = states.find(item => item.code === stateCode)
    return stateData ? value.match(stateData.driversLicenseNumberValidator.rule) : null
  }
}

const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
// fetch stub is needed for amazon-cognito-identity-js library to work
global.fetch = require('node-fetch')

// font-awesome config
library.add(faAnchor)
library.add(faBadgeCheck)
library.add(faBalanceScale)
library.add(faBug)
library.add(faBullhorn)
library.add(faCars)
library.add(faCarSide)
library.add(faCheckCircle)
library.add(faClipboardList)
library.add(faCode)
library.add(faCog)
library.add(faEngineWarning)
library.add(faFilter)
library.add(faFingerprint)
library.add(faGarageCar)
library.add(faHatWizard)
library.add(faIndustry)
library.add(faLayerGroup)
library.add(faLink)
library.add(faList)
library.add(faLocationArrow)
library.add(faRedoAlt)
library.add(faScroll)
library.add(faSearch)
library.add(faStopwatch)
library.add(faSync)
library.add(faTruck)
library.add(faUser)
library.add(faUsers)
library.add(faWarehouse)
library.add(faWrench)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(Clipboard)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyApM5GFJ35GDKZqyDbrPLTLzuJBB759X_s'
  }
})
Vue.use(VueMasonryPlugin)
Vue.use(VueMobileDetection)
Vue.use(VueMoment)
Vue.use(Toasted)
Vue.use(VueForm)
Vue.use(VueTelInput)

const eventsHub = new Vue()
Vue.use(IdleVue, { store, eventEmitter: eventsHub, idleTime: 5000 })
Vue.component('idle-view', IdleVueComponent) // Required to use idle-view component

// setup global filters
for (const [filterName, filterFunc] of Object.entries(filters)) {
  Vue.filter(filterName, filterFunc)
}

new Vue({
  router,
  store,

  computed: {
    ...mapState({
      cognitoUserPoolData: state => state.cognito.userPoolData
    })
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(this.cognitoUserPoolData)
      store.commit(COGNITO_USER_POOL_SET, userPool)
    }
  },

  vuetify,
  render: h => h(App)
}).$mount('#app')
