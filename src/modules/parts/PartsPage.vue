<template>
  <div class="q-pa-sm">
    <!-- product files table -->
    <q-table
      title="Parts"
      :rows="partsStore.parts"
      :columns="columns"
      v-model:selected="selected"
      selection="multiple"
      row-key="id"
      class="center-max outer-max main-panel"
      dense
      :pagination="pagination"
      style="position: sticky; top: 0"
    >
      <!-- button at table header -->
      <template v-slot:top>
        <q-btn color="primary" :label="$t('actions.add')" @click="prompt=true"></q-btn>
        <q-btn color="primary" :label="$t('actions.delete')"></q-btn>
        <q-space />
        <q-input v-model="pattern" type="text" label="Search"
          v-on:keyup.enter="onSearchEnter"
        />
      </template>
      <!-- action buttons -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="edit"
            @click="onEditClicked(props.row as Part)"
          />
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="delete"
          />
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="info"
            @click="onInfoClicked(props.row as Part)"
          />
        </q-td>
      </template>
      <!-- is checkout -->
      <template v-slot:body-cell-isCheckout="props">
        <q-td :props="props">
          <q-icon v-if="props.row.checkout" name="warning" color="orange" size="8px">
            <q-tooltip>
              {{ $t('iterable.checkout') }}
            </q-tooltip>
          </q-icon>
        </q-td>
      </template>
      <!-- version -->
      <template v-slot:body-cell-version="props">
        <q-td :props="props">
          {{ partsStore.getVersion(props.row.version) }}
        </q-td>
      </template>
      <!-- view -->
      <template v-slot:body-cell-view="props">
        <q-td v-if="props.row.viewType === Design" :props="props">
          {{ $t('parts.views.design') }}
        </q-td>
        <q-td v-else :props="props">
          {{ $t('parts.views.manufacturing') }}
        </q-td>
      </template>
      <!-- create date -->
      <template v-slot:body-cell-createDate="props">
        <q-td :props="props">
          {{ new Date(props.row.version.createDate).getDateStr() }}
          <q-tooltip>
            {{ new Date(props.row.version.createDate).toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- modified date -->
      <template v-slot:body-cell-updateDate="props">
        <q-td :props="props">
          {{ new Date(props.row.version.updateDate).getDateStr() }}
          <q-tooltip>
            {{ new Date(props.row.version.updateDate).toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- context menu -->
      <template v-slot:body-cell="props">
        <!-- display table value -->
        <q-td :props="props">
          {{props.value}}
        </q-td>
        <q-menu touch-position context-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>{{ $t('actions.edit') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>{{ $t('actions.delete') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>{{ $t('parts.routing') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
    </q-table>
    <PartDialog v-model="prompt" @onPartCreated="onPartCreated"></PartDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { QTableProps, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import PartService from './services/PartService';
import { Part, ViewType } from './models/Part';
import PartDialog from './components/PartDialog.vue';
import PartsStore from './stores/PartsStore';
import 'src/extensions/date.extensions';
import { AttributeLinksStore } from '../customs/stores/AttributeLinksStore';
import { ObjectTypeId } from '../objectTypes/models/ObjectType';

@Component({
  components: {
    PartDialog,
  },
})
export default class PartsPage extends Vue {
  i18n = useI18n();

  pattern = '';

  selected = [] as Part[];

  attrLinksStore = AttributeLinksStore();

  partsStore = PartsStore();

  $q = useQuasar();

  prompt = false;

  readonly Design = ViewType.Design;

  get columns(): QTableProps['columns'] {
    return [
      {
        name: 'actions', label: this.i18n.t('actions.action'), field: '', align: 'center', style: 'width: 60px',
      },
      {
        name: 'isCheckout', label: '', field: '', align: 'left', sortable: false,
      },
      {
        name: 'number', required: true, label: this.i18n.t('parts.number'), align: 'left', field: 'number', sortable: true,
      },
      {
        name: 'name', label: this.i18n.t('parts.name'), field: 'name', align: 'left', sortable: true,
      },
      {
        name: 'view', label: this.i18n.t('parts.view'), field: '', align: 'left', sortable: true,
      },
      {
        name: 'version', label: this.i18n.t('iterable.version'), field: '', align: 'left', sortable: true,
      },
      {
        name: 'createUser', label: this.i18n.t('base.creator'), field: 'createUser', align: 'left', sortable: true,
      },
      {
        name: 'createDate', label: this.i18n.t('base.createDate'), field: '', align: 'left', sortable: true,
      },
      {
        name: 'updateUser', label: this.i18n.t('base.modifier'), field: 'updateUser', align: 'left', sortable: true,
      },
      {
        name: 'updateDate', label: this.i18n.t('base.modifiedDate'), field: '', align: 'left', sortable: true,
      },
    ];
  }

  pagination: QTableProps['pagination'] = {
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 20,
  };

  async created() {
    this.pattern = this.$route.query.pattern as string;
    await Promise.all([
      this.attrLinksStore.initialize(ObjectTypeId.PartVersion),
      this.searchParts(),
    ]);
  }

  onInfoClicked(part: Part): void {
    this.$router.push(`parts/version/${part.version.id}/info`);
  }

  onEditClicked(part: Part): void {
    if (!part.checkout) {
      // TODO show dialog to checkout
    }
    this.$router.push(`parts/${part.id}/info`);
  }

  onSearchEnter(): void {
    this.$router.push({
      path: '/parts',
      query: { pattern: this.pattern },
    });
  }

  async searchParts(): Promise<void> {
    const parts = await PartService.getByPattern(this.pattern);
    if (parts) {
      this.partsStore.parts = parts;
    }
  }

  @Watch('$route.query.pattern')
  async onTest1(newValue: string, oldValue: string) {
    if (this.$route.path === '/parts') {
      this.pattern = newValue;
      await this.searchParts();
    }
  }

  onPartCreated(newPart: Part) {
    this.partsStore.unshiftPart(newPart);
  }
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 70px)
</style>
