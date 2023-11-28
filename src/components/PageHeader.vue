<template>
  <!-- the style for the background-image has to be inlined due to css and s3 interaction -->
  <header
    class="page-header"
    :style="headerBackgroundStyle"
  >
    <div class="page-header-container">
      <div class="page-header-item title">
        <span class="main-title">
          <span v-if="title">{{ title }}</span>
          <span v-else-if="titleLoading">{{ titleLoading }}</span>
          <span v-else>&nbsp;</span>
        </span>
        <span  v-if="subtitle" class="sub-title" >{{ subtitle }}</span>
      </div>
      <profile v-if="username"
        :username="username"
        @user-mfa-configuration-open="openMfaConfiguration"
      />
      <div v-if="quickLinks" class="page-header-item quicklinks">
        <quick-link v-for="link in quickLinks"
          :key=link.id
          :button-text="link.text"
          :emit="link.emit"
          :href="link.href"
          :icon="link.icon"
          @quick-link-event="handleQuickLink"
        />
      </div>
    </div>
    <div v-if="rightBottom" class="right-bottom">
      <h4>{{ rightBottom }}</h4>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import { OPERATOR_DISPLAY_NAME } from '@/store/getter-types'
import QuickLink from './QuickLink.vue'
import Profile from '@/components/Users/Profile.vue'

export default {
  name: 'PageHeader',
  components: {
    QuickLink,
    Profile
  },
  props: {
    bannerImgUrl: {
      default: 'https://cdn.arcimoto.com/images/fleet_banner_scaled.jpg',
      type: String
    },
    rightBottom: {
      default: null,
      type: String
    },
    subtitle: {
      default: null,
      type: String
    },
    title: {
      default: null,
      type: String
    },
    titleLoading: {
      default: null,
      type: String
    },
    quickLinks: {
      default: null,
      type: Array
    },
    username: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      windowWidth: window.innerWidth
    }
  },
  computed: {
    ...mapGetters({
      operatorDisplayName: OPERATOR_DISPLAY_NAME
    }),
    darkModeEnabled () {
      return this.$vuetify.theme.dark
    },
    headerBackgroundStyle () {
      const { bannerImgUrl, darkModeEnabled } = this
      const colorCodeLight = [1, 83, 104] // #015368
      const colorCodeDark = [1, 41, 51] // #012933
      let styleBgLinearGradient1 = ''
      if (this.windowWidth < 700) {
        styleBgLinearGradient1 = 'linear-gradient(90deg, rgba(COLOR,1) 0%, rgba(COLOR,1) 35%, rgba(COLOR,0.8) 45%, rgba(COLOR,0.8) 100%)'
      } else if (this.windowWidth < 1000) {
        styleBgLinearGradient1 = 'linear-gradient(90deg, rgba(COLOR,1) 0%, rgba(COLOR,1) 55%, rgba(COLOR,0.8) 65%, rgba(COLOR,0.8) 100%)'
      } else if (this.windowWidth < 1580) {
        styleBgLinearGradient1 = 'linear-gradient(90deg, rgba(COLOR,1) 0%, rgba(COLOR,1) 65%, rgba(COLOR,0.8) 75%, rgba(COLOR,0.8) 100%)'
      } else if (this.windowWidth < 2200) {
        styleBgLinearGradient1 = 'linear-gradient(90deg, rgba(COLOR,1) 0%, rgba(COLOR,1) 75%, rgba(COLOR,0.8) 85%, rgba(COLOR,0.8) 100%)'
      } else if (this.windowWidth < 2800) {
        styleBgLinearGradient1 = 'linear-gradient(90deg, rgba(COLOR,1) 0%, rgba(COLOR,1) 80%, rgba(COLOR,0.8) 90%, rgba(COLOR,0.8) 100%)'
      } else {
        styleBgLinearGradient1 = 'linear-gradient(90deg, rgba(COLOR,1) 0%, rgba(COLOR,1) 85%, rgba(COLOR,0.8) 95%, rgba(COLOR,0.8) 100%)'
      }
      const styleBgUrl = `url(${bannerImgUrl})`
      const styleTemplate = `background-image: ${styleBgLinearGradient1}, ${styleBgUrl}`
      return styleTemplate.replace(/COLOR/g, (darkModeEnabled ? colorCodeDark : colorCodeLight).join(','))
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize () {
      this.windowWidth = window.innerWidth
    },
    handleQuickLink (e) {
      this.$emit('quick-link-event', e)
    },
    openMfaConfiguration () {
      this.$emit('user-mfa-configuration-open', { name: 'mfa-configuration', type: 'open' })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  .page-header {
    position: relative;
    display: flex;
    padding: 60px 20px 15px;
    background-color: transparent;
    background-position: right top;
    background-repeat: no-repeat;
    background-size: auto 100%;
    color: white;
    .page-header-container {
      margin-left: 20px;
      margin-top: 25px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: left;
      row-gap: 1.8rem;
      .page-header-item {
        display: flex;
      }
      .title {
        display: flex;
        flex-direction: row;
        column-gap: 1.25rem;
        align-items: flex-end;
        vertical-align: bottom ;
        .main-title span {
          font-size: 2.3rem;
          font-weight: normal;
          align-self: flex-end;

        }
        .sub-title {
          font-size: 1rem;
          font-weight: normal;
          align-self: flex-end;
        }
      }
      .quicklinks {
        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        column-gap: 10px;
        margin-left: 10px;
      }
    }

    .right-bottom {
      position: absolute;
      bottom: 0;
      right: 30px;
      h4 {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
        font-weight: normal;
      }
    }

  }
}
</style>
