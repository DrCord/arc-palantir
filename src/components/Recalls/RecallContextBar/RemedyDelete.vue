<template>
  <div class="remedy-delete-container">
    <h3>Delete Remedy</h3>
    <div>
      <h4>Are you sure you want to delete this remedy?</h4>
      <div class="btn-container">
        <v-btn
          class="cancel"
          color="error"
          dark
          @click="remedyDeleteCancel"
        >Cancel<v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-btn
          class="submit"
          color="success"
          type="button"
          :disabled="!recall.remedyId"
          @click="remedyDeleteSubmit"
        >Delete<v-icon>mdi-delete-circle</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { RECALL_REMEDY_DELETE } from '@/store/action-types'
import { RECALL } from '@/store/getter-types'

export default {
  name: 'RemedyDelete',
  props: {
    recallId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      recallGet: RECALL
    }),
    recall () {
      return this.recallId ? this.recallGet(this.recallId) : null
    }
  },
  methods: {
    ...mapActions({
      remedyDeleteAction: RECALL_REMEDY_DELETE
    }),
    remedyDeleteCancel () {
      this.$emit('remedy-delete-cancel')
    },
    async remedyDeleteSubmit () {
      const componentSelf = this
      const recallId = this.recallId
      const remedyId = this.recall.remedyId
      const payload = {
        recallId,
        remedyId,
        body: {}
      }
      await this.remedyDeleteAction({ componentSelf, payload })
      this.$emit('remedy-delete-complete')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .remedy-delete-container {
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
