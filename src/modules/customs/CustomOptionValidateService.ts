import { ValidateRule } from 'src/models/ValidateRule';

const validateOptionKeyRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => val.length <= 20,
    message: 'validations.customAttributes.options.longerThan20',
  },
  {
    validate: (val) => /^[A-Z0-9_-]*$/.test(val),
    message: 'validations.customAttributes.options.keyInvalidChar',
  },
];

export const validateOptionValueRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => val.length <= 20,
    message: 'validations.customAttributes.options.longerThan20',
  },
  {
    validate: (val) => /^[^\\\\/:*?"<>|]+$/.test(val),
    message: 'validations.customAttributes.options.valueInvalidChar',
  },
];

const checkOptionKeyRules = (number: string): string | undefined => {
  const result = validateOptionKeyRules.find((rule) => !rule.validate(number));
  if (result) {
    return result.message;
  }
  return result;
};

const checkOptionValueRules = (number: string): string | undefined => {
  const result = validateOptionValueRules.find((rule) => !rule.validate(number));
  if (result) {
    return result.message;
  }
  return result;
};

export const CustomOptionValidationService = {
  checkOptionKeyRules,
  checkOptionValueRules,
};
