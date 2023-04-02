<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ $t('title') }}
        </q-toolbar-title>
        <q-avatar>
          <img :src="currentUserStore.getGravatar">
          <q-menu>
            <q-item clickable v-close-popup>
              <q-item-section>{{ currentUserStore.username }}</q-item-section>
            </q-item>
            <q-separator />
            <!-- language -->
            <q-item clickable v-close-popup>
              <q-item-section @click="setLanguage('zh-TW')">{{ $t('lang.zhTW') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="setLanguage('en-US')">{{ $t('lang.enUS') }}</q-item-section>
            </q-item>
            <q-separator />
            <!-- logout -->
            <q-item clickable v-close-popup>
              <q-item-section @click="onLogoutClicked">{{ $t('logout') }}</q-item-section>
            </q-item>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>
    <q-ajax-bar/>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      :mini="!leftDrawerOpen || miniState"
      @click.capture="drawerClick"
    >
      <q-list>
        <q-item-label
          header
        >
        {{ $t('menu') }}
        </q-item-label>
        <NavItem
          v-for="link in essentialLinks"
          :key="link.title"
          :navNode="link"
        />
      </q-list>
      <!--
        in this case, we use a button (can be anything)
        so that user can switch back
        to mini-mode
      -->
      <div class="q-mini-drawer-hide absolute" style="top: 55px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color="accent"
          icon="chevron_left"
          @click="miniState = true"
        ></q-btn>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useI18n } from 'vue-i18n';
import NavItem from 'src/components/navItem/NavItem.vue';
import AppUserService from 'src/modules/appUsers/AppUserService';
import CurrentUserStore from 'src/modules/appUsers/stores/CurrentUserStore';
import { WritableComputedRef } from 'vue';
import { NavNode } from 'src/components/navItem/NavNode';

@Component({
  components: {
    NavItem,
  },
})
export default class MainLayout extends Vue {
  appUserService = AppUserService;

  currentUserStore = CurrentUserStore();

  i18n = useI18n();

  get essentialLinks(): NavNode[] {
    return [
      {
        title: this.i18n.t('parts.title'),
        caption: this.i18n.t('parts.caption'),
        icon: 'settings',
        to: '/parts',
      },
      {
        title: this.i18n.t('customs.title'),
        caption: this.i18n.t('customs.caption'),
        icon: 'tune',
        contentInsetLevel: 0.25,
        children: [
          {
            title: this.i18n.t('customs.attributes.title'),
            caption: this.i18n.t('customs.attributes.caption'),
            icon: 'handyman',
            to: '/customizations/attributes',
          },
        ],
      },
    ] as NavNode[];
  }

  leftDrawerOpen = true;

  miniState = false;

  async created() {
    const appUser = await this.appUserService.getCurrentUser();
    if (appUser) {
      this.currentUserStore.$state = appUser;
    }
  }

  toggleLeftDrawer() {
    this.leftDrawerOpen = !this.leftDrawerOpen;
  }

  setLanguage(lang: string) {
    this.i18n.locale = lang as unknown as WritableComputedRef<string>;
  }

  onLogoutClicked(): void {
    localStorage.removeItem('token');
    this.$router.push('/login');
  }

  drawerClick(): void {
    if (this.miniState) {
      this.miniState = false;
    }
  }
}

</script>
