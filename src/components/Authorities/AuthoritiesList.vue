<template>
  <div class="authorities-container">
    <div class="search-container">
      <v-text-field
        id="authorities-search"
        v-model="authoritiesFilter"
        dense
        outlined
        placeholder="Filter Authorities"
      />
    </div>
    <v-data-table
      :footer-props="dataTableDefaultFooterProps"
      :headers="tableHeaders"
      :items="authorities"
      :items-per-page="defaultTableRows"
      :search="authoritiesFilter"
      :sort-by="['id']"
      @update:items-per-page="capturePagination"
    >
      <template #[`item.id`]="{ item }">
        <router-link :to="authorityLinkObject(item.id)">{{
          item.id
        }}</router-link>
      </template>
      <template #[`item.description`]="{ item }">
        <router-link :to="authorityLinkObject(item.id)">{{
          item.description
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
  ACCESS_AUTHORITY_CREATE,
  AUTHORITIES
} from '@/store/getter-types'
import ContextBarToggle from '@/components/ContextBarToggle.vue'
import ContextBar from '@/components/Authorities/AuthoritiesContextBar/ContextBar.vue'

import TableRowsDefault from '@/mixins/TableRowsDefault.js'
import utility from '@/lib/utility'

export default {
  name: 'AuthoritiesList',
  components: {
    ContextBarToggle,
    ContextBar
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
        text: 'Description',
        value: 'description',
        sortable: true
      },
      {
        text: 'Parent Id',
        value: 'parentId',
        sortable: true
      }
    ],
    sortInfo: {
      type: 'id',
      dir: 'asc'
    },
    authoritiesFilter: ''
  }),
  computed: {
    ...mapGetters({
      authorities: AUTHORITIES,
      operatorCanCreateAuthority: ACCESS_AUTHORITY_CREATE
    }),
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanCreateAuthority
    }
  },
  methods: {
    authorityLinkObject (id) {
      return {
        name: 'authority',
        params: { id }
      }
    },
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
    },
    closeContextBar () {
      this.toggleContextBar(false)
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    }
  }
}
</script>

<style scoped lang="scss">
.authorities {
  .search-container {
    max-width: 350px;
  }
}
</style>
