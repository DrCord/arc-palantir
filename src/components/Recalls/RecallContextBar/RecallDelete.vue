<template>
  <div class="recall-delete-container">
    <h3>Delete Recall</h3>
    <div>
      <h4>Are you sure you want to delete this recall?</h4>
      <div class="btn-container">
        <v-btn
          class="cancel"
          color="error"
          dark
          @click="recallDeleteCancel"
        >Cancel<v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          class="submit"
          color="success"
          type="button"
          :disabled="!recallId"
          @click="recallDeleteSubmit"
        >Delete<v-icon>mdi-delete-circle</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { RECALL_DELETE } from '@/store/action-types'

import utility from '@/lib/utility'

export default {
  name: 'RecallDelete',
  props: {
    recallId: {
      type: Number,
      default: null
    }
  },
  methods: {
    ...mapActions({
      recallDeleteAction: RECALL_DELETE
    }),
    recallDeleteCancel () {
      this.$emit('recall-delete-cancel')
    },
    async recallDeleteSubmit () {
      const componentSelf = this
      const recallId = this.recallId
      const payload = {
        recallId,
        body: {}
      }
      await this.recallDeleteAction({ componentSelf, payload })
      utility.redirect(this, 'recalls')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .recall-delete-container {
    h3 {
      margin-bottom: 20px;
    }
    .btn-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      button {
        margin-left: 20px;
        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
