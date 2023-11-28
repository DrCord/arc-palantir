<template>
  <div class="model-releases-list">
    <div class="search-container">
      <v-text-field
        v-model="modelReleasesFilter"
        dense
        outlined
        placeholder="Search for Model Release"
      />
    </div>
    <v-data-table
      class="model-releases-table"
      :footer-props="dataTableDefaultFooterProps"
      :headers="tableHeaders"
      :item-class="tableClasses"
      :items="modelReleases"
      :items-per-page="defaultTableRows"
      :search="modelReleasesFilter"
      :sort-by="['modelReleaseId']"
      @click:row="(item, slot) => showParts(item)"
      @update:items-per-page="capturePagination"
    >
      <template #top>
        <h4>Click a row to view details</h4>
      </template>
    </v-data-table>
    <context-bar-toggle
      :visible="operatorCanAccessContextMenu"
      @context-bar-visible="toggleContextBar"
    />
    <context-bar
      :content-type="contextBarContentType"
      :model-release-id="modelReleaseId"
      :visible="contextBarVisible"
      @change-context="changeContext"
      @close-context="closeContext"
      @context-bar-visible="toggleContextBar($event)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_VEHICLES_ADMIN,
  VEHICLES_MODEL_RELEASES
} from '@/store/getter-types'

import ContextBar from '@/components/Vehicles/ModelReleases/ContextBar/ContextBar.vue'
import ContextBarToggle from '@/components/ContextBarToggle.vue'

import TableRowsDefault from '@/mixins/TableRowsDefault.js'
import utility from '@/lib/utility'

export default {
  name: 'ModelReleasesComponent',
  components: {
    ContextBar,
    ContextBarToggle
  },
  mixins: [TableRowsDefault],
  data: () => ({
    contextBarContentType: null,
    contextBarVisible: false,
    modelReleasesFilter: '',
    modelReleaseId: null,
    tableHeaders: [
      {
        text: 'Id',
        value: 'modelReleaseId',
        sortable: true
      },
      {
        text: 'Model Name',
        value: 'modelName',
        sortable: true
      },
      {
        text: 'Description',
        value: 'modelReleaseDescription',
        sortable: false
      },
      {
        text: 'Created',
        value: 'created',
        sortable: true
      }
    ]
  }),
  computed: {
    ...mapGetters({
      modelReleases: VEHICLES_MODEL_RELEASES,
      operatorCanCreateModelRelease: ACCESS_VEHICLES_ADMIN,
      operatorCanSetModelReleasePart: ACCESS_VEHICLES_ADMIN
    }),
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanCreateModelRelease ||
             this.operatorCanSetModelReleasePart
    }
  },
  methods: {
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
      if (event.params !== undefined) {
        if (event.contentType === 'model-release-details') {
          if (event.params.modelReleaseId !== undefined) {
            this.modelReleaseId = event.params.modelReleaseId
          } else {
            this.modelReleaseId = null
            this.contextBarContentType = null
          }
        }
      }
    },
    showParts (item) {
      const event = {
        contentType: 'model-release-details',
        params: {
          modelReleaseId: item.modelReleaseId
        }
      }
      this.changeContext(event)
    },
    tableClasses () {
      return 'clickable'
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    },
    closeContext () {
      this.contextBarVisible = false
      this.contextBarContentType = null
    }
  }
}
</script>

<style scoped lang='scss'>
.model-releases-list {
  h4 {
    padding-top: 20px;
  }
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
  // TODO adjust components so custom margin is not needed
  .floating-button {
    top: -90px;
  }
  .model-releases-table ::v-deep .clickable {
    cursor: pointer;
  }
}
</style>
