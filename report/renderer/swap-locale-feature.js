/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env browser */

/** @typedef {import('./dom.js').DOM} DOM */
/** @typedef {import('./report-ui-features').ReportUIFeatures} ReportUIFeatures */
/** @typedef {import('../../lighthouse-core/lib/i18n/locales').LhlMessages} LhlMessages */

export class SwapLocaleFeature {
  /**
   * @param {ReportUIFeatures} reportUIFeatures
   * @param {DOM} dom
   * @param {{fetchData: (localeModuleName: string) => Promise<LhlMessages|undefined>}} options
   *        Specifiy the URL where the i18n module script can be found, and the URLS for the locale JSON files.
   */
  constructor(reportUIFeatures, dom, options) {
    this._reportUIFeatures = reportUIFeatures;
    this._dom = dom;
    this._swapLocaleOptions = options;
  }

  async enable() {
    try {
      await this._enable();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('failed to enable swap locale feature', err);
    }
  }

  async _enable() {
    if (!this._reportUIFeatures.json.i18n.icuMessagePaths) {
      throw new Error('missing icuMessagePaths');
    }

    const i18nModule = await this._getI18nModule();
    const currentLocale = this._reportUIFeatures.json.configSettings.locale;

    const containerEl = this._dom.find('.lh-tools-locale__selector-wrapper', this._dom.document());
    const selectEl = this._dom.createChildOf(containerEl, 'select', 'lh-locale-selector');
    selectEl.name = 'lh-locale-list';

    const toggleEl = this._dom.find('.lh-tool-locale__button', this._dom.document());
    toggleEl.addEventListener('click', () => {
      toggleEl.classList.toggle('lh-active');
    });

    for (const locale of i18nModule.availableLocales) {
      const optionEl = this._dom.createChildOf(selectEl, 'option', '');
      optionEl.value = locale;
      optionEl.textContent = locale;
      if (locale === currentLocale) optionEl.selected = true;

      // @ts-expect-error
      if (window.Intl && Intl.DisplayNames) {
        // @ts-expect-error
        const currentLocaleDisplay = new Intl.DisplayNames([currentLocale], {type: 'language'});
        // @ts-expect-error
        const optionLocaleDisplay = new Intl.DisplayNames([locale], {type: 'language'});

        const optionLocaleName = optionLocaleDisplay.of(locale);
        const currentLocaleName = currentLocaleDisplay.of(locale);
        if (optionLocaleName !== currentLocaleName) {
          optionEl.textContent = `${optionLocaleName} – ${currentLocaleName}`;
        } else {
          optionEl.textContent = currentLocaleName;
        }
      }
    }

    selectEl.addEventListener('change', () => {
      const locale = /** @type {LH.Locale} */ (selectEl.value);
      this._swapLocale(locale);
    });
  }

  /**
   * @param {LH.Locale} locale
   */
  async _swapLocale(locale) {
    const i18nModule = await this._getI18nModule();
    const lhlMessages = await this._swapLocaleOptions.fetchData(locale);
    if (!lhlMessages) throw new Error(`could not fetch data for locale: ${locale}`);

    i18nModule.default.registerLocaleData(locale, lhlMessages);
    const newLhr = i18nModule.swapLocale(this._reportUIFeatures.json, locale).lhr;
    this._reportUIFeatures._refresh(newLhr);
  }

  /**
   * The i18n module is only need for the swap-locale tool option, and is ~100KB,
   * so it is lazily loaded. `initSwapLocale` must be called first.
   */
  async _getI18nModule() {
    // TODO: figure out how we want to do this.
    // 1- load based on href given (hacky code splitting).
    // /** @type {import('../../lighthouse-core/lib/i18n/i18n-module.js')} */
    // const i18nModule = await import(this._swapLocaleOptions.i18nModuleSrc);
    // 2- dynamic import, have rollup deal with it.
    const i18nModule = await import('../../lighthouse-core/lib/i18n/i18n-module.js');
    return i18nModule;
  }
}
