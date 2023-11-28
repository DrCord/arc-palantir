<template>
  <div class="managed-session-end-container">
    <v-btn
      v-if="vehicleManagedSessionActive"
      :disabled="loading"
      @click="vehicleManagedSessionEnd"
    >Managed Session: End
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  MANAGED_SESSION_END
} from '@/store/action-types'
import {
  LOADING,
  VEHICLE_MANAGED_SESSION_ACTIVE
} from '@/store/getter-types'

export default {
  name: 'ManagedSessionEnd',
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      loading: LOADING,
      vehicleManagedSessionActiveGet: VEHICLE_MANAGED_SESSION_ACTIVE
    }),
    vehicleManagedSessionActive () {
      return this.vin ? this.vehicleManagedSessionActiveGet(this.vin) : null
    }
  },
  methods: {
    ...mapActions({
      vehicleManagedSessionEndAction: MANAGED_SESSION_END
    }),
    async vehicleManagedSessionEnd () {
      const componentSelf = this
      const payload = {
        vin: this.vin
      }
      await this.vehicleManagedSessionEndAction({ componentSelf, payload })
      this.$emit('vehicle-managed-session-end-complete')
    }
  }
}
</script>
