import { applyDecorators } from "@tsed/core";
import { IResponseOptions, mapReturnedResponse, UseBefore } from "@tsed/common";
import Joi, { ValidationResult, SchemaMap, ValidationErrorItem } from '@hapi/joi';

import { capitalize, isEmptyObject } from '../../util/helper'
import { MESSAGE_VALIDATOR_VI } from '../../util/language'

export enum Language {
    Vietnamese = 'VI',
    English = 'EN'
}

const LANGUAGES = [Language.Vietnamese as string, Language.English as string]

function validateRequest(req: any, rules: SchemaMap) {
    const parameters = { ...req.body, ...req.query, ...req.headers, ...req.params }
    const validateKeys = Object.keys(rules)

    for (const key in parameters) {
        if (!validateKeys.includes(key)) delete parameters[key]
    }

    const schema = Joi.object(rules)
    const result = schema.validate(parameters)
    return result
}

function handleLanguageRequest(req: any) {
    const query = req.query
    const defaultLanguage = 'en'
    if (!query && !query.lang) return defaultLanguage

    const requestLanguage = query.lang
    if (!LANGUAGES.includes(requestLanguage)) return defaultLanguage

    return requestLanguage
}

function getMessageEnglish(originMessage: string, originLabel: string): string {
    const labelCapitalized = capitalize(originLabel)
    const label = `"${labelCapitalized}"`
    const message = originMessage.replace(/\"[a-z]*\"/gm, label)
    return message
}

// function getMessageWithCustomLabels(labels: Object, language: string, error: ValidationErrorItem): any {
//     const originLabel = error.context.label
//     const originKey = error.context.key
//     const originType = error.type

//     const label = labels[originKey] || originLabel

//     if (language == Language.Vietnamese) {
//         const originLimit = error.context.limit || false
//         const message = `"${label}"` + MESSAGE_VALIDATOR_VI[originType](originLimit)
//         return message
//     }

//     return getMessageEnglish(error.message, label)
// }

function handleMessage(language: string, error: ValidationErrorItem, labels: any): string {
    const originMessage = error.message
    const originLabel = error.context.label

    if (!isEmptyObject(labels))
        return getMessageEnglish(originMessage, originLabel)

    if (language == Language.Vietnamese) {
        const labelsVietnamese = labels[Language.Vietnamese]
        if (!labelsVietnamese) return getMessageEnglish(originMessage, originLabel)
        // else return getMessageWithCustomLabels(labelsVietnamese, Language.Vietnamese, error)
    }

    const labelsEnglish = labels[Language.English]
    if (!labelsEnglish) return getMessageEnglish(originMessage, originLabel)
    // else return getMessageWithCustomLabels(labelsEnglish, Language.English, error)
}

function handleResultValidate(result: any, req: any, labels: any): string {
    const language = handleLanguageRequest(req)
    if (!result || !result.error) return

    const errors = result.error.details
    if (!errors || !errors.length) return

    const error = errors[0]
    const message = handleMessage(language, error, labels)
    return message
}

export function Validator(rules: SchemaMap, labels: Object = {}, options: any = {}) {
    const response = mapReturnedResponse(options);

    return applyDecorators(
        UseBefore((req: any, res: any, next: any) => {
            const result = validateRequest(req, rules)
            const message = handleResultValidate(result, req, labels)
            if (message) return res.sendClientError(message)
            else next();
        })
    );
}
