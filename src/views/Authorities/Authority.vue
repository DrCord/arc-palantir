<template>
    <div class="authority">
      <page-header title="Authority" />
      <div class="authority-container content-container">
        <AuthorityComponent :authority-id="authorityId" />
      </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  AUTHORITIES_SUMMON,
  AUTHORITY_SUMMON
} from '@/store/action-types'
import {
  ACCESS_AUTHORITIES,
  AUTHORITY,
  OPERATOR_LOADED
} from '@/store/getter-types'

import AuthorityComponent from '@/components/Authorities/Authority.vue'
import PageHeader from '@/components/PageHeader.vue'

import utility from '@/lib/utility'

export default {
  name: 'AuthorityView',
  components: {
    AuthorityComponent,
    PageHeader
  },
  data () {
    return {
      authorityId: null
    }
  },
  computed: {
    ...mapGetters({
      authority: AUTHORITY,
      operatorLoaded: OPERATOR_LOADED,
      operatorCanAccessAuthorities: ACCESS_AUTHORITIES
    })
  },
  watch: {
    operatorLoaded: {
      handler (newVal) {
        if (newVal) {
          this.entitiesSummon()
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions({
      authoritiesSummonAction: AUTHORITIES_SUMMON,
      authoritySummonAction: AUTHORITY_SUMMON
    }),
    init () {
      if (!this.$route.params.id) {
        this.redirectToAuthorities()
      }
    },
    async authoritySummon () {
      if (this.operatorCanAccessAuthorities) {
        const authorityId = parseInt(this.$route.params.id, 10)
        const componentSelf = this
        const force = true
        await this.authoritySummonAction({ componentSelf, authorityId, force })
        this.authorityId = authorityId
      }
    },
    async entitiesSummon () {
      const componentSelf = this
      const force = false
      await this.authoritiesSummonAction({ componentSelf, force })
      this.authoritySummon()
    },
    redirectToAuthorities () {
      utility.redirect(this, 'authorities')
    }
  }
}
</script>
