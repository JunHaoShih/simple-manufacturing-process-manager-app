<template>
  <div class="main-panel">
    <q-splitter
      v-model="splitterModel"
      unit="px"
      class="outer-max"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <q-list bordered padding class="rounded-borders text-black">
            <q-item
              v-for="objType in objectTypes"
              :key="objType.id"
              clickable
              v-ripple
              :active="defaultObjectType.id === objType.id"
              @click="defaultObjectType = objType"
              active-class="highlight-menu"
            >
              <q-item-section avatar>
                <q-avatar class="avatar-color" text-color="white">{{ objType.name[0] }}</q-avatar>
              </q-item-section>

              <q-item-section>
                {{ objType.number }} {{ objType.name }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>

      <template v-slot:after>
        <AttributeLinkPanel :objectTypeId="defaultObjectType.id" />
      </template>

    </q-splitter>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import { ObjectTypeService } from '../objectTypes/ObjectTypeService';
import { ObjectType } from '../objectTypes/models/ObjectType';
import AttributeLinkPanel from './components/AttributeLinkPanel.vue';

@Component({
  components: {
    AttributeLinkPanel,
  },
})
export default class AttributeLinksPage extends Vue {
  i18n = useI18n();

  splitterModel = 350;

  objectTypes = [] as ObjectType[];

  defaultObjectType = {} as ObjectType;

  objectTypeService = ObjectTypeService;

  readonly = true;

  async created(): Promise<void> {
    const objType = await this.objectTypeService.getAll();
    if (objType) {
      this.objectTypes = objType;
      const firstObjType = this.objectTypes[0];
      this.defaultObjectType = firstObjType;
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
