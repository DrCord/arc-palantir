<template>
  <div class="quick-actions-container">
    <h3>Users Actions</h3>
    <v-list>
      <v-list-item>
        <v-btn @click="create">
          Create
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_USER_CREATE
} from '@/store/getter-types'

export default {
  name: 'UsersActions',
  computed: {
    ...mapGetters({
      operatorCanCreateUser: ACCESS_USER_CREATE
    })
  },
  methods: {
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    create () {
      this.changePanel('user-create')
    }
  }
}
</script>
