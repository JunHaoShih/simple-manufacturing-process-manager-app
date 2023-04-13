<template>
  <div class="q-pa-sm">
    <!-- splitter area -->
    <q-splitter
      v-model="splitterModel"
      class="outer-max"
    >
      <template v-slot:before>
        <div class="q-pa-md q-gutter-sm">
          <q-tree
            :nodes="usesStore.treeNodes"
            node-key="label"
            @lazy-load="onLazyLoad"
          />
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          Infos
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { PartUsageUsesStore } from './stores/PartUsageUsesStore';
import { PartUsageService } from './services/PartUsageService';
import { PartVersionStore } from '../parts/stores/PartVersionStore';

@Component({})
export default class PartUsagesPage extends Vue {
  @Prop id = 0;

  i18n = useI18n();

  $q = useQuasar();

  splitterModel = 50;

  usesStore = PartUsageUsesStore();

  partVersionStore = PartVersionStore();

  partUsageService = PartUsageService;

  async created(): Promise<void> {
    const uses = await this.partUsageService.getByParentVersionId(this.id);
    if (uses) {
      this.usesStore.initialize(uses, this.partVersionStore.content);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onLazyLoad(details: {
    node: any,
    key: string,
    done: (children?: readonly any[] | undefined) => void,
    fail: () => void,
  }) {
    // TODO
    console.log(details.key);
    setTimeout(() => {
      // simulate loading and setting an empty node
      if (details.key.indexOf('Lazy load empty') > -1) {
        details.done([]);
        return;
      }

      const { label } = details.node;
      details.done([
        { label: `${label}.1` },
        { label: `${label}.2`, lazy: true },
        {
          label: `${label}.3`,
          children: [
            { label: `${label}.3.1`, lazy: true },
            { label: `${label}.3.2`, lazy: true },
          ],
        },
      ]);
    }, 1000);
  }
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 200px)
</style>
