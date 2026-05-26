export const VALIDATION_MESSAGES: Record<string, (err: any) => string> = {
  required: () => "Це поле обов'язкове",
  email: () => 'Невірний формат пошти',
  minlength: (err) => `Мінімум ${err.requiredLength} символів`,
  maxlength: (err) => `Максимум ${err.requiredLength} символів`,
  passwordMismatch: () => 'Паролі не співпадають',
  passwordComplexity: () => 'Пароль має містити великі та малі літери, цифри та спецсимвол',
  requiredLineName: () => "Це поле обов'язкове",
};

export const VALIDATION_PRIORITY: string[] = [
  'required',
  'email',
  'minlength',
  'maxlength',
  'passwordComplexity',
  'passwordMismatch',
  'requiredLineName',
];
