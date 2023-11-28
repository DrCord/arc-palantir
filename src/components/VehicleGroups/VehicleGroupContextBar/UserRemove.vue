<template>
  <div class="fleet-user-remove-container">
    <h3>Remove User from Fleet</h3>
    <div v-if="availableUsers.length">
      <v-select
        v-model="username"
        :items="availableUsers"
        item-text="displayName"
        item-value="username"
        outlined
      ></v-select>
      <v-btn
        :disabled="!username"
        color=success
        @click="fleetUserRemove"
      >Remove User</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No users available to remove from fleet</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEET_USER_REMOVE,
  USERS_SUMMON
} from '@/store/action-types'
import {
  FLEET_USERS,
  LOADING,
  USERS
} from '@/store/getter-types'

export default {
  name: 'FleetUserRemove',
  props: {
    fleetId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      username: null
    }
  },
  computed: {
    ...mapGetters({
      fleetUsersGet: FLEET_USERS,
      loading: LOADING,
      users: USERS
    }),
    availableUsers () {
      const users = this.users.filter(user => {
        return this.fleetUsers.includes(user.username)
      })
      users.sort((a, b) => (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0))
      return users
    },
    fleetUsers () {
      return this.fleetId ? this.fleetUsersGet(this.fleetId) : []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      fleetUserRemoveAction: FLEET_USER_REMOVE,
      usersSummonAction: USERS_SUMMON
    }),
    init () {
      this.usersSummon()
    },
    async fleetUserRemove () {
      const componentSelf = this
      const { fleetId, username } = this
      const payload = {
        username,
        fleetId,
        body: {}
      }
      await this.fleetUserRemoveAction({ componentSelf, payload })
      this.$emit('fleet-remove-user-complete')
    },
    async usersSummon () {
      const componentSelf = this
      await this.usersSummonAction({ componentSelf })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .fleet-user-remove-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
