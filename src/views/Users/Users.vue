<template>
  <div class="users">
    <page-header title="Users" :quick-links="quickLinksLocal"  @quick-link-event="handleQuickLink" />
    <div class="users-container content-container">
      <users :quick-link-action="quickLink" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { USERS_SUMMON } from '@/store/action-types'
import { ACCESS_USER_CREATE, OPERATOR_LOADED } from '@/store/getter-types'

import PageHeader from '@/components/PageHeader.vue'
import Users from '@/components/Users/Users.vue'

export default {
  name: 'UsersView',
  components: {
    PageHeader,
    Users
  },
  data () {
    return {
      quickLink: null
    }
  },
  computed: {
    ...mapGetters({
      operatorLoaded: OPERATOR_LOADED,
      operatorCanCreateUser: ACCESS_USER_CREATE
    }),
    quickLinksLocal () {
      var links = []
      if (this.operatorCanCreateUser) {
        links = [
          { text: 'New User', emit: 'user-create' }
        ]
      }
      return links
    }
  },
  watch: {
    operatorLoaded: {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.usersSummon()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      usersSummonAction: USERS_SUMMON
    }),
    async usersSummon () {
      const componentSelf = this
      await this.usersSummonAction({ componentSelf })
    },
    handleQuickLink (quick) {
      this.quickLink = { quick: quick }
    }

  }
}
</script>
