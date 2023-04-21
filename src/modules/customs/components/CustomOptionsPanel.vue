<template>
  <div class="q-pa-sm">
    <q-table
      :rows="inputOptions"
      :columns="fileredColumns"
      row-key="key"
      dense
      style="position: sticky; top: 0"
    >
      <!-- button at table header -->
      <template v-if="!readonly" v-slot:top>
        <q-btn color="primary" :label="$t('actions.add')" @click="onAddClick"></q-btn>
        <q-btn color="primary" :label="$t('actions.delete')"></q-btn>
        <q-space />
      </template>
      <!-- action buttons -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense round flat
            color="grey" icon="edit" @click="onEdit(props.row as CustomOption)"></q-btn>
          <q-btn dense round flat
            color="grey" icon="delete"></q-btn>
        </q-td>
      </template>
      <!-- languages -->
      <template v-slot:body-cell-languages="props">
        <q-td :props="props">
          <q-icon name="info"/>
          <q-tooltip>
            <div
              v-for="locale in availableLocales"
              :key="locale"
            >
              <div class="q-ma-sm">{{ locale }} - {{ props.row.languages[locale] }}</div>
            </div>
          </q-tooltip>
        </q-td>
      </template>
    </q-table>
  </div>
  <!-- dialog -->
  <q-dialog ref="dialogRef" v-model="prompt" persistent>
    <q-card style="min-width: 700px">
      <q-card-section>
        <div class="text-h6">File</div>
      </q-card-section>
      <!-- key input -->
      <q-card-section class="q-pt-none">
        <ValidationInput v-model="editedOption.key" :label="$t('key')"
          :inputValidator="customOptionValidationService.checkOptionKeyRules"
          :readonly="dialogMode === 2"
        />
      </q-card-section>
      <!-- value input -->
      <q-card-section class="q-pt-none">
        <ValidationInput v-model="editedOption.value" :label="$t('value')"
          :inputValidator="customOptionValidationService.checkOptionValueRules"
        />
      </q-card-section>
      <!-- languages input -->
      <q-card-section class="q-pt-none">
        <div
          v-for="locale in availableLocales"
          :key="locale"
        >
          <div class="q-ma-sm">{{ locale }}</div>
          <ValidationInput v-model="editedOption.languages[locale]"
            :inputValidator="langValidateService.checkLanguageRules"
          />
        </div>
      </q-card-section>
      <!-- actions -->
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup></q-btn>
        <q-btn flat label="Confirm" @click="onDialogConfirm"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  Component, Emit, Model, Prop, Ref, Vue,
} from 'vue-facing-decorator';
import { QDialog, QTableProps, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import ValidationInput from 'src/components/ValidationInput.vue';
import { AvailableLocales } from 'src/models/Locale';
import { DialogType } from 'src/models/DialogType';
import { CustomOption } from '../models/CustomAttribute';
import { CustomOptionValidateService } from '../services/CustomOptionValidateService';
import { LanguageValidateService } from '../services/LanguageValidateService';

@Component({
  components: {
    ValidationInput,
  },
})
export default class CustomOptionsPanel extends Vue {
  i18n = useI18n();

  $q = useQuasar();

  availableLocales = AvailableLocales;

  customOptionValidationService = CustomOptionValidateService;

  langValidateService = LanguageValidateService;

  /**
   * Decide if dialog will be displayed
   */
  prompt = false;

  @Model inputOptions!: CustomOption[];

  @Emit('update:modelValue')
  updateModelValue() {
    return this.inputOptions;
  }

  @Prop({
    required: true,
  }) readonly = true;

  @Ref dialogRef!: QDialog;

  dialogMode = DialogType.None;

  editedOption = {} as CustomOption;

  get fileredColumns(): QTableProps['columns'] {
    if (this.readonly) {
      return this.columns?.filter((col) => col.name !== 'actions');
    }
    return this.columns;
  }

  get columns(): QTableProps['columns'] {
    return [
      {
        name: 'actions', label: this.i18n.t('actions.action'), field: '', align: 'center', style: 'width: 60px',
      },
      {
        name: 'key', required: true, label: this.i18n.t('key'), align: 'left', field: 'key', sortable: true,
      },
      {
        name: 'value', label: this.i18n.t('value'), field: 'value', align: 'left', sortable: true,
      },
      {
        name: 'languages', label: this.i18n.t('language'), field: '', align: 'left', sortable: false,
      },
    ];
  }

  onAddClick(): void {
    this.dialogMode = DialogType.Insert;
    this.editedOption = {
      key: '',
      value: '',
      languages: {},
    };
    this.prompt = true;
  }

  onEdit(customOption: CustomOption): void {
    // Load custom option data into dialog
    this.dialogMode = DialogType.Edit;
    this.editedOption = JSON.parse(JSON.stringify(customOption));
    // Show dialog
    this.prompt = true;
  }

  onDialogConfirm(): void {
    const error = this.customOptionValidationService.checkOptionRules(this.editedOption);
    if (error) {
      this.$q.notify({
        message: `Error: ${this.i18n.t(error)}`,
        color: 'red',
      });
      return;
    }
    switch (this.dialogMode) {
      case DialogType.Edit: {
        const targetOption = this.inputOptions
          .find((option) => option.key === this.editedOption.key);
        if (!targetOption) {
          return;
        }
        targetOption.value = this.editedOption.value;
        targetOption.languages = this.editedOption.languages;
        break;
      }
      case DialogType.Insert: {
        this.inputOptions.push(this.editedOption);
        break;
      }
      default: {
        break;
      }
    }
    this.dialogRef.hide();
  }
}
</script>

<style lang="sass" scoped>
.expandable
  font-family: 'Noto Sans TC'
</style>
