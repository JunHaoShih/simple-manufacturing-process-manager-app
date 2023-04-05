<template>
  <div class="main-panel">
    <div class="row q-pa-md">
      <q-btn color="primary" :label="$t('actions.add')"></q-btn>
      <q-btn color="primary" :label="$t('actions.delete')"></q-btn>
      <q-space/>
      <q-input
        dense
        v-model="patternInput"
        :label="$t('actions.search')"
        v-on:keyup.enter="onSearch"
      ></q-input>
    </div>
    <q-splitter
      v-model="splitterModel"
      unit="px"
      class="outer-max"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <q-list bordered padding class="rounded-borders text-black">
            <q-item
              v-for="attr in customAttributesStore.filteredAttributes(pattern)"
              :key="attr.id"
              clickable
              v-ripple
              :active="defaultAttr.id === attr.id"
              @click="defaultAttr = attr"
              active-class="highlight-menu"
            >
              <q-item-section avatar>
                <q-avatar class="avatar-color" text-color="white">{{ attr.name[0] }}</q-avatar>
              </q-item-section>

              <q-item-section>
                {{ attr.number }} {{ attr.name }} [{{ attr.languages[i18n.locale.toString()] }}]
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>

      <template v-slot:after>
        <CustomAttributePanel
          v-if="defaultAttr && Object.entries(defaultAttr).length > 0"
          v-model="defaultAttr"
          class="q-pa-md">
        </CustomAttributePanel>
      </template>

    </q-splitter>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useI18n } from 'vue-i18n';
import { CustomAttributeService } from './services/CustomAttributeService';
import CustomAttributesStore from './stores/CustomAttributesStore';
import { CustomAttribute } from './models/CustomAttribute';
import 'src/extensions/date.extensions';
import CustomAttributePanel from './components/CustomAttributePanel.vue';

@Component({
  components: {
    CustomAttributePanel,
  },
})
export default class CustomAttributesPage extends Vue {
  i18n = useI18n();

  defaultAttr = {} as CustomAttribute;

  splitterModel = 350;

  patternInput = '';

  pattern = '';

  customAttributesStore = CustomAttributesStore();

  customAttrService = CustomAttributeService;

  readonly = true;

  async created(): Promise<void> {
    const attrs = await this.customAttrService.getAll();
    if (attrs) {
      this.customAttributesStore.setAttributes(attrs);
      const firstAttr = this.customAttributesStore.attributes[0];
      this.defaultAttr = firstAttr;
    }
  }

  /**
   * Apply pattern
   */
  onSearch(): void {
    this.pattern = this.patternInput;
    const attrs = this.customAttributesStore.filteredAttributes(this.pattern);
    if (attrs) {
      const firstAttr = attrs[0];
      this.defaultAttr = firstAttr;
    }
  }
}
</script>

<style lang="sass">
.highlight-menu
  color: white
  background: #026E81

.outer-max
  height: calc(100vh - 180px)

.avatar-color
  background: #FF9933
</style>
