<template>
  <div>
    <!-- action bar -->
    <q-dialog ref="dialogRef" v-model="prompt" persistent
      transition-show="rotate" transition-hide="rotate"
    >
      <q-card style="min-width: 700px">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ $t('customs.attributes.new') }}</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll dialog-inner-max">
          <!-- info area -->
          <CustomAttributePanel
            v-model="defaultAttr"
            :readonly="readonly"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
          <q-btn flat :label="$t('actions.confirm')" @click="onConfirmClicked"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Model, Ref, Vue, Watch,
} from 'vue-facing-decorator';
import { QDialog, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import { AvailableLocales } from 'src/models/Locale';
import { CustomAttributeService } from '../services/CustomAttributeService';
import { AttributeType, DisplayType } from '../models/CustomAttribute';
import CustomAttributePanel from './CustomAttributePanel.vue';
import { CustomAttributesStore } from '../stores/CustomAttributesStore';
import { CustomAttributeValidationService } from '../services/CustomAttributeValidationService';
import { CreateCustomAttributeDTO } from '../models/CreateCustomAttributeDTO';

@Component({
  components: {
    CustomAttributePanel,
  },
})
export default class CustomAttributeAddDialog extends Vue {
  i18n = useI18n();

  $q = useQuasar();

  customAttributesStore = CustomAttributesStore();

  customAttrService = CustomAttributeService;

  customAttrValidationRuleService = CustomAttributeValidationService;

  availableLocales = AvailableLocales;

  @Model prompt!: boolean;

  @Emit('update:modelValue')
  updateModelValue() {
    return this.prompt;
  }

  @Ref dialogRef!: QDialog;

  defaultAttr = {} as CreateCustomAttributeDTO;

  readonly = false;

  created(): void {
    this.initialize();
  }

  @Watch('prompt')
  onModelValueUpdated(newValue: boolean, oldValue: boolean) {
    if (oldValue === false && newValue === true) {
      this.initialize();
    }
  }

  initialize(): void {
    this.defaultAttr = {
      number: '',
      name: '',
      languages: Object.fromEntries(this.availableLocales.map((locale) => [locale, ''])),
      attributeType: AttributeType.String,
      displayType: DisplayType.Value,
      isDisabled: false,
      options: [],
      remarks: '',
    };
  }

  async onConfirmClicked(): Promise<void> {
    const result = this.customAttrValidationRuleService.checkCreateAttributeRules(this.defaultAttr);
    if (result) {
      this.$q.notify({
        message: `Error: ${this.i18n.t(result)}`,
        color: 'red',
      });
      return;
    }
    const newAttr = await this.customAttrService.create(this.defaultAttr);
    if (!newAttr) {
      return;
    }

    this.customAttributesStore.addAttribute(newAttr);
    this.$q.notify({
      message: `${newAttr.number} ${this.i18n.t('actions.inserts.success')}`,
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
