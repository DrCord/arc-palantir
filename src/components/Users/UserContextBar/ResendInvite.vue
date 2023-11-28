<template>
  <div class="resend-invite-container">
    <v-btn
      @click="resendInvite"
    >Resend Invite
    </v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { USER_RESEND_INVITE } from '@/store/action-types'

export default {
  name: 'ResendInvite',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  methods: {
    ...mapActions({
      userResendInviteAction: USER_RESEND_INVITE
    }),
    resendInvite () {
      const componentSelf = this
      const username = this.username
      const payload = {
        username,
        body: {}
      }
      this.userResendInviteAction({ componentSelf, payload })
        .then(() => {
          this.$emit('user-resend-invite-complete')
        })
    }
  }
}
</script>
