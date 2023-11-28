<template>
  <div class="abilities-container">
    <h2>Abilities</h2>
    <ul v-if="userAbilities.length" class="abilities">
      <li
        v-for="ability in existingAbilities"
        :key="ability.id"
        class="ability"
      >
        {{ ability.id }}<span> - {{ ability.ability }}</span>
      </li>
    </ul>
    <p v-else class="ml-5">No Abilities</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { USER_ABILITIES } from '@/store/getter-types'

export default {
  name: 'UserAbilities',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      userAbilitiesGet: USER_ABILITIES
    }),
    existingAbilities () {
      if (this.userAbilities.length) {
        return [...this.userAbilities].sort((a, b) => {
          return a.id - b.id
        })
      }
      return []
    },
    userAbilities () {
      return this.username ? this.userAbilitiesGet(this.username) : []
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .user {
    .abilities-container {
      .abilities {
        list-style-type: none;
        columns: auto;
        @media screen and (max-width: 600px) {
          columns: 1;
        }
        @media screen and (min-width: 900px) {
          columns: 2;
        }
        @media screen and (min-width: 1200px) {
          columns: 3;
        }
      }
      h2 {
        margin-bottom:15px;
        margin-top:0px;
      }
    }
  }
}
</style>
