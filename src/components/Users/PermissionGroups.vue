<template>
  <div class="permission-groups-container">
    <h2>Permission Groups</h2>
    <ul v-if="userPermissionGroups.length" class="permission-groups">
      <li
        v-for="permissionGroup in userPermissionGroups"
        :key="permissionGroup"
        class="permission-group"
      >
        {{ permissionGroup }}
      </li>
    </ul>
    <p v-else class="ml-5">No Groups</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { USER_PERMISSION_GROUPS } from '@/store/getter-types'
export default {
  name: 'PermissionGroups',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      userPermissionGroupsGet: USER_PERMISSION_GROUPS
    }),
    userPermissionGroups () {
      return this.username ? this.userPermissionGroupsGet(this.username) : []
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .user {
    .permission-groups-container {
      .permission-groups {
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
