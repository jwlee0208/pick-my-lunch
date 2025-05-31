// i18n/request.ts
import {getRequestConfig, GetRequestConfigParams} from 'next-intl/server';

export default getRequestConfig(async ({ locale }: GetRequestConfigParams) => {
    return {
        locale,
        messages: (await import(`@/locales/${locale}/messages.json`)).default
    };
});
