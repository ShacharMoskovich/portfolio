
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

const routing = {
  locales: ['en', 'he'],
  defaultLocale: 'en'
};

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;
 
  if (!routing.locales.includes(locale as any)) notFound();
 
  return {
    locale, // <-- Add this line right here!
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});