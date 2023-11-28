<template>
  <div class="ability-grant-container">
    <h3>Grant Ability</h3>
    <div v-if="availableAbilities.length">
      <v-select
        v-model="abilityId"
        :items="availableAbilities"
        item-text="ability"
        item-value="id"
        outlined
      ></v-select>
      <v-btn
        :disabled="!abilityId"
        @click="grantAbility"
      >Grant Ability</v-btn>
    </div>
    <div v-else>
      <h4>No abilities available to grant</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { USER_ABILITY_GRANT } from '@/store/action-types'
import {
  ABILITIES,
  USER_ABILITIES
} from '@/store/getter-types'

export default {
  name: 'AbilityGrant',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      abilityId: null
    }
  },
  computed: {
    ...mapGetters({
      abilities: ABILITIES,
      userAbilitiesGet: USER_ABILITIES
    }),
    availableAbilities () {
      // check against user abilities
      const abilities = this.abilities.filter(ability => {
        return !this.userAbiltiesIds.includes(ability.id)
      })
      // sort by ability name
      abilities.sort((a, b) => (a.ability > b.ability) ? 1 : ((b.ability > a.ability) ? -1 : 0))
      return abilities
    },
    userAbilities () {
      return this.username ? this.userAbilitiesGet(this.username) : []
    },
    userAbiltiesIds () {
      return this.userAbilities.map(ability => ability.id)
    }
  },
  methods: {
    ...mapActions({
      userGrantAbilityAction: USER_ABILITY_GRANT
    }),
    grantAbility () {
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
