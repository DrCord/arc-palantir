<template>
  <div class="ability-grant-container">
    <h3>Grant Ability</h3>
    <div v-if="availableUsers.length">
      <label for="users" class="required">Users</label>
      <v-select
        v-model="username"
        :items="availableUsers"
        item-text="displayName"
        item-value="username"
        outlined
        @change="userSelected"
      ></v-select>
      <div v-if="username">
        <div v-if="availableAbilities.length">
          <label for="abilities" class="required">Abilities</label>
          <v-select
            v-model="abilityId"
            :items="availableAbilities"
            item-text="ability"
            item-value="id"
            outlined
          ></v-select>
          <v-btn
            :disabled="!username || !abilityId"
            @click="abilityGrant"
          >Grant Ability</v-btn>
        </div>
        <div v-else>
          <h4>No abilities to grant to user</h4>
        </div>
      </div>
    </div>
    <div v-else>
      <h4>No users available</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  USER_ABILITY_GRANT,
  USER_SUMMON,
  USERS_SUMMON
} from '@/store/action-types'
import {
  ABILITIES,
  OPERATOR_USERNAME,
  USER,
  USER_ABILITIES,
  USERS
} from '@/store/getter-types'

export default {
  name: 'AbilityGrant',
  data () {
    return {
      abilityId: null,
      user: null,
      username: null
    }
  },
  computed: {
    ...mapGetters({
      abilities: ABILITIES,
      operatorUsername: OPERATOR_USERNAME,
      userAbilitiesGet: USER_ABILITIES,
      userGet: USER,
      users: USERS
    }),
    availableAbilities () {
      // check against all abilities
      const abilities = this.abilities.filter(ability => {
        return !this.userAbiltiesIds.includes(ability.id)
      })
      // sort by ability name
      abilities.sort((a, b) => (a.ability > b.ability) ? 1 : ((b.ability > a.ability) ? -1 : 0))
      return abilities
    },
    availableUsers () {
      // sort by displayName
      const users = JSON.parse(JSON.stringify(this.users))
      users.sort((a, b) => (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0))
      return users
    },
    userAbilities () {
      return this.username ? this.userAbilitiesGet(this.username) : []
    },
    userAbiltiesIds () {
      return this.username ? this.userAbilities.map(ability => ability.id) : []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      abilityGrantAction: USER_ABILITY_GRANT,
      usersSummonAction: USERS_SUMMON,
      userSummonAction: USER_SUMMON
    }),
    init () {
      this.usersSummon()
    },
    abilityGrant () {
      const componentSelf = this
      const { abilityId, userGrantAbilityAction, username } = this
      const payload = {
        username,
        abilityId,
        body: {}
      }
      userGrantAbilityAction({ componentSelf, payload })
        .then(() => {
          this.$emit('user-grant-ability-complete')
        })
    },
    userSelected () {
      if (this.username) {
        const username = this.username
        const componentSelf = this
        const force = false
        this.userSummonAction({ componentSelf, username, force })
          .then(() => {
            this.user = this.userGet(username)
          })
      }
    },
    usersSummon () {
      const componentSelf = this
      const force = false
      this.usersSummonAction({ componentSelf, force })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .ability-grant-container {
    h3 {
      margin-bottom: 20px;
    }
  }
}
</style>
