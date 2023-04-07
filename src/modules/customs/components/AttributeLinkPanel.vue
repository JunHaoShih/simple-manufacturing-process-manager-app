<template>
  <div>
    <q-table
      dense
      :title="$t('customs.attributeLinks.title')"
      :rows="attrLinksStore.content.attributes"
      :columns="columns"
      :pagination="pagination"
      row-key="id"
      class="center-max outer-max q-pa-sm"
      style="position: sticky; top: 0"
    >
      <!-- button at table header -->
      <template v-slot:top>
        <q-btn color="primary" :label="$t('actions.add')"></q-btn>
        <q-btn color="primary" :label="$t('actions.delete')"></q-btn>
        <q-space />
      </template>
      <!-- action buttons -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense round flat
            color="grey" icon="delete"></q-btn>
          <q-btn dense round flat
            color="grey" icon="info" @click="onInfoClicked(props.row as CustomAttribute)"></q-btn>
        </q-td>
      </template>
      <!-- display type -->
      <template v-slot:body-cell-displayType="props">
        <q-td :props="props">
          {{
            displayTypesStore.getOption(props.row.displayType).label
          }}
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="viewPrompt" persistent
      transition-show="rotate" transition-hide="rotate">
      <q-card style="min-width: 700px">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ $t('customs.attributes.title') }}</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll dialog-inner-max">
          <CustomAttributePanel v-model="viewedCustomAttribute" :readonly="true" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-facing-decorator';
import { QTableProps, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import { AttributeLinkService } from '../services/AttributeLinkService';
import { AttributeLinksStore } from '../stores/AttributeLinksStore';
import CustomAttributePanel from './CustomAttributePanel.vue';
import { CustomAttribute } from '../models/CustomAttribute';
import { DisplayTypesStore } from '../stores/DisplayTypesStore';

@Component({
  components: {
    CustomAttributePanel,
  },
})
export default class AttributeLinkPanel extends Vue {
  i18n = useI18n();

  $q = useQuasar();

  attrLinksStore = AttributeLinksStore();

  displayTypesStore = DisplayTypesStore();

  attrLinkService = AttributeLinkService;

  viewPrompt = false;

  viewedCustomAttribute = {} as CustomAttribute;

  @Prop
  // eslint-disable-next-line indent
  objectTypeId!: number;

  get columns(): QTableProps['columns'] {
    return [
      {
        name: 'actions', label: this.i18n.t('actions.action'), field: '', align: 'center', style: 'width: 60px',
      },
      {
        name: 'number', required: true, label: this.i18n.t('customs.generic.number'), align: 'left', field: 'number', sortable: true,
      },
      {
        name: 'name', label: this.i18n.t('customs.generic.name'), field: 'name', align: 'left', sortable: true,
      },
      {
        name: 'displayType', label: this.i18n.t('customs.attributes.displayType'), field: '', align: 'left', sortable: true,
      },
    ];
  }

  pagination: QTableProps['pagination'] = {
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 20,
  };

  @Watch('objectTypeId')
  async onObjectTypeIdChanged(newValue: number, oldValue: number) {
    await this.reloadPanel();
  }

  async reloadPanel(): Promise<void> {
    this.$q.loading.show({
      delay: 400,
    });
    const attrLinks = await this.attrLinkService.getByObjectTypeId(this.objectTypeId);
    if (attrLinks) {
      this.attrLinksStore.content = attrLinks;
    }
    this.$q.loading.hide();
  }

  onInfoClicked(attribute: CustomAttribute): void {
    this.viewedCustomAttribute = attribute;
    this.viewPrompt = true;
  }
}
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
