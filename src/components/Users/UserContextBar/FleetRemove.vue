<template>
  <div class="user-fleet-remove-container">
    <h3>Remove User from Fleet</h3>
    <div v-if="availableFleets.length">
      <v-select
        v-model="fleetId"
        :items="availableFleets"
        item-text="name"
        item-value="id"
        outlined
      ></v-select>
      <v-btn
        :disabled="!fleetId"
        color=success
        @click="userFleetRemove"
      >Save</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No fleets available to remove</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEETS_SUMMON,
  USER_FLEET_REMOVE
} from '@/store/action-types'
import {
  FLEETS,
  LOADING,
  USER_FLEETS
} from '@/store/getter-types'

export default {
  name: 'UserFleetRemove',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      fleetId: null
    }
  },
  computed: {
    ...mapGetters({
      fleets: FLEETS,
      loading: LOADING,
      userFleetsGet: USER_FLEETS
    }),
    availableFleets () {
      // check against user fleets
      const fleets = this.fleets.filter(fleet => {
        return this.userFleetsIds.includes(fleet.id)
      })
      // sort by fleet name
      fleets.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      return fleets
    },
    userFleets () {
      return this.username ? this.userFleetsGet(this.username) : []
    },
    userFleetsIds () {
      return this.userFleets.map(fleet => fleet.id)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      fleetsSummonAction: FLEETS_SUMMON,
      userFleetRemoveAction: USER_FLEET_REMOVE
    }),
    init () {
      this.fleetsSummon()
    },
    async fleetsSummon () {
      const componentSelf = this
      await this.fleetsSummonAction({ componentSelf })
    },
    async userFleetRemove () {
      const componentSelf = this
      const username = this.username
      const fleetId = this.fleetId
      const payload = {
        username,
        fleetId,
        body: {}
      }
      await this.userFleetRemoveAction({ componentSelf, payload })
      this.$emit('user-fleet-remove-complete')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .user-fleet-remove-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
