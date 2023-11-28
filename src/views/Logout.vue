<template>
  <div class="logout">
    <page-header title="Logging Out..." />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { OPERATOR_USERNAME } from '@/store/getter-types'
import { OPERATOR_USERNAME_SET } from '@/store/mutation-types'

import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'Logout',
  components: {
    PageHeader
  },
  computed: {
    ...mapGetters({
      operatorUsername: OPERATOR_USERNAME
    }),
    username: {
      get () { return this.operatorUsername },
      set (val) { this.$store.commit(OPERATOR_USERNAME_SET, val) }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.logout()
    },
    logout () {
      // this causes the app to reset the other user data
      this.username = ''
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
.form-field {
  margin: 10px 0;
}
.form-field label {
  margin-right: 10px;
}
#app textarea {
  font-size: 12px;
  height: 290px;
  width: 650px;
}
@media (max-width: 768px) {
  #app textarea {
    height: 380px;
    width: 450px;
  }
}
#app .msg {
  margin: 40px auto;
  text-align: center;
}
#password_prompt {
  position: fixed;
  border: 1px solid #333;
  padding: 16px;
  background: white;
  z-index: 99999;
}
.login-form {
  margin: 0 auto;
  max-width: 300px;
}
.container {
  margin: 20px auto;
  max-width: 400px;
  text-align: center;
}
</style>
