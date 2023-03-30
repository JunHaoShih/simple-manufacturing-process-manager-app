<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      unit="px"
      class="outer-max"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <q-list bordered padding class="rounded-borders text-black">
            <q-item
              v-for="attr in customAttributesStore.attributes"
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
                {{ attr.number }} {{ attr.name }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div>{{ defaultAttr.number }}</div>
          <div>{{ defaultAttr.name }}</div>
        </div>
      </template>

    </q-splitter>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useI18n } from 'vue-i18n';
import CustomAttributeService from './services/CustomAttributeService';
import CustomAttributesStore from './stores/CustomAttributesStore';
import { CustomAttribute } from './models/CustomAttribute';

@Component({})
export default class CustomAttributePage extends Vue {
  i18n = useI18n();

  defaultAttr = {} as CustomAttribute;

  splitterModel = 350;

  customAttributesStore = CustomAttributesStore();

  customAttrService = CustomAttributeService;

  async created(): Promise<void> {
    const attrs = await this.customAttrService.getAll();
    if (attrs) {
      this.customAttributesStore.setAttributes(attrs);
      const firstAttr = this.customAttributesStore.attributes[0];
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
  height: calc(100vh - 120px)

.avatar-color
  background: #FF9933
</style>
