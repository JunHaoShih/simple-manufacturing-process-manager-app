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
          Simple Manufacturing Process Manager
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>
        <NavItem
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import NavItem from 'src/components/NavItem.vue';

@Component({
  components: {
    NavItem,
  },
})
export default class MainLayout extends Vue {
  essentialLinks = [
    {
      title: 'Product Zipper',
      caption: 'One click compress your product',
      icon: 'folder_zip',
      to: '/products',
    },
  ];

  leftDrawerOpen = false;

  toggleLeftDrawer() {
    this.leftDrawerOpen = !this.leftDrawerOpen;
  }
}

</script>
