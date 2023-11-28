<template>
  <div class="user-fleet-add-container">
    <h3>Add User to Fleets</h3>
    <div class="controls">
      <v-autocomplete
        ref="fleetAutocomplete"
        v-model="fleetObjects"
        :items="availableFleets"
        item-text="name"
        return-object
        outlined
        multiple
        dense
        clearable
        small-chips
        deletable-chips
        no-data-text="No Fleets To Add"
        placeholder="Select Fleets"
        open-on-clear
      ></v-autocomplete>
    </div>
    <v-btn
        block
        :disabled="fleetObjects.length === 0"
        color=success
        @click="userFleetAdd"
      >Save</v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEETS_SUMMON,
  USER_FLEET_ADD
} from '@/store/action-types'
import {
  FLEETS,
  LOADING,
  USER_FLEETS
} from '@/store/getter-types'

export default {
  name: 'UserFleetAdd',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      fleetObjects: [],
      filter: null
    }
  },
  computed: {
    ...mapGetters({
      fleets: FLEETS,
      loading: LOADING,
      userFleetsGet: USER_FLEETS
    }),
    availableFleets () {
      const fleets = this.fleets.filter(
        fleet => {
          return !this.userFleets.includes(fleet.id)
        }
      )
      fleets.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      return fleets
    },
    userFleets () {
      return this.username ? this.userFleetsGet(this.username) : []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      fleetsSummonAction: FLEETS_SUMMON,
      userFleetAddAction: USER_FLEET_ADD
    }),
    init () {
      this.fleetsSummon()
    },
    async fleetsSummon () {
      const componentSelf = this
      await this.fleetsSummonAction({ componentSelf })
    },
    async userFleetAdd () {
      const componentSelf = this
      const username = this.username
      const fleetObjects = this.fleetObjects

      for (const fleet of fleetObjects) {
        const fleetId = fleet.id
        const payload = {
          username,
          fleetId,
          body: {}
        }
        await this.userFleetAddAction({ componentSelf, payload })
        this.$emit('user-fleet-add-complete')
      }
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .user-fleet-add-container {
     h3 {
          margin-bottom: 20px;
          white-space: nowrap;
        }
    .controls{
      display: flex;
      flex-direction: column
    }
  }
}
</style>
