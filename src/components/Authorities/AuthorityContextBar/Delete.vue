<template>
  <div class="authority-delete-container">
    <h3>Delete Authority</h3>
    <p>Are you sure you want to delete this authority?</p>

    <div class="btn-container">
      <v-btn
        class="save"
        color="error"
        type="button"
        @click="deleteAuthority"
      >Delete<v-icon>mdi-minus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { AUTHORITY_DELETE } from '@/store/action-types'

import utility from '@/lib/utility'

export default {
  name: 'AuthorityDelete',
  props: {
    authorityId: {
      default: null,
      type: [Number, String]
    }
  },
  methods: {
    ...mapActions({
      authorityDeleteAction: AUTHORITY_DELETE
    }),
    deleteAuthority () {
      const componentSelf = this
      const { authorityId } = this
      const payload = {
        authorityId
      }
      this.authorityDeleteAction({ componentSelf, payload })
        .then(() => {
          utility.redirect(this, 'authorities')
        })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .authority-delete-container {
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
