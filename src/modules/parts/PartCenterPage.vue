<template>
  <div class="main-panel">
    <q-banner
      class="bg-primary text-white q-ma-sm"
      style="border-radius: 10px"
    >
      <div class="text-h6 row">
        <div>{{ partVersion.master.number }}</div>
        <div>
          [{{ partVersion.version }}]
        </div>
        <div v-if="partVersion.master.viewType === Design">
          [{{ $t('parts.views.design') }}]
        </div>
        <div v-else>
          [{{ $t('parts.views.manufacturing') }}]
        </div>
        <div class="q-ml-sm">
          <q-icon v-if="part.checkout" name="warning" color="orange" size="8px">
            <q-tooltip>
              {{ $t('iterable.checkout') }}
            </q-tooltip>
          </q-icon>
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
import { PartVersionService } from './services/PartVersionService';
import { AttributeLinksStore } from '../customs/stores/AttributeLinksStore';
import { ObjectTypeId } from '../objectTypes/models/ObjectType';
import { Part, ViewType } from './models/Part';
import PartService from './services/PartService';
import { PartMaster, PartVersion } from './models/PartVersion';

@Component({})
export default class PartCenterPage extends Vue {
  @Prop id = '';

  readonly Design = ViewType.Design;

  attrLinksStore = AttributeLinksStore();

  partVersionService = PartVersionService;

  partService = PartService;

  part = {} as Part;

  partVersion: PartVersion = {
    id: 0,
    version: 0,
    checkout: false,
    master: {} as PartMaster,
    customValues: {} as Record<string, string>,
    createUser: '',
    createDate: new Date(),
    updateUser: '',
    updateDate: new Date(),
    remarks: '',
  };

  async created() {
    this.attrLinksStore.initialize(ObjectTypeId.PartVersion);
    const part = await this.partService.getById(Number(this.id));
    if (part) {
      this.part = part;
      if (!part.checkoutId) {
        this.$router.push('/parts');
      }
      const targetVersion = await this.partVersionService.getById(Number(part.checkoutId));
      if (targetVersion) {
        this.partVersion = targetVersion;
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.tabs-font
  font-family: 'Noto Sans TC'
</style>
