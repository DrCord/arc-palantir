<template>
  <div class="quick-actions-container">
    <h3>Recalls Actions</h3>
    <v-list>
      <v-list-item>
        <v-btn @click="createRecall">
          Create
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'RecallsActions',
  methods: {
    changePanel (contentType) {
      this.$emit('change-panel', { contentType })
    },
    createRecall () {
      this.changePanel('recall-create')
    }
  }
}
</script>
