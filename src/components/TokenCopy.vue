<template>
  <v-list-item
    v-if="operatorLoaded && operatorAdmin"
    @click="copyTokenToClipboard"
  >
    <v-list-item-title>Copy Token</v-list-item-title>
  </v-list-item>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_SUPER_ADMIN,
  OPERATOR_LOADED
} from '@/store/getter-types'

export default {
  name: 'TokenCopy',
  computed: {
    ...mapGetters({
      operatorAdmin: ACCESS_SUPER_ADMIN,
      operatorLoaded: OPERATOR_LOADED
    }),
    token () {
      return this.operatorAdmin ? this.$store.state.session.idToken : null
    }
  },
  methods: {
    copyTokenToClipboard () {
      this.$clipboard(this.token)
    }
  }
}
</script>
