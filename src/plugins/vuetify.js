import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

import BatteryIcon from '@/icons/BatteryIcon.vue'
import FuvIcon from '@/icons/FuvIcon.vue'
import GaugeIcon from '@/icons/GaugeIcon.vue'
import LocationPinIcon from '@/icons/LocationPinIcon.vue'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      // add variables here for use in css or on components
      // when using in css format is
      // var(--v-yourVariableName-base)
      // base is used as the default value, you can add lighten or darken to them as well
      // see documentation here: https://vuetifyjs.com/en/features/theme/
      light: {
        'gray-blue': '#2c3e50',
        'active-item': '#ccffcc',
        'active-item-link': '#2196f3',
        card: '#ccc',
        'fleet-card': '#ccc',
        'vehicle-card': '#ccc',
        'soc-percentage': '#666',
        'user-card': '#ccc',
        'user-details': '#333',
        'arcimoto-blue': '#00a6ff',
        'header-blue': '#015368'
      },
      dark: {
        'gray-blue': '#fff',
        'active-item': '#689e6e',
        'active-item-link': '#192c9c',
        card: '#666',
        'fleet-card': '#666',
        'vehicle-card': '#666',
        'fleet-id': '#ddd',
        'soc-percentage': '#ddd',
        'user-card': '#666',
        'user-details': '#ddd',
        'arcimoto-blue': '#00a6ff',
        'header-blue': '#012933'
      }
    }
  },
  iconfont: 'md',
  icons: {
    values: {
      battery: {
        component: BatteryIcon
      },
      fuv: {
        component: FuvIcon
      },
      gauge: {
        component: GaugeIcon
      },
      locationPin: {
        component: LocationPinIcon
      }
    }
  }
})
