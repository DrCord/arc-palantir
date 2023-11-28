<template>
  <div class="quick-actions-container">
    <h3>Locations Actions</h3>
    <v-list>
      <v-list-item>
        <v-btn @click="createLocation">
          Create Location
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn @click="createLocationCode">
          Create Location Code
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn @click="deleteLocationCode">
          Delete Location Code
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'LocationsActions',
  methods: {
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    createLocation () {
      this.changePanel('location-create')
    },
    createLocationCode () {
      this.changePanel('location-code-create')
    },
    deleteLocationCode () {
      this.changePanel('location-code-delete')
    }
  }
}
</script>
