<template>
  <div>
    <div class="row">
      <q-btn v-if="readonly" dense round flat color="grey" icon="edit"
        @click="readonly = !readonly"
      />
      <q-btn v-else dense round flat color="green" icon="done"
        class="bg-grey-4"
        @click="onConfirmClicked"
      />
      <q-space/>
      <div class="q-ma-sm">
        Last edited: {{ new Date(defaultAttr.updateDate).getDateStr() }}
        <q-tooltip>
          {{ new Date(defaultAttr.updateDate).toString() }}
        </q-tooltip>
      </div>
    </div>
    <q-expansion-item
      v-model="infoExpanded"
      icon="article"
      :label="$t('info')"
      header-class="text-h6"
      class="expandable"
    >
      <div class="q-ma-sm">{{ $t('customs.generic.number') }}</div>
      <q-input v-model="defaultAttr.number" dense filled :readonly="readonly"></q-input>
      <div class="q-ma-sm">{{ $t('customs.generic.name') }}</div>
      <q-input v-model="defaultAttr.name" dense filled :readonly="readonly"></q-input>
      <div class="row">
        <q-checkbox
          left-label
          class="q-ma-sm"
          v-model="defaultAttr.isDisabled"
          :disable="readonly"
          :label="$t('customs.generic.disable')"
        />
      </div>
      <q-input
        v-model="defaultAttr.remarks"
        :label="$t('remarks')"
        filled
        type="textarea"
      />
    </q-expansion-item>

    <q-separator class="q-mb-md"/>
    <q-expansion-item
      v-model="langExpanded"
      icon="language"
      :label="$t('language')"
      header-class="text-h6"
      class="expandable"
    >
      <div
        v-for="[key] of Object.entries(defaultAttr.languages)"
        :key="key"
      >
        <div class="q-ma-sm">{{ key }}</div>
        <q-input v-model="defaultAttr.languages[key]"
          dense filled :readonly="readonly"></q-input>
      </div>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import {
  Component, Model, Vue, Watch,
} from 'vue-facing-decorator';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import { CustomAttribute } from '../models/CustomAttribute';

@Component({})
export default class CustomAttributePanel extends Vue {
  i18n = useI18n();

  @Model
  // eslint-disable-next-line indent
  inputAttr!: CustomAttribute;

  defaultAttr = {} as CustomAttribute;

  readonly = true;

  infoExpanded = true;

  langExpanded = false;

  created(): void {
    this.defaultAttr = JSON.parse(JSON.stringify(this.inputAttr));
  }

  onConfirmClicked(): void {
    this.inputAttr.number = this.defaultAttr.number;
    this.inputAttr.name = this.defaultAttr.name;
    this.inputAttr.remarks = this.defaultAttr.remarks;
    this.inputAttr.languages = this.defaultAttr.languages;
    this.inputAttr.isDisabled = this.defaultAttr.isDisabled;
    this.inputAttr.createUser = this.defaultAttr.createUser;
    this.inputAttr.updateUser = this.defaultAttr.updateUser;
    this.inputAttr.createDate = this.defaultAttr.createDate;
    this.inputAttr.updateDate = this.defaultAttr.updateDate;
    this.readonly = true;
  }

  @Watch('inputAttr.id')
  onModelValueUpdated(newValue: number, oldValue: number) {
    this.defaultAttr = JSON.parse(JSON.stringify(this.inputAttr));
  }
}
</script>

<style lang="sass" scoped>
.expandable
  font-family: 'Noto Sans TC'
</style>
