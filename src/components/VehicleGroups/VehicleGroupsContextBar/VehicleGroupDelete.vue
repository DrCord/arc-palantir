<template>
  <div class="vehicle-group-delete-container">
    <h3>Delete Vehicle Group</h3>
    <div v-if="availableFleets.length">
      <v-select
        v-model="fleetId"
        :items="availableFleets"
        item-text="name"
        item-value="id"
        outlined
      ></v-select>
      <div class="btn-container">
        <v-btn
          class="cancel"
          color="error"
          dark
          @click="fleetDeleteCancel"
        >Cancel<v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          class="submit"
          color="success"
          type="button"
          :disabled="!fleetId"
          @click="fleetDeleteSubmit"
        >Delete<v-icon>mdi-delete-circle</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No fleets available to delete</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEET_DELETE,
  FLEETS_SUMMON
} from '@/store/action-types'
import {
  FLEETS,
  LOADING
} from '@/store/getter-types'

export default {
  name: 'FleetDelete',
  data () {
    return {
      fleetId: null
    }
  },
  computed: {
    ...mapGetters({
      fleets: FLEETS,
      loading: LOADING
    }),
    availableFleets () {
      const fleets = this.fleets.filter(fleet => {
        return fleet.id !== 1
      })
      fleets.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      return fleets
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      fleetDeleteAction: FLEET_DELETE,
      fleetsSummonAction: FLEETS_SUMMON
    }),
    init () {
      this.fleetsSummon()
    },
    fleetDeleteCancel () {
      this.$emit('fleet-delete-cancel')
    },
    async fleetDeleteSubmit () {
      const componentSelf = this
      const fleetId = this.fleetId
      const payload = {
        fleetId,
        body: {}
      }
      await this.fleetDeleteAction({ componentSelf, payload })
      this.$emit('fleet-delete-complete')
    },
    async fleetsSummon () {
      const componentSelf = this
      await this.fleetsSummonAction({ componentSelf })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle-group-delete-container {
    h3 {
      margin-bottom: 20px;
    }
    .btn-container {
      display: flex;
      justify-content: flex-end;
      button {
        margin-left: 20px;
        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
