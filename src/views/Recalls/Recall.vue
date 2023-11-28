<template>
  <div class="recall">
    <page-header title="Recall" />
    <div class="recall-container content-container">
      <RecallComponent :recall-id="recallId" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { RECALL_SUMMON } from '@/store/action-types'
import { OPERATOR_LOADED } from '@/store/getter-types'

import PageHeader from '@/components/PageHeader.vue'
import RecallComponent from '@/components/Recalls/Recall.vue'

import utility from '@/lib/utility'

export default {
  name: 'RecallView',
  components: {
    PageHeader,
    RecallComponent
  },
  data: () => ({
    recallId: null
  }),
  computed: {
    ...mapGetters({
      operatorLoaded: OPERATOR_LOADED
    })
  },
  watch: {
    operatorLoaded: {
      handler (newVal) {
        if (newVal) {
          this.recallSummon()
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
      recallSummonAction: RECALL_SUMMON
    }),
    init () {
      if (!this.$route.params.id) {
        this.redirectToRecalls()
      }
    },
    async recallSummon () {
      const recallId = parseInt(this.$route.params.id, 10)
      const componentSelf = this
      await this.recallSummonAction({ componentSelf, recallId })
      this.recallId = recallId
    },
    redirectToRecalls () {
      utility.redirect(this, 'recalls')
    }
  }
}
</script>

<style scoped>
.fa-search {
  color: #2c3e50;
}
</style>
