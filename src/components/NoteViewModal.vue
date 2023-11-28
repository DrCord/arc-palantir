<template>
  <v-dialog
    class="note-view-modal"
    :value="open"
    width="600px"
    @click:outside="close"
  >
    <v-card class="note-view-modal-card">
      <v-card-title>
        <h3>Vehicle Note</h3>
        <v-spacer />
        <v-icon @click="close">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <h4 v-if="operatorCanAccessUsers && author !== 'Arcimoto'">Created by: <router-link
          :to="userLinkObject(author)"
        >{{ userGet(author) ? userGet(author).displayName : author }}</router-link></h4>
        <h4 v-else>Created by: {{ author }}</h4>
        <h5>Created on: {{ created }}</h5>
        <div class="notesContainer">
          <p>{{ content.trim() }}</p>
        </div>
        <div class="tagsContainer">
          <p v-if="tags.length > 0">Tags:</p>
          <span class="tag">{{ tags.join(", ") }} </span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_USERS,
  USER
} from '@/store/getter-types'
export default {
  name: 'NoteViewModal',
  props: {
    author: { type: String, default: '' },
    content: { type: String, default: '' },
    created: { type: String, default: '' },
    tags: { type: Array, default: () => [] },
    open: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters({
      operatorCanAccessUsers: ACCESS_USERS,
      userGet: USER
    })
  },
  methods: {
    close () {
      this.$emit('close')
    },
    userLinkObject (username) {
      return {
        name: 'user',
        params: {
          username
        }
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  .note-view-modal-card {
    h4 {
      font-size: 1.1rem;
      text-align: left;
    }
    h5 {
      font-size: 0.9rem;
      text-align: left;
    }
    .notesContainer {
      white-space: pre-wrap;
    }
    .tag {
      color: #42b983;
    }
    .tagsContainer {
      p {
        margin-bottom: 1px;
      }
    }
  }
}
</style>
