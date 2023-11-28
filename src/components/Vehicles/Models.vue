<template>
  <div class="models-list">
    <div class="search-container">
      <v-text-field
        v-model="modelsFilter"
        dense
        outlined
        placeholder="Search for Model"
      />
    </div>
    <v-data-table
      class="models-table"
      :headers="tableHeaders"
      :items="models"
      :sort-by="['id']"
      :search="modelsFilter"
      :item-class="tableClasses"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { VEHICLES_MODELS } from '@/store/getter-types'

export default {
  name: 'ModelsComponent',
  data: () => ({
    modelsFilter: '',
    tableHeaders: [
      {
        text: 'Id',
        value: 'id',
        sortable: true
      },
      {
        text: 'Model Name',
        value: 'modelName',
        sortable: true
      },
      {
        text: 'Code',
        value: 'letterCode',
        sortable: true
      },
      {
        text: 'Description',
        value: 'description',
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
      models: VEHICLES_MODELS
    })
  },
  methods: {
    tableClasses () {
      return 'clickable'
    }
  }
}
</script>

<style scoped lang='scss'>
.models-list {
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
  .models-table ::v-deep .clickable {
    cursor: pointer;
  }
}
</style>
