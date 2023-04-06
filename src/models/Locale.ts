/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Current available locales
 */

export const AvailableLocales = ['en-US', 'zh-TW'] as const;
export type AvailableLocale = typeof AvailableLocales;
