<template>
  <div class="quick-actions-container">
    <h3>Authorities Actions</h3>
    <v-list>
      <v-list-item v-if="operatorCanCreateAuthority">
        <v-btn @click="create">
          Create
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ACCESS_AUTHORITY_CREATE } from '@/store/getter-types'

export default {
  name: 'AuthoritiesActions',
  computed: {
    ...mapGetters({
      operatorCanCreateAuthority: ACCESS_AUTHORITY_CREATE
    })
  },
  methods: {
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    create () {
      this.changePanel('authority-create')
    }
  }
}
</script>
