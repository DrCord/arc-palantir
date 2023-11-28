<template>
  <div class="recalls">
    <v-data-table
      id="recalls-table"
      :footer-props="dataTableDefaultFooterProps"
      :headers="tableHeaders"
      :items="filteredRecalls"
      :items-per-page="defaultTableRows"
      :item-class="tableClasses"
      @update:items-per-page="capturePagination"
    >
      <template v-slot:top>
        <v-expansion-panels
          class="filter"
          :value="0"
          flat
          focusable
        >
          <v-expansion-panel>
            <v-expansion-panel-header class="header">
              <span class="action">
                <h3>Recalls
                  <v-tooltip v-if="operatorCanCreateRecall" bottom>
                    <template #activator="{ on }">
                      <v-icon v-on='on' @click="openRecallCreate">mdi-plus-box</v-icon>
                    </template>
                    <span>Create A New Recall</span>
                  </v-tooltip>
                </h3>
              </span>
              <span class="search">
                <h3>Search/Filter</h3>
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="filters">
              <v-container fluid class="filter">
                <v-row class="filter-fields">
                  <v-col>
                    <v-row class="pa-3">
                      <v-text-field
                        v-model="titleFilter"
                        append-icon="search"
                        clearable
                        dense
                        outlined
                        placeholder="Search by Title"
                        aria-label="Filter by text match"
                        class="text-filter title-filter"
                      />
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-row class="pa-3">
                      <v-text-field
                        v-model="nhtsaFilter"
                        append-icon="search"
                        clearable
                        dense
                        outlined
                        placeholder="Search by NHTSA Number"
                        aria-label="Filter by text match"
                        class="text-filter nhtsa-filter"
                      />
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
      <template #[`item.recallId`]="{ item }">
        <router-link :to="recallLinkObject(item.recallId)">{{ item.recallId }}</router-link>
      </template>
      <template #[`item.title`]="{ item }">
        <router-link :to="recallLinkObject(item.recallId)">{{ item.title }}</router-link>
      </template>
      <template #[`item.date`]="{ item }">
        {{ formattedDate(item.date) }}
      </template>
    </v-data-table>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <recalls-context-bar
      :content-type="contextBarContentType"
      :visible="contextBarVisible"
      @change-context="changeContext"
      @context-bar-visible="toggleContextBar($event)"
      @recall-create-cancel="closeContextBar"
      @recall-create-complete="recallCreateComplete"
      @vehicle-action-complete="closeContextBar"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_RECALL_CREATE,
  RECALLS
} from '@/store/getter-types'
import dateUtility from '@/lib/dateUtility'

import ContextBarToggle from '@/components/ContextBarToggle.vue'
import RecallsContextBar from '@/components/Recalls/RecallsContextBar/ContextBar.vue'

import utility from '@/lib/utility'
import TableRowsDefault from '@/mixins/TableRowsDefault.js'

export default {
  name: 'RecallsList',
  components: {
    ContextBarToggle,
    RecallsContextBar
  },
  mixins: [TableRowsDefault],
  data: () => ({
    contextBarContentType: null,
    contextBarVisible: false,
    nhtsaFilter: '',
    titleFilter: '',
    showDeletedRecalls: false,
    deletedText: 'This recall has been deleted.'
  }),
  computed: {
    ...mapGetters({
      operatorCanCreateRecall: ACCESS_RECALL_CREATE,
      recalls: RECALLS
    }),
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    filteredRecalls () {
      const recalls = [...this.recalls].reverse()
      if (!this.showDeletedRecalls) {
        return recalls.filter((recall) => {
          return recall.status !== 'deleted'
        })
      }
      return recalls
    },
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanCreateRecall
    },
    tableHeaders () {
      const headers = [
        {
          text: 'Id',
          value: 'recallId',
          sortable: true
        },
        {
          text: 'Title',
          value: 'title',
          sortable: true,
          filter: this.filterTitle
        },
        {
          text: 'Date',
          value: 'date',
          sortable: true
        },
        {
          text: 'Mfr. Campaign Id',
          value: 'mfrCampaignId',
          sortable: true
        },
        {
          text: 'NHTSA Number',
          value: 'nhtsaNumber',
          sortable: true,
          filter: this.filterNhtsa
        },
        {
          text: 'Safety Recall',
          value: 'safetyRecall',
          sortable: true
        }
      ]
      return headers
    }
  },
  methods: {
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
    },
    closeContextBar () {
      this.toggleContextBar(false)
    },
    filterNhtsa (value) {
      if (!this.nhtsaFilter) {
        return true
      }
      // Check if the current loop value partially contains the searched word.
      return value.toLowerCase().includes(this.nhtsaFilter.toLowerCase())
    },
    filterTitle (value) {
      if (!this.titleFilter) {
        return true
      }
      // Check if the current loop value partially contains the searched word.
      return value.toLowerCase().includes(this.titleFilter.toLowerCase())
    },
    formattedDate (date) {
      return dateUtility.formatOutput(date)
    },
    openRecallCreate () {
      this.changeContext({ contentType: 'recall-create' })
    },
    recallCreateComplete (event) {
      if (event && event.id && event.navigate) {
        const route = 'recalls/' + event.id
        this.$router.push(route)
      }
      this.closeContextBar()
    },
    recallLinkObject (id) {
      return {
        name: 'recall',
        params: { id }
      }
    },
    tableClasses (item) {
      if (item.status === 'deleted') {
        return 'deleted'
      }
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    }
  }
}
</script>

<style scoped lang='scss'>
#app{
  .filter {
    padding-bottom: 0;
    padding-top: 0;
    .header {
      color: #fff;
      .action {
        h3 {
          text-align: left;
        }
      }
      .search {
        h3 {
          text-align: right;
        }
      }
      h3 {
        color: #333;
        font-size: 1.2rem;
        margin-bottom: 0;
        margin-right: 10px;
      }
      .toggle-view {
        text-align: right;
      }
    }
    .filters {
      .filter-fields {
        margin-top: 0;
        .col {
          min-width: 100%;
          padding: 0;
        }
      }
    }
    .v-icon {
      &.mdi-plus-box {
        color: #28a745;
      }
    }
  }
  &.theme--dark {
    .filter {
      .header {
        color: rgb(30, 30, 30);
        h3 {
          color: #fff;
        }
      }
    }
  }
}
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
#app {
  .filter {
    .filters {
      .filter-fields {
        .col {
          min-width: 50%;
          padding-left: 10px;
          padding-right: 10px;
        }
      }
    }
  }
}
}
/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
#app {
  .filter {
    .filters {
      .filter-fields {
        .col {
          min-width: 50%;
          &:first-of-type {
            padding-left: 0;
          }
          &:last-of-type {
            padding-right: 0;
          }
        }
      }
    }
  }
}
}
.recalls ::v-deep label {

    margin-bottom: 0;
}
  #recalls-table ::v-deep .deleted {
    border-right: 1px solid red;
    border-left: 2px solid red;
    td {
      border-top: 2px solid red;
      border-bottom: 2px solid red;
    }
  }

</style>
