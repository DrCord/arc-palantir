<template>
  <div class="permissions-container">
    <h2>Permissions</h2>
    <ul v-if="Object.entries(userPermissions).length" class="permissions">
      <li
        v-for="(data, name) in userPermissions"
        :key="name"
        class="permission"
      >{{ name }}<span> - {{ data }}</span>
      </li>
    </ul>
    <p v-else class="ml-5">No Permissions</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { USER_PERMISSIONS } from '@/store/getter-types'

export default {
  name: 'UserPermissions',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      userPermissionsGet: USER_PERMISSIONS
    }),
    userPermissions () {
      return this.username ? this.userPermissionsGet(this.username) : []
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .user {
    .permissions-container {
      .permissions {
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
