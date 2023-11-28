<template>
  <div class="users-list-container">
    <v-list
      v-if="users.length"
      class="users-list"
      dense
    >
      <v-list-item v-for="username in users" :key="username">
        <router-link v-if="operatorCanAccessUsers"
          :to="userLinkObject(username)"
        >{{ userGet(username) ? userGet(username).displayName : username }}</router-link>
        <span v-else>{{ userGet(username).displayName }}</span>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item>None</v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  USERS_SUMMON
} from '@/store/action-types'
import {
  ACCESS_USERS,
  OPERATOR_ABILITIES,
  USER
} from '@/store/getter-types'
export default {
  name: 'UsersList',
  props: {
    users: {
      default: () => [],
      type: Array
    }
  },
  computed: {
    ...mapGetters({
      operatorCanAccessUsers: ACCESS_USERS,
      operatorAbilities: OPERATOR_ABILITIES,
      userGet: USER
    })
  },
  watch: {
    operatorCanAccessUsers: {
      handler (newVal) {
        if (newVal) {
          this.usersSummonAction({ componentSelf: this, force: false })
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      usersSummonAction: USERS_SUMMON
    }),
    userLinkObject (username) {
      return {
        name: 'user',
        params: {
          username
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .users-list-container {
      ul {
        list-style: none;
      }
      .users-list {
        display: grid;
        grid-column-gap: 5px;
        grid-row-gap: 0;
        @media screen and (max-width: 600px) {
          grid-template-columns: 1fr;
        }
        @media screen and (min-width: 600px) {
          grid-template-columns: repeat(2, 1fr);
        }
        @media screen and (min-width: 768px) {
          grid-template-columns: repeat(3, 1fr);
        }
        @media screen and (min-width: 992px) {
          grid-template-columns: repeat(4, 1fr);
        }
        @media screen and (min-width: 1200px) {
          grid-template-columns: repeat(5, 1fr);
        }
      }
    }
}

</style>
