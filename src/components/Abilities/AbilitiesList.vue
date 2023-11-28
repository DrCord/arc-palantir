<template>
  <div class="users-abilities-list">
    <div class="search-container">
      <v-text-field
        v-model="abilityFilter"
        dense
        outlined
        placeholder="Search for Ability"
      />
    </div>
    <v-data-table
      id="abilities-table"
      :footer-props="dataTableDefaultFooterProps"
      :headers="tableHeaders"
      :item-class="tableClasses"
      :items="abilities"
      :items-per-page="defaultTableRows"
      :search="abilityFilter"
      :sort-by="['ability']"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
      @update:items-per-page="capturePagination"
    >
      <template #expanded-item="{ item }">
        <td :colspan="tableHeaders.length">
          <b>Permissions</b>
          <ul class="permission-list">
            <li
              v-for="permission in item.permissions"
              :key="permission.permission"
            >
              <v-tooltip right>
                <template #activator="{ on }">
                  <span v-on="on">{{ permission.permission }}</span>
                </template>
                <span>{{ permission.resource }}</span>
              </v-tooltip>
            </li>
          </ul>
        </td>
      </template>
    </v-data-table>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <abilities-context-bar
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
  ABILITIES,
  ACCESS_ABILITY_CREATE,
  ACCESS_ABILITY_DELETE,
  ACCESS_ABILITY_EDIT,
  ACCESS_PERMISSIONS,
  ACCESS_USERS,
  OPERATOR_ABILITIES,
  OPERATOR_USERNAME
} from '@/store/getter-types'

import AbilitiesContextBar from '@/components/Abilities/ContextBar/ContextBar.vue'
import ContextBarToggle from '@/components/ContextBarToggle.vue'

import utility from '@/lib/utility'
import TableRowsDefault from '@/mixins/TableRowsDefault.js'

export default {
  name: 'UserAbilitiesList',
  components: {
    ContextBarToggle,
    AbilitiesContextBar
  },
  mixins: [TableRowsDefault],
  data: () => ({
    contextBarContentType: null,
    contextBarVisible: false,
    abilityFilter: '',
    tableHeaders: [
      {
        text: 'Id',
        value: 'id',
        sortable: true
      },
      {
        text: 'Ability',
        value: 'ability',
        sortable: true
      },
      {
        text: 'Description',
        value: 'description',
        sortable: true
      },
      {
        text: 'Constant',
        value: 'constant',
        sortable: true
      }
    ]
  }),
  computed: {
    ...mapGetters({
      abilities: ABILITIES,
      operatorAbilities: OPERATOR_ABILITIES,
      operatorCanAccessPermissions: ACCESS_PERMISSIONS,
      operatorCanAccessUsers: ACCESS_USERS,
      operatorCanCreateAbility: ACCESS_ABILITY_CREATE,
      operatorCanDeleteAbility: ACCESS_ABILITY_DELETE,
      operatorCanEditAbility: ACCESS_ABILITY_EDIT,
      operatorUsername: OPERATOR_USERNAME
    }),
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanCreateAbility ||
             this.operatorCanDeleteAbility ||
             this.operatorCanEditAbility
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
.users-abilities-list {
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
  .ability-description {
    text-align: center;
  }
  #abilities-table ::v-deep .clickable {
    cursor: pointer;
  }
}
</style>
