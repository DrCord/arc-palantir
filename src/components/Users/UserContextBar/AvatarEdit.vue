<template>
  <div class="avatar-edit-container">
    <h3 v-if="avatarExisting">Edit User Avatar</h3>
    <h3 v-else>Upload Avatar Image</h3>
    <vue-form :state="formstate" @submit.prevent="onSubmit">
      <div
        v-if="avatarExisting && avatarExistingFileType && !avatarUpload"
        class="avatar-current-container"
      >
        <h4>Existing Avatar</h4>
        <div class="avatar-current">
          <div class="avatar-container">
            <img
              :src="avatarExistingImgSrc"
              alt="User Avatar - Existing Image"
              class="avatar-circle"
            />
          </div>
        </div>
      </div>
      <div
        v-if="avatarUpload"
        class="avatar-new-container"
      >
        <h4>New Avatar</h4>
        <div class="avatar-new">
          <div class="avatar-container">
            <img
              :src="avatarNewImgSrc"
              alt="User Avatar - New Image"
              class="avatar-circle"
            />
          </div>
        </div>
      </div>
      <div class="avatar-upload">
        <h4>Upload Image</h4>
        <ul>
          <li>Uploaded image will replace any existing avatar image.</li>
          <li>Minimum dimensions: 100 x 100 pixels.</li>
          <li>Maximum image size: 500KB.</li>
          <li>Results will be more reliable if the uploaded image is square (circular auto-crop happens from the center out).</li>
        </ul>
        <validate
          tag="div"
          class="image form-field"
          :custom="{
            fileSizeValidator: function (value, attrValue, vnode) {
              // only allows files to be 500KB or smaller
              return !(value.size > 500000)
            }
          }"
        >
          <v-file-input
            id="image"
            v-model="avatarUpload"
            name="image"
            accept="image/*"
            label="Avatar Image File"
            prepend-icon="mdi-camera"
            outlined
            :error-messages="imageErrorMessages"
          >
            <v-icon
            v-if="imageErrorMessages"
            slot="append"
            class="field-error-icon"
            large
            color="red"
          >mdi-alert</v-icon>
        </v-file-input>
      </validate>

        <v-btn
          color="success"
          class="upload"
          :disabled="!avatarUpload || formstate.$invalid"
          @click="uploadImage"
        >Upload Image</v-btn>
      </div>
    </vue-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { USER_PROFILE_EDIT } from '@/store/action-types'
import { USER_AVATAR } from '@/store/getter-types'

import {
  USER_AVATAR_SET,
  USER_AVATAR_FILE_TYPE_SET
} from '@/store/mutation-types'
export default {
  name: 'AvatarEdit',
  props: {
    username: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      formstate: {},
      avatarUpload: null,
      avatarNew: null,
      avatarNewFileType: null
    }
  },
  computed: {
    ...mapGetters({
      userAvatarGet: USER_AVATAR
    }),
    userAvatar () {
      return this.username ? this.userAvatarGet(this.username) : null
    },
    avatarExisting () {
      return this.userAvatar ? this.userAvatar.avatarImg : null
    },
    avatarExistingFileType () {
      return this.userAvatar ? this.userAvatar.fileType : null
    },
    avatarExistingImgSrc () {
      if (this.avatarExisting && this.avatarExistingFileType) {
        return `data:image/${this.avatarExistingFileType};base64,${this.avatarExisting}`
      }
      return ''
    },
    avatarNewImgSrc () {
      if (this.avatarNew && this.avatarNewFileType) {
        return `data:image/${this.avatarNewFileType};base64,${this.avatarNew}`
      }
      return ''
    },
    darkModeEnabled () {
      return this.$vuetify.theme.dark
    },
    formstateUntouched () {
      if (this.formstate.$untouched) {
        return true
      }
      return false
    },
    imageErrorMessages () {
      if (this.imageErrorStateFileSize) {
        return 'Avatar image size can be 500KB max'
      }
      return null
    },
    imageErrorStateFileSize () {
      const { formstate, formstateUntouched } = this
      if (formstateUntouched) {
        return null
      }
      const { image } = formstate
      if (!image || image.$untouched) {
        return null
      }
      if (image.$invalid && image.$error.fileSizeValidator) {
        return true
      }
      return null
    }
  },
  watch: {
    avatarUpload (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        const reader = new FileReader()
        reader.onload = () => {
          const imgBase64 = reader.result
          // split into img and file type
          const imgBase64Parts = imgBase64.split(';base64,')
          this.avatarNew = imgBase64Parts[1]
          this.avatarNewFileType = imgBase64Parts[0].split('/')[1]
        }
        reader.readAsDataURL(newVal)
      }
    }
  },
  methods: {
    ...mapActions({
      userProfileEditAction: USER_PROFILE_EDIT
    }),
    async uploadImage () {
      if (this.avatarUpload) {
        const componentSelf = this
        const { username } = this
        const avatar = this.avatarNew
        const avatarFileType = this.avatarNewFileType
        const payload = {
          username,
          body: {
            avatar: `data:image/${this.avatarNewFileType};base64,${this.avatarNew}`
          }
        }
        await this.userProfileEditAction({ componentSelf, payload })
        const data = {
          username,
          avatar,
          avatarFileType
        }
        this.commitToStore(data)
        this.$emit('avatar-edit-complete', this.username)
      }
    },
    commitToStore (payload) {
      this.$store.commit(USER_AVATAR_SET, payload)
      this.$store.commit(USER_AVATAR_FILE_TYPE_SET, payload)
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .avatar-edit-container {
    form {
      .v-icon {
        &.field-error-icon {
          top: -5px;
        }
      }
    }
    h3 {
      margin-bottom: 20px;
    }
    .avatar-current,
    .avatar-new {
      height: 100px;
      width: 100px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      margin-bottom: 10px;
      margin-top: 20px;
      .avatar-container {
        height: 100px;
        width: 100px;
        text-align: center;
        position: relative;
        overflow: hidden;
        border-radius: 50%;
        margin-bottom: 10px;
        margin-left: auto;
        margin-right: auto;
        .avatar-circle {
          display: inline;
          margin: 0 auto;
          height: 100%;
          width: auto;
        }
      }
    }
    .avatar-upload {
      margin-top: 20px;
      .upload {
        float: right;
      }
    }
  }
  &.theme--dark {
      h4 {
        color: #fff;
      }
    }
}
</style>
