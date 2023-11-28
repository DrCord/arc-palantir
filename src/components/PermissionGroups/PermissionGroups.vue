<template>
  <div class="permission-groups">
    <v-data-table
      :footer-props="dataTableDefaultFooterProps"
      :headers="tableHeaders"
      :items="permissionGroups"
      :items-per-page="defaultTableRows"
      :sort-by="['name']"
      @update:items-per-page="capturePagination"
    >
      <template #[`item.id`]="{ item }">
        <router-link :to="permissionGroupLinkObject(item.id)">{{
          item.id
        }}</router-link>
      </template>
      <template #[`item.name`]="{ item }">
        <router-link :to="permissionGroupLinkObject(item.id)">{{
          item.name
        }}</router-link>
      </template>
    </v-data-table>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <context-bar
      :content-type="contextBarContentType"
      :visible="contextBarVisible"
      @change-context="changeContext"
      @context-bar-visible="toggleContextBar($event)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_PERMISSION_GROUP_CREATE,
  PERMISSION_GROUPS
} from '@/store/getter-types'
import ContextBarToggle from '@/components/ContextBarToggle.vue'
import ContextBar from '@/components/PermissionGroups/PermissionGroupsContextBar/ContextBar.vue'

import TableRowsDefault from '@/mixins/TableRowsDefault.js'
import utility from '@/lib/utility'

export default {
  name: 'PermissionGroupsComponent',
  components: {
    ContextBar,
    ContextBarToggle
  },
  mixins: [TableRowsDefault],
  data: () => ({
    contextBarContentType: null,
    contextBarVisible: false,
    tableHeaders: [
      {
        text: 'Id',
        value: 'id',
        sortable: true
      },
      {
        text: 'Name',
        value: 'name',
        sortable: true
      }
    ]
  }),
  computed: {
    ...mapGetters({
      permissionGroups: PERMISSION_GROUPS,
      operatorCanCreatePermissionGroup: ACCESS_PERMISSION_GROUP_CREATE
    }),
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanCreatePermissionGroup
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
    permissionGroupLinkObject (id) {
      return {
        name: 'permission-group',
        params: { id }
      }
    },
    cancel () {
      this.toggleContextBar(true, null)
    },
    closeContextBar () {
      this.toggleContextBar(false)
    },
    createCancel () {
      this.cancel()
    }
  }
}
</script>
