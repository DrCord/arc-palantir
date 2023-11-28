<template>
  <div id="users-container">
    <div v-if="users.length" id="users">
      <div class="search-container">
        <v-text-field
          id="user-search"
          v-model="userFilter"
          dense
          outlined
          placeholder="Filter Users"
          aria-label="Filter Users"
        />
      </div>
      <v-data-table
        id="users-table"
        :footer-props="dataTableDefaultFooterProps"
        :headers="tableHeaders"
        :items="users"
        :items-per-page="defaultTableRows"
        :search="userFilter"
        :sort-by="['displayName']"
        @update:items-per-page="capturePagination"
      >
        <!-- whole row slot to handle tooltip on row hover -->
        <template #item="{ item }">
          <v-tooltip top>
            <template #activator="{ on }">
              <tr class="clickable" @click="copyToClipboard(item.username)" v-on="on">
            <td>
              <router-link v-if="item.username" :to="userLinkObject(item.username)">{{
                item.displayName
              }}</router-link>
            </td>
            <td>{{ item.email }}</td>
            <td>{{ item.phone ? item.phone.replace(/(\+\d{1})(\d{3})(\d{3})(\d{4})/, '($2) $3-$4') : '' }}</td>
          </tr>
            </template>
            <span>Click to copy username</span>
          </v-tooltip>

        </template>
      </v-data-table>
    </div>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <users-context-bar
      :content-type="contextBarContentType"
      :visible="contextBarVisible"
      @change-context="changeContext"
      @context-bar-visible="toggleContextBar($event)"
      @user-create-cancel="userCreateCancel"
      @user-create-complete="userCreateComplete"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ContextBarToggle from '@/components/ContextBarToggle.vue'
import UsersContextBar from '@/components/Users/UsersContextBar/ContextBar.vue'
import CopyToClipboard from '@/mixins/CopyToClipboard.js'
import {
  ACCESS_USER_CREATE,
  USERS
} from '@/store/getter-types'

import TableRowsDefault from '@/mixins/TableRowsDefault.js'
import utility from '@/lib/utility'

export default {
  name: 'Users',
  components: {
    ContextBarToggle,
    UsersContextBar
  },
  mixins: [CopyToClipboard, TableRowsDefault],
  props: {
    quickLinkAction: {
      default: null,
      type: Object
    }
  },
  data: () => ({
    contextBarContentType: null,
    contextBarVisible: false,
    tableHeaders: [
      {
        text: 'Display Name',
        value: 'displayName',
        sortable: true
      },
      {
        text: 'Email',
        value: 'email',
        sortable: true
      },
      {
        text: 'Phone',
        value: 'phone',
        sortable: false
      }
    ],
    userFilter: ''
  }),
  computed: {
    ...mapGetters({
      operatorCanCreateUser: ACCESS_USER_CREATE,
      users: USERS
    }),
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanCreateUser
    }
  },
  watch: {
    quickLinkAction: {
      handler: function (newVal) {
        this.changeContext({ contentType: newVal.quick })
      }
    }
  },
  methods: {
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    },
    userLinkObject (username) {
      return {
        name: 'user',
        params: { username: username }
      }
    },
    userCreateCancel () {
      this.toggleContextBar(true, null)
    },
    userCreateComplete (event) {
      if (event && event.username && event.navigate) {
        const route = 'users/' + event.username
        this.$router.push(route)
      }
      this.toggleContextBar(false)
    }
  }
}
</script>

<style scoped lang='scss'>
#app {
  .users {
    .search-container {
      margin-bottom: 10px;
      max-width: 350px;
    }
    #users-table ::v-deep .clickable {
      cursor: pointer;
    }
  }
}
</style>
