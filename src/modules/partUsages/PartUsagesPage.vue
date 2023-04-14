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
          ref="qtree"
            :nodes="usesStore.treeNodes"
            node-key="id"
            @lazy-load="onLazyLoad"
            :default-expand-all="true"
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
import {
  Component, Prop, Ref, Vue,
} from 'vue-facing-decorator';
import { QTree, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { PartUsageUsesStore } from './stores/PartUsageUsesStore';
import { PartUsageService } from './services/PartUsageService';
import { PartVersionStore } from '../parts/stores/PartVersionStore';

@Component({})
export default class PartUsagesPage extends Vue {
  @Prop id = 0;

  @Ref qtree!: QTree;

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
  async onLazyLoad(details: {
    node: any,
    key: string,
    done: (children?: readonly any[] | undefined) => void,
    fail: () => void,
  }) {
    const uses = await this.partUsageService.getByParentVersionId(details.node.versionId);
    if (uses) {
      this.usesStore.addUses(uses);
      details.done([]);
    }
  }
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 200px)
</style>
