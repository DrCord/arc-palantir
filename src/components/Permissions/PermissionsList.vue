<template>
  <div class="users-permissions-list">
    <div class="search-container">
      <v-text-field
        v-model="permissionFilter"
        dense
        outlined
        placeholder="Search for Permission"
      />
    </div>
    <v-data-table
      id="permissions-table"
      :footer-props="dataTableDefaultFooterProps"
      :headers="tableHeaders"
      :item-class="tableClasses"
      :items="permissions"
      :items-per-page="defaultTableRows"
      :search="permissionFilter"
      :sort-by="['permission']"
      @update:items-per-page="capturePagination"
    >
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PERMISSIONS } from '@/store/getter-types'

import TableRowsDefault from '@/mixins/TableRowsDefault.js'
import utility from '@/lib/utility'

export default {
  name: 'PermissionsList',
  mixins: [TableRowsDefault],
  data: () => ({
    contextBarContentType: null,
    contextBarVisible: false,
    permissionFilter: '',
    tableHeaders: [
      {
        text: 'Permission',
        value: 'permission',
        sortable: true
      },
      {
        text: 'Description',
        value: 'description',
        sortable: false
      },
      {
        text: 'Resource',
        value: 'resource',
        sortable: false
      }
    ]
  }),
  computed: {
    ...mapGetters({
      permissions: PERMISSIONS
    }),
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
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
    tableClasses () {
      return 'clickable'
    }
  }
}
</script>

<style scoped lang='scss'>
.users-permissions-list {
  .search-container {
    margin-bottom: 10px;
    max-width: 350px;
  }
  .permission-list {
    display: grid;
    list-style: none;
    @media screen and (max-width: 600px) {
      grid-template-columns: 1fr;
    }
    @media screen and (min-width: 900px) {
      grid-template-columns: 1fr 1fr;
    }
    @media screen and (min-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .permission-description {
    text-align: center;
  }
  #permissions-table ::v-deep .clickable {
    cursor: pointer;
  }
}
</style>
