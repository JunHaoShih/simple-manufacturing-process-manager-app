<template>
  <q-input
    :label="label"
    v-model="inputValue"
    dense
    filled
    :error="isValueError()"
    :error-message="i18nErrorMessage"
    :readonly="readonly"
  />
</template>

<script lang="ts">
import {
  Component, Model, Prop, Vue,
} from 'vue-facing-decorator';
import { useI18n } from 'vue-i18n';

@Component({})
export default class ValidationInput extends Vue {
  i18n = useI18n();

  @Prop({
    required: false,
    type: String,
  })
  readonly label?: string;

  @Prop({
    required: false,
  })
  readonly inputValidator?: ((val: string) => string);

  errorMessage = '';

  @Model
  // eslint-disable-next-line indent
  inputValue!: string;

  @Prop({
    required: false,
  })
  // eslint-disable-next-line indent
  readonly? = true;

  isValueError(): boolean {
    if (!this.inputValidator) {
      return false;
    }
    const result = this.inputValidator(this.inputValue);
    if (result) {
      this.errorMessage = result;
      return true;
    }
    return false;
  }

  get i18nErrorMessage() {
    return this.i18n.t(this.errorMessage);
  }
}
</script>
