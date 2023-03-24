<template>
  <div>
    <!-- product files table -->
    <q-table
      title="Parts"
      :rows="partsStore.$state"
      :columns="columns"
      v-model:selected="selected"
      selection="multiple"
      row-key="id"
      class="q-mr-sm center-max"
      :pagination="pagination"
      style="position: sticky; top: 0"
    >
      <!-- button at table header -->
      <template v-slot:top>
        <q-btn color="primary" :label="$t('actions.add')"></q-btn>
        <q-btn color="primary" :label="$t('actions.delete')"></q-btn>
      </template>
      <!-- action buttons -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense round flat
            color="grey" icon="edit"></q-btn>
          <q-btn dense round flat
            color="grey" icon="delete"></q-btn>
        </q-td>
      </template>
      <!-- create date -->
      <template v-slot:body-cell-createDate="props">
        <q-td :props="props">
          {{ partsStore.getCreateDateStr(props.row.createDate as Date) }}
          <q-tooltip>
            {{ partsStore.getCreateDateFullStr(props.row.createDate as Date) }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- modified date -->
      <template v-slot:body-cell-updateDate="props">
        <q-td :props="props">
          {{ partsStore.getCreateDateStr(props.row.updateDate as Date) }}
          <q-tooltip>
            {{ partsStore.getCreateDateFullStr(props.row.updateDate as Date) }}
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { QTableProps } from 'quasar';
import { useI18n } from 'vue-i18n';
import PartService from './PartService';
import { Part } from './models/Part';
import PartsStore from './stores/PartsStore';

@Component({})
export default class PartsPage extends Vue {
  i18n = useI18n();

  pattern = '';

  selected = [] as Part[];

  partsStore = PartsStore();

  get columns(): QTableProps['columns'] {
    return [
      {
        name: 'actions', label: this.i18n.t('actions.action'), field: '', align: 'center', style: 'width: 60px',
      },
      {
        name: 'number', required: true, label: this.i18n.t('parts.number'), align: 'left', field: 'number', sortable: true,
      },
      {
        name: 'name', label: this.i18n.t('parts.name'), field: 'name', align: 'left', sortable: true,
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
    const parts = await PartService.getByPattern(this.pattern);
    if (parts) {
      this.partsStore.$state = parts;
    }
  }
}
</script>
