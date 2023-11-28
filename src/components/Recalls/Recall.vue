<template>
  <div v-if="recall" class="recall">
    <recall-display-card class="recall-display" :recall-id="recallId"/>
    <div v-if="!recall.remedy">
      <h3>Remedy
        <v-tooltip v-if="operatorCanEditRecall" bottom>
          <template #activator="{ on }">
            <v-icon v-on='on' @click="openRemedyCreate">mdi-plus-box</v-icon>
          </template>
          <span>Add remedy for recall</span>
        </v-tooltip>
      </h3>
    </div>
      <!-- Vins section -->
      <h5>Recalled VINs
        <v-tooltip v-if="!recallContainsAllVins && operatorCanAddVehicle" bottom>
          <template #activator="{ on }">
            <v-icon v-on='on' @click="openRecallAddVehicle">mdi-plus-box</v-icon>
          </template>
          <span>Add vehicle to recall</span>
        </v-tooltip>
      </h5>
      <div>
        <v-data-table
          :footer-props="dataTableDefaultFooterProps"
          :headers="tableHeaders"
          :items="recall.vehicles"
          :items-per-page="20"
          dense
        >
          <template v-slot:top>
            <v-container fluid class="filter">
              <v-row class="filter-fields">
                <v-col cols="12" xl="3" lg="3" md="6" sm="12">
                  <v-row class="pa-3">
                    <v-text-field
                      v-model="vinFilterValue"
                      append-icon="search"
                      clearable
                      dense
                      hide-details
                      outlined
                      placeholder="Filter by text match"
                      aria-label="Filter by text match"
                      class="text-filter vin-filter"
                    />
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <template #[`item.vin`]="{ item }">
              <router-link :to="vehicleLinkObject(item.vin)">{{item.vin}}</router-link>
          </template>
          <template #[`item.serviceDate`]="{ item }">
            {{ formatDate(item.serviceDate) }}
          </template>
          <template #[`item.actions`]="{ item }">
            <v-tooltip v-if="!item.serviceDate && operatorCanServiceVehicle && recall.remedy" bottom>
              <template #activator="{ on }">
                <v-icon v-on='on' @click="openRecallServiceVehicle(item.vin)">mdi-car-wrench</v-icon>
              </template>
              <span>Mark Serviced</span>
            </v-tooltip>
            <v-tooltip v-if="item.serviceDate && operatorCanEditVehicle" bottom>
              <template #activator="{ on }">
                <v-icon v-on='on' @click="openRecallEditVehicle(item.vin)">mdi-pencil-box</v-icon>
              </template>
              <span>Edit Vehicle Service</span>
            </v-tooltip>
            <v-tooltip v-if="operatorCanRemoveVehicle" bottom>
              <template #activator="{ on }">
                <v-icon v-on='on' @click="openRecallRemoveVehicle(item.vin)">mdi-minus-box</v-icon>
              </template>
              <span>Remove Vehicle</span>
            </v-tooltip>
          </template>
        </v-data-table>
        <context-bar-toggle
          :visible="operatorCanAccessContextMenu"
          @context-bar-visible="toggleContextBar"
        />
        <context-bar
          :recall-id="recallId"
          :content-type="contextBarContentType"
          :vin="contextBarVin"
          :visible="contextBarVisible"
          @change-context="changeContext"
          @context-bar-visible="toggleContextBar($event)"
          @recall-action-cancel="closeContextBar"
          @recall-action-complete="closeContextBar"
          @remedy-action-cancel="closeContextBar"
          @remedy-action-complete="closeContextBar"
          @vehicle-action-cancel="closeContextBar"
          @vehicle-action-complete="closeContextBar"
        />
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_RECALL_ADMIN,
  ACCESS_RECALL_CREATE,
  ACCESS_VEHICLE_SERVICE,
  RECALL,
  VINS
} from '@/store/getter-types'
import dateUtility from '@/lib/dateUtility'

import ContextBarToggle from '@/components/ContextBarToggle.vue'
import ContextBar from '@/components/Recalls/RecallContextBar/ContextBar.vue'
import RecallDisplayCard from '@/components/Recalls/RecallDisplayCard.vue'

import utility from '@/lib/utility'

