<template>
  <div class="main-panel">
    <q-banner
      class="bg-primary text-white q-ma-sm"
      style="border-radius: 10px"
    >
      <div class="text-h6 row">
        <div>{{ partVersionStore.content.master.number }}</div>
        <div>
          [{{ partVersionStore.content.iteration }}.{{ partVersionStore.content.revision }}]
        </div>
        <div v-if="partVersionStore.content.master.viewType === Design">
          [{{ $t('parts.views.design') }}]
        </div>
        <div v-else>
          [{{ $t('parts.views.manufacturing') }}]
        </div>
      </div>
    </q-banner>
    <q-tabs
      align="left"
      indicator-color="orange"
      class="tabs-font"
    >
      <q-route-tab
        :label="$t('parts.info')"
        :to="'/parts/' + id + '/info'"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { PartVersionStore } from './stores/PartVersionStore';
import { PartVersionService } from './services/PartVersionService';
import { AttributeLinksStore } from '../customs/stores/AttributeLinksStore';
import { ObjectTypeId } from '../objectTypes/models/ObjectType';
import { ViewType } from './models/Part';

@Component({})
export default class PartCenterPage extends Vue {
  @Prop
  // eslint-disable-next-line indent
  id = '';

  readonly Design = ViewType.Design;

  attrLinksStore = AttributeLinksStore();

  partVersionStore = PartVersionStore();

  partVersionService = PartVersionService;

  async created() {
    this.partVersionStore.content.customValues = Object.fromEntries(this.attrLinksStore.content.attributes.map((attr) => [attr.number, '']));
    this.attrLinksStore.initialize(ObjectTypeId.PartVersion);
    const targetVersion = await this.partVersionService.getById(Number(this.id));
    if (targetVersion) {
      this.partVersionStore.content = targetVersion;
    }
  }
}
</script>

<style lang="sass" scoped>
.tabs-font
  font-family: 'Noto Sans TC'
</style>
