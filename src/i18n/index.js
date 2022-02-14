/* eslint-disable import/no-extraneous-dependencies */
import intl from 'react-intl-universal';
import _ from 'lodash';
import zhCNLocale from 'zarm/lib/config-provider/locale/zh_CN';
import enUSLocale from 'zarm/lib/config-provider/locale/en_US';
import zhCN from './zh-CN.json';
import enUS from './en-US.json';

import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/zh';

const localeConfig = { 'zh-CN': zhCNLocale, 'en-US': enUSLocale };
const LOCALE_KEY = 'lang';

/**
 * 国际化,https://github.com/alibaba/react-intl-universal
 */
export const SUPPOER_LOCALES = [
  {
    name: 'English',
    value: 'en-US',
  },
  {
    name: '简体中文',
    value: 'zh-CN',
  },
];

// 设置locale,设置完需要刷页面
export function changeLocale(locale) {
  if (locale !== localStorage.getItem(LOCALE_KEY, locale)) {
    localStorage.setItem(LOCALE_KEY, locale);
    window.location.reload();
  }
}

// 获取当前的locale信息,目前可以基于urlQuery,cookie,localstorage
export function getCurrentLocale() {
  let currentLocale = intl.determineLocale({
    urlLocaleKey: LOCALE_KEY,
    cookieLocaleKey: LOCALE_KEY,
    localStorageLocaleKey: LOCALE_KEY,
  });
  if (!_.find(SUPPOER_LOCALES, { value: currentLocale })) {
    currentLocale = 'zh-CN';
  }
  return currentLocale;
}

export async function initI18n() {
  const currentLocale = getCurrentLocale();
  return intl.init({
    currentLocale,
    locales: {
      'zh-CN': zhCN,
      'en-US': enUS,
    },
  });
}

// 获取当前antd Locale文件
export function getLocale() {
  return localeConfig[getCurrentLocale()];
}
