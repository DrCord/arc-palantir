import { mapActions, mapGetters } from 'vuex'
import {
  OPERATOR_PREFERENCE,
  OPERATOR_USERNAME
} from '@/store/getter-types'
import { USER_PREFERENCE_SAVE } from '@/store/action-types'
import {
  OPERATOR_PREFERENCE_SET,
  USER_PREFERENCE_SET
} from '@/store/mutation-types'

export default {
  props: {
    itemsPerPagePrefName: {
      default: 'items-per-page',
      type: String
    }
  },
  data () {
    return {
      itemsPerPage: this.defaultTableRows,
      operatorPreferenceSet: OPERATOR_PREFERENCE_SET,
      userPreferenceSet: USER_PREFERENCE_SET
    }
  },
  computed: {
    ...mapGetters({
      operatorPreference: OPERATOR_PREFERENCE,
      operatorUsername: OPERATOR_USERNAME
    }),
    defaultTableRows () {
      const prefObj = this.operatorPreference(this.itemsPerPagePrefName)
      if (prefObj && 'value' in prefObj) {
        return parseInt(prefObj.value)
      }
      return 20
    }
  },
  mounted () {
    this.itemsPerPage = this.defaultTableRows
  },
  methods: {
    ...mapActions({
      userPreferenceSaveAction: USER_PREFERENCE_SAVE
    }),
    async SetRowDefault (itemsPerPage) {
      const username = this.operatorUsername
      if (itemsPerPage && this.defaultTableRows !== itemsPerPage && username) {
        const componentSelf = this
        const payload = {
          username: username,
          body: {
            preference_identifier: this.itemsPerPagePrefName,
            preference_value: itemsPerPage.toString()
          }
        }
        await this.userPreferenceSaveAction({ componentSelf, payload })
      }
    },
    capturePagination (event) {
      this.SetRowDefault(event)
      this.$emit('update:items-per-page', event)
    }
  }
}
