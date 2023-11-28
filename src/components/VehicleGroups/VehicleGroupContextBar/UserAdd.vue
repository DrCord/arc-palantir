<template>
  <div class="fleet-user-add-container">
    <h3>Add User to Fleet</h3>
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
        @click="fleetUserAdd"
      >Add User</v-btn>
    </div>
    <div v-else>
      <h4 v-if="loading">Loading Data...</h4>
      <h4 v-else>No users available to add to fleet</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FLEET_USER_ADD,
  USERS_SUMMON
} from '@/store/action-types'
import {
  FLEET_USERS,
  LOADING,
  USERS
} from '@/store/getter-types'

export default {
  name: 'FleetUserAdd',
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
        return !this.fleetUsers.includes(user.username)
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
      fleetUserAddAction: FLEET_USER_ADD,
      usersSummonAction: USERS_SUMMON
    }),
    init () {
      this.usersSummon()
    },
    async fleetUserAdd () {
      const componentSelf = this
      const { fleetId, username } = this
      const payload = {
        username,
        fleetId,
        body: {}
      }
      await this.fleetUserAddAction({ componentSelf, payload })
      this.$emit('fleet-add-user-complete')
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
  .fleet-user-add-container {
    h3 {
      margin-bottom: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
