import { ValidateRule } from 'src/models/ValidateRule';

export const validateNumberRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.parts.notNull',
  },
  {
    validate: (val) => val.length >= 3,
    message: 'validations.parts.shorterThan3',
  },
  {
    validate: (val) => val.length <= 50,
    message: 'validations.parts.longerThan50',
  },
  {
    validate: (val) => /^[a-zA-Z0-9_-]*$/.test(val),
    message: 'validations.parts.invalidChar',
  },
];

const checkNumberRules = (number: string): string | undefined => {
  const result = validateNumberRules.find((rule) => !rule.validate(number));
  if (result) {
    return result.message;
  }
  return result;
};

const PartValidationService = {
  checkNumberRules,
};

export default PartValidationService;
