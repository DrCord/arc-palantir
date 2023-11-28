<template>
  <div class="preferences-container">
    <h2>Preferences</h2>
    <ul v-if="userPreferences.length" class="preferences">
      <li
        v-for="preference in userPreferences"
        :key="preference.preference"
        class="preference"
      >{{ preference.preference.replaceAll(/[_-]/g, ' ') | titleCase }} : {{preference.actualValue}}
      <v-icon v-if="preference.value===false" class="disabled">mdi-close-thick</v-icon>
      <v-icon v-else class="enabled">mdi-check-bold</v-icon>
      </li>
    </ul>
    <p v-else class="ml-5">No Preferences</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { USER_PREFERENCES } from '@/store/getter-types'

export default {
  name: 'UserPreferences',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      userPreferencesGet: USER_PREFERENCES
    }),
    userPreferences () {
      return this.username ? this.userPreferencesGet(this.username) : []
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .user {
    .preferences-container {
      .preferences {
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
        i.enabled {
          color: green;
          font-size: 24px;
        }
        i.disabled {
          color: red;
          font-size: 24px;
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
