import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { ViewType, ViewTypeOption } from '../models/Part';

const ViewTypeOptionsStore = defineStore('viewTypeOptions', {
  state: (): ViewTypeOption[] => [] as ViewTypeOption[],
  getters: {
    i18nOptions(state): ViewTypeOption[] {
      state = [
        { label: useI18n().t('parts.views.design'), value: ViewType.Design, attributeNumber: '' },
        { label: useI18n().t('parts.views.manufacturing'), value: ViewType.Manufacturing, attributeNumber: '' },
      ];
      return state;
    },
  },
});

export default ViewTypeOptionsStore;
