<template>
  <q-dialog
    ref="dialogRef"
    v-model="prompt"
    persistent
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card style="min-width: 700px">
      <q-card-section class="bg-primary text-white row items-center">
        <div class="text-h6">{{ $t('customs.attributeLinks.new') }}</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll dialog-inner-max">
        <q-table
          :rows="filteredAttributes"
          :columns="columns"
          :pagination="pagination"
          v-model:selected="selected"
          selection="multiple"
          row-key="id"
          dense
        >
          <!-- table header -->
          <template v-slot:top>
            <q-space />
            <q-input v-model="patternInput" type="text" label="Search"
              v-on:keyup.enter="pattern = patternInput;"
            />
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
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="$t('actions.cancel')" v-close-popup />
        <q-btn flat :label="$t('actions.confirm')" @click="onConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  Component, Emit, Model, Prop, Ref, Vue, Watch,
} from 'vue-facing-decorator';
import { QDialog, QTableProps, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import CustomAttributePanel from './CustomAttributePanel.vue';
import { CustomAttributesStore } from '../stores/CustomAttributesStore';
import { CustomAttribute } from '../models/CustomAttribute';
import { AttributeLinkService } from '../services/AttributeLinkService';
import { AttributeLinksStore } from '../stores/AttributeLinksStore';
import { DisplayTypesStore } from '../stores/DisplayTypesStore';

@Component({
  components: {
    CustomAttributePanel,
  },
})
export default class AttributeLinksAddDialog extends Vue {
  i18n = useI18n();

  $q = useQuasar();

  customAttrsStore = CustomAttributesStore();

  attrLinksStore = AttributeLinksStore();

  displayTypesStore = DisplayTypesStore();

  attrLinkService = AttributeLinkService;

  @Model prompt = false;

  @Emit('update:modelValue')
  updateModelValue() {
    return this.prompt;
  }

  @Prop({
    required: true,
  }) excludedAttributes = [] as CustomAttribute[];

  @Prop({
    required: true,
  }) objectTypeId = 0;

  @Ref
  // eslint-disable-next-line indent
  dialogRef!: QDialog;

  selected = [] as CustomAttribute[];

  pattern = '';

  patternInput = '';

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

  get filteredAttributes(): CustomAttribute[] {
    return this.customAttrsStore.filteredAttributes(this.pattern)
      .filter((attr) => !this.excludedAttributes.find(
        (excluded) => excluded.id === attr.id,
      ));
  }

  async created(): Promise<void> {
    await this.customAttrsStore.initialize();
  }

  @Watch('prompt')
  onPromptChange(newValue: boolean, oldValue: boolean) {
    this.selected = [] as CustomAttribute[];
    this.patternInput = '';
    this.pattern = '';
  }

  async onConfirm(): Promise<void> {
    const attrIds = this.selected.map((attr): number => attr.id);
    const newLinks = await this.attrLinkService.insert({
      objectTypeId: this.objectTypeId,
      attributeIds: attrIds,
    });
    if (!newLinks) {
      return;
    }
    newLinks.attributes.forEach((newLink) => this.attrLinksStore.content.attributes.push(newLink));
    this.$q.notify({
      message: `${this.i18n.t('actions.inserts.success')}`,
      color: 'secondary',
    });
    this.dialogRef.hide();
  }
}
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