export default {
  name: 'RecallComponent',
  components: {
    ContextBar,
    ContextBarToggle,
    RecallDisplayCard
  },
  props: {
    recallId: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    contextBarContentType: null,
    contextBarVin: null,
    contextBarVisible: false,
    vinFilterValue: ''
  }),
  computed: {
    ...mapGetters({
      operatorCanAddVehicle: ACCESS_RECALL_ADMIN,
      operatorCanDeleteRecall: ACCESS_RECALL_ADMIN,
      operatorCanEditRecall: ACCESS_RECALL_CREATE,
      operatorCanEditVehicle: ACCESS_RECALL_ADMIN,
      operatorCanRemoveVehicle: ACCESS_RECALL_ADMIN,
      operatorCanServiceVehicle: ACCESS_VEHICLE_SERVICE,
      recallGet: RECALL,
      vins: VINS
    }),
    recallContainsAllVins () {
      return this.recall && this.vins ? this.recall.vehicles.length === this.vins.length : null
    },
    dataTableDefaultFooterProps () {
      return utility.dataTableDefaultFooterProps()
    },
    operatorCanAccessContextMenu () {
      // this should check using an OR for each item/permission in the context menu
      return this.operatorCanDeleteRecall ||
             this.operatorCanEditRecall ||
             this.operatorCanServiceVehicle
    },
    recall () {
      return this.recallId ? this.recallGet(this.recallId) : null
    },
    tableHeaders () {
      const headers = [
        {
          text: 'VIN',
          value: 'vin',
          sortable: true,
          filter: this.filterVin
        },
        {
          text: 'Vehicle Recall Id',
          value: 'id',
          sortable: true
        },
        {
          text: 'Remedy Completed',
          value: 'serviceDate',
          sortable: true
        },
        {
          text: 'Service Reference',
          value: 'serviceReference',
          sortable: true
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        }
      ]
      return headers
    }
  },
  methods: {
    changeContext (event) {
      this.contextBarVisible = true
      this.contextBarContentType = event.contentType
      if (event.params !== undefined) {
        if (event.contentType === 'vehicle-service' ||
        event.contentType === 'vehicle-remove' ||
        event.contentType === 'vehicle-edit') {
          if (event.params.vin !== undefined) {
            this.contextBarVin = event.params.vin
          } else {
            this.contextBarVin = null
            this.contextBarContentType = null
          }
        }
      }
    },
    closeContextBar () {
      this.toggleContextBar(false)
    },
    filterVin (value) {
      if (!this.vinFilterValue) {
        return true
      }
      // Check if the current loop value partially contains the searched word
      return value.toLowerCase().includes(this.vinFilterValue.toLowerCase())
    },
    formatDate (date) {
      return dateUtility.formatOutput(date)
    },
    openRecallAddVehicle () {
      this.changeContext({ contentType: 'vehicle-add' })
    },
    openRemedyCreate () {
      this.changeContext({ contentType: 'remedy-create' })
    },
    openRecallEditVehicle (vin) {
      this.changeContext({ contentType: 'vehicle-edit', params: { vin } })
    },
    openRecallRemoveVehicle (vin) {
      this.changeContext({ contentType: 'vehicle-remove', params: { vin } })
    },
    openRecallServiceVehicle (vin) {
      this.changeContext({ contentType: 'vehicle-service', params: { vin } })
    },
    toggleContextBar (visible, contentType = null) {
      this.contextBarVisible = visible
      this.contextBarContentType = contentType
    },
    vehicleLinkObject (vin) {
      return { name: 'vehicle', params: { vin } }
    }
  }
}
</script>

<style scoped lang="scss">
.recall {
  .recall-display {
    margin-bottom: 20px;
  }
  h5 {
    font-size: 1rem;
    font-weight: bold;
  }
  .vehicles {
    th {
      &:last-of-type {
        text-align: center;
      }
    }
  }
  .item-container {
    display: grid;
    vertical-align: baseline;
    grid-template-columns: 0.75fr 2fr;
    min-height: 40px;
    padding-bottom: 5px;
    & > label {
      font-weight: bold;
      &:after {
        content: ":";
        margin-right: 5px;
      }
    }
    &.status {
      input[type="radio"] {
        & + label {
          padding-right: 10px;
        }
      }
    }
  }
  .v-icon {
    &.mdi-plus-box {
      color: #28a745;
    }
    &.mdi-minus-box {
      color: #dc3545;
    }
    &.mdi-pencil-box {
      color: #17a2b8;
    }
    &.mdi-car-wrench {
      color: #28a745;
    }
  }
}
</style>
