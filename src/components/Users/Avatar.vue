<template>
  <div class="avatar-component-container">
    <div
      v-if="avatar.avatarImg"
      class="avatar-container"
    >
      <img
        :src="avatarImgSrc"
        alt="User Avatar"
        class="avatar"
      />
    </div>
    <i
      v-else
      class="fas fa-user-circle avatar-blank"
      alt="User Avatar - Blank"
    />
    <v-tooltip bottom>
      <template #activator="{ on }">
        <i
          v-if="operatorIsUser || operatorCanEditProfile"
          class="fas fa-edit"
          alt="User Avatar - Add/Edit"
          @click="editAvatar"
          v-on="on"
        ></i>
      </template>
      <span>Edit Avatar</span>
    </v-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ACCESS_USER_EDIT_PROFILE,
  OPERATOR_IS_USER,
  USER_AVATAR
} from '@/store/getter-types'

export default {
  name: 'UserAvatar',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  computed: {
    ...mapGetters({
      operatorCanEditProfile: ACCESS_USER_EDIT_PROFILE,
      operatorIsUserGet: OPERATOR_IS_USER,
      userAvatarGet: USER_AVATAR
    }),
    avatar () {
      return this.username ? this.userAvatarGet(this.username) : {}
    },
    avatarImgSrc () {
      if (this.avatar.avatarImg && this.avatar.avatarFileType) {
        return `data:image/${this.avatar.avatarFileType};base64,${this.avatar.avatarImg}`
      }
      return ''
    },
    darkModeEnabled () {
      return this.$vuetify.theme.dark
    },
    operatorIsUser () {
      return this.username ? this.operatorIsUserGet(this.username) : null
    }
  },
  methods: {
    editAvatar () {
      this.$emit('avatar-edit-init')
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .avatar-component-container {
    position: relative;
    &:hover, &:active {
      i.fa-edit {
        visibility: visible;
        opacity: 1;
        animation: fadeIn 1s linear;
      }
    }
    i.fa-edit {
      position: absolute;
      top: 0;
      right: 0;
      visibility: hidden;
      opacity: 0;
    }
    .avatar-container {
      height: 100px;
      width: 100px;
      text-align: center;
      position: relative;
      overflow: hidden;
      border-radius: 50%;
      .avatar {
        display: inline;
        margin: 0 auto;
        height: 100%;
        width: auto;
      }
    }
    i.avatar-blank {
      font-size: 100px;
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    visibility: hidden;
  }
  1% {
    opacity: 0.01;
    visibility: visible;
  }
  100% {
    opacity: 1;
    visibility: visible;
  }
}
</style>
