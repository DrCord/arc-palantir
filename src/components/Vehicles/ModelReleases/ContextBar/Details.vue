<template>
  <v-card class="details-container">
    <v-card-title>
      <h3>Model Release {{ modelReleaseId }} Details</h3>
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Model Name</v-list-item-title>
              {{ modelRelease.modelName }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Description</v-list-item-title>
              {{ modelRelease.modelReleaseDescription }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Created</v-list-item-title>
              {{ modelRelease.created }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="parts">
            <v-list-item-content>
            <v-list-item-title>Parts</v-list-item-title>
              <v-data-table
                disable-pagination
                disable-sort
                disable-filtering
                hide-default-footer
                fixed-header
                :headers="tableHeaders"
                :items="parts"
                :options="tableOptions"
                :sort-by="['partType']"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { VEHICLES_MODEL_RELEASES } from '@/store/getter-types'
export default {
  name: 'ModelReleaseDetails',
  props: {
    modelReleaseId: {
      default: null,
      type: Number
    }
  },
  data: () => ({
    tableHeaders: [
      {
        text: 'Part Type',
        value: 'partType',
        sortable: true
      },
      {
        text: 'Part Number',
        value: 'partNumber',
        sortable: true
      }
    ],
    tableOptions: {
      itemsPerPage: 20
    }
  }),
  computed: {
    ...mapGetters({
      modelReleases: VEHICLES_MODEL_RELEASES
    }),
    modelRelease () {
      return this.modelReleases.find(modelRelease => modelRelease.modelReleaseId === this.modelReleaseId)
    },
    parts () {
      return this.modelRelease.parts !== undefined ? this.modelRelease.parts : []
    }
  },
  methods: {
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .details-container {
    .parts {
      .v-list-item__title {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
