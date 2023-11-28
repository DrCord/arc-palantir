<template>
  <div class="notes-container">
    <div id="notes">
      <h3>Notes</h3>
      <v-data-table
        :headers="tableHeaders"
        :items="notes"
        dense
        :sort-desc="[true]"
        :sort-by="['created']"
        :item-class="tableClasses"
        @click:row="(item) => handleNoteSelect(item)"
      >
        <template #[`item.created`]="{ item }">
          {{ item.humanReadableDate }}
        </template>
        <template #[`item.tags`]="{ item }">
          <span v-for="tag in item.tags" :key="tag" >
            <span v-if="tag === 'delivery'">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <font-awesome-icon
                    icon="truck"
                    v-on="on"
                  />
                </template>
                {{ tag }}
              </v-tooltip>
            </span>
            <span v-else-if="tag === 'firmware'">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <font-awesome-icon
                    icon="code"
                    v-on="on"
                  />
                </template>
                {{ tag }}
              </v-tooltip>
            </span>
            <span v-else-if="tag === 'fleets'">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <font-awesome-icon
                    icon="cars"
                    v-on="on"
                  />
                </template>
                {{ tag }}
              </v-tooltip>
            </span>
            <span v-else-if="tag === 'manufacturing'">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <font-awesome-icon
                    icon="industry"
                    v-on="on"
                  />
                </template>
                {{ tag }}
              </v-tooltip>
            </span>
            <span v-else-if="tag === 'parts'">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <font-awesome-icon
                    icon="cog"
                    v-on="on"
                  />
                </template>
                {{ tag }}
              </v-tooltip>
            </span>
            <span v-else-if="tag === 'quality'">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <font-awesome-icon
                    icon="search"
                    v-on="on"
                  />
                </template>
                {{ tag }}
              </v-tooltip>
            </span>
            <span v-else-if="tag === 'service'">
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <font-awesome-icon
                    icon="wrench"
                    v-on="on"
                  />
                </template>
                {{ tag }}
              </v-tooltip>
            </span>
            <span v-else>{{ tag }}</span>
          </span>
        </template>
      </v-data-table>
      <NoteViewModal
        :open="noteViewModal.visible"
        :author="noteViewModal.selected.author"
        :content="noteViewModal.selected.content"
        :created="noteViewModal.selected.created"
        :tags="noteViewModal.selected.tags"
        @close="toggleNoteView(false)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  VEHICLE_LOADED,
  VEHICLE_NOTES
} from '@/store/getter-types'

import dateUtility from '@/lib/dateUtility'
import NoteViewModal from '@/components/NoteViewModal.vue'

export default {
  name: 'VehicleNotes',
  components: {
    NoteViewModal
  },
  props: {
    vin: {
      default: null,
      type: String
    }
  },
  data: () => ({
    noteViewModal: {
      visible: false,
      selected: {
        id: '',
        author: '',
        created: '',
        content: '',
        tags: []
      }
    },
    tableHeaders: [
      {
        text: 'Date',
        value: 'created',
        sortable: true
      },
      {
        text: 'Author',
        value: 'author',
        sortable: true
      },
      {
        text: 'Preview',
        value: 'preview',
        sortable: true
      },
      {
        text: 'Tags',
        value: 'tags'
      }
    ]
  }),
  computed: {
    ...mapGetters({
      vehicleLoadedGet: VEHICLE_LOADED,
      vehicleNotesGet: VEHICLE_NOTES
    }),
    dataAvailable () {
      return this.vin && this.vehicleLoaded
    },
    notes () {
      const notes = this.dataAvailable ? this.vehicleNotesGet(this.vin) : []
      notes.forEach((value) => {
        value.humanReadableDate =
          value !== null ? dateUtility.formatOutput(value.created) : null
        value.preview = this.truncateNote(value.content, 50)
      })
      return notes
    },
    vehicleLoaded () {
      return this.vin ? this.vehicleLoadedGet(this.vin) : null
    }
  },
  methods: {
    tableClasses () {
      return 'clickable'
    },
    truncateNote (note, len) {
      note = note.replace(/\n|\r/g, ' ')
      if (note.length <= len) {
        return note
      }
      return note.slice(0, len) + '...'
    },
    handleNoteSelect (note) {
      this.noteViewModal.selected = {
        id: note.note_id,
        author: note.author,
        created: note.created,
        content: note.content,
        tags: note.tags
      }
      this.toggleNoteView(true)
    },
    toggleNoteView (state) {
      this.noteViewModal.visible = state
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .vehicle {
    .notes-container {
      h3 {
        text-align: left;
      }
      #notes ::v-deep .clickable {
        cursor: pointer;
      }
    }
  }
}
</style>
