<template>
  <div class="quick-actions-container">
    <h3>Model Releases Actions</h3>
    <v-list>
      <v-list-item v-if="operatorCanCreateModelRelease">
        <v-btn @click="modelReleaseCreate">
          Create Model Release
        </v-btn>
      </v-list-item>
      <v-list-item v-if="operatorCanSetModelReleasePart">
        <v-btn @click="modelReleasePartSet">
          Model Release - Part Set
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ACCESS_VEHICLES_ADMIN } from '@/store/getter-types'

export default {
  name: 'ModelReleasesActions',
  computed: {
    ...mapGetters({
      operatorCanCreateModelRelease: ACCESS_VEHICLES_ADMIN,
      operatorCanSetModelReleasePart: ACCESS_VEHICLES_ADMIN
    })
  },
  methods: {
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    modelReleaseCreate () {
      this.changePanel('model-release-create')
    },
    modelReleasePartSet () {
      this.changePanel('model-release-part-set')
    }
  }
}
</script>
