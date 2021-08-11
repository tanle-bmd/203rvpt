export const MESSAGE_VALIDATOR_VI = {
    'any.required': () => ' không được để trống.',
    'number.base': () => ' phải là số.',
    'string.min': (min: number) => ` phải ít nhất ${min} kí tự.`,
    'number.min': (min: number) => ` phải ít nhất là ${min}.`,
    'string.max': (max: number) => ` phải nhỏ hơn hoặc bằng ${max} kí tự.`,
    'number.max': (max: number) => ` phải nhỏ hơn hoặc bằng ${max}.`,
}
