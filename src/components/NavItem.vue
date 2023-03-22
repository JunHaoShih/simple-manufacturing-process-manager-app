<template>
  <q-item
    clickable
    tag="a"
    :to="to"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';

@Component({})
export default class NavItem extends Vue {
  @Prop
  readonly title!: string;

  @Prop
  readonly caption!: string;

  @Prop
  readonly icon!: string;

  @Prop
  readonly to!: string;
}
</script>
