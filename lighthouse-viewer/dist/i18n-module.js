(function(f) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = f();
  } else if (typeof define === 'function' && define.amd) {
    define([], f);
  } else {
    let g; if (typeof window !== 'undefined') {
      g = window;
    } else if (typeof global !== 'undefined') {
      g = global;
    } else if (typeof self !== 'undefined') {
      g = self;
    } else {
      g = this;
    }(g.Lighthouse || (g.Lighthouse = {})).i18n = f();
  }
})(function() {
  let define; let module; let exports; return (function() {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            const c = 'function' === typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); const a = new Error('Cannot find module \'' + i + '\''); throw a.code = 'MODULE_NOT_FOUND', a;
          } const p = n[i] = {exports: {}}; e[i][0].call(p.exports, function(r) {
            const n = e[i][1][r]; return o(n || r);
          }, p, p.exports, r, e, n, t);
        } return n[i].exports;
      } for (var u = 'function' === typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o;
    } return r;
  })()({1: [function(require, module, exports) {
    /**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
    'use strict';

    module.exports = {
      swapLocale: require('./swap-locale.js'),
      availableLocales: ['en-US'], // Is replaced, see build-i18n.module.js
      ...require('./i18n.js'),
    };
  }, {'./i18n.js': 2, './swap-locale.js': 4}], 2: [function(require, module, exports) {
    (function(__filename) {
      (function() {
        /**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
        'use strict';

        /** @typedef {import('../../lib/i18n/locales').LhlMessages} LhlMessages */

        const path = require('path');
        const MessageFormat = require('intl-messageformat').default;
        const lookupClosestLocale = require('lookup-closest-locale');
        const LOCALES = require('./locales.js');
        const {isObjectOfUnknownValues, isObjectOrArrayOfUnknownValues} = require('../type-verifiers.js');
        const log = require('lighthouse-logger');
        const {LH_ROOT} = require('../../../root.js');

        const DEFAULT_LOCALE = 'en';

        /** @typedef {import('intl-messageformat-parser').Element} MessageElement */
        /** @typedef {import('intl-messageformat-parser').ArgumentElement} ArgumentElement */

        const MESSAGE_I18N_ID_REGEX = / | [^\s]+$/;

        const UIStrings = {
          /** Used to show the duration in milliseconds that something lasted. The `{timeInMs}` placeholder will be replaced with the time duration, shown in milliseconds (e.g. 63 ms) */
          ms: '{timeInMs, number, milliseconds}\xa0ms',
          /** Used to show the duration in seconds that something lasted. The {timeInMs} placeholder will be replaced with the time duration, shown in seconds (e.g. 5.2 s) */
          seconds: '{timeInMs, number, seconds}\xa0s',
          /** Label shown per-audit to show how many bytes smaller the page could be if the user implemented the suggestions. The `{wastedBytes}` placeholder will be replaced with the number of bytes, shown in kibibytes (e.g. 148 KiB) */
          displayValueByteSavings: 'Potential savings of {wastedBytes, number, bytes}\xa0KiB',
          /** Label shown per-audit to show how many milliseconds faster the page load could be if the user implemented the suggestions. The `{wastedMs}` placeholder will be replaced with the time duration, shown in milliseconds (e.g. 140 ms) */
          displayValueMsSavings: 'Potential savings of {wastedMs, number, milliseconds}\xa0ms',
          /** Label shown per-audit to show how many HTML elements did not pass the audit. The `{# elements found}` placeholder will be replaced with the number of failing HTML elements. */
          displayValueElementsFound: `{nodeCount, plural, =1 {1 element found} other {# elements found}}`,
          /** Label for a column in a data table; entries will be the URL of a web resource */
          columnURL: 'URL',
          /** Label for a column in a data table; entries will be the size or quantity of some resource, e.g. the width and height dimensions of an image or the number of images in a web page. */
          columnSize: 'Size',
          /** Label for a column in a data table; entries will be the file size of a web resource in kilobytes. */
          columnResourceSize: 'Resource Size',
          /** Label for a column in a data table; entries will be the download size of a web resource in kilobytes. */
          columnTransferSize: 'Transfer Size',
          /** Label for a column in a data table; entries will be the time to live value of the cache header on a web resource. */
          columnCacheTTL: 'Cache TTL',
          /** Label for a column in a data table; entries will be the number of kilobytes the user could reduce their page by if they implemented the suggestions. */
          columnWastedBytes: 'Potential Savings',
          /** Label for a column in a data table; entries will be the number of milliseconds the user could reduce page load by if they implemented the suggestions. */
          columnWastedMs: 'Potential Savings',
          /** Label for a table column that displays how much time each row spent blocking other work on the main thread, entries will be the number of milliseconds spent. */
          columnBlockingTime: 'Main-Thread Blocking Time',
          /** Label for a column in a data table; entries will be the number of milliseconds spent during a particular activity. */
          columnTimeSpent: 'Time Spent',
          /** Label for a column in a data table; entries will be the location of a specific line of code in a file, in the format "line: 102". */
          columnLocation: 'Location',
          /** Label for a column in a data table; entries will be types of resources loaded over the network, e.g. "Scripts", "Third-Party", "Stylesheet". */
          columnResourceType: 'Resource Type',
          /** Label for a column in a data table; entries will be the number of network requests done by a webpage. */
          columnRequests: 'Requests',
          /** Label for a column in a data table; entries will be the names of arbitrary objects, e.g. the name of a Javascript library, or the name of a user defined timing event. */
          columnName: 'Name',
          /** Label for a column in a data table; entries will be the locations of JavaScript or CSS code, e.g. the name of a Javascript package or module. */
          columnSource: 'Source',
          /** Label for a column in a data table; entries will be how much a predetermined budget has been exeeded by. Depending on the context, this number could represent an excess in quantity or size of network requests, or, an excess in the duration of time that it takes for the page to load.*/
          columnOverBudget: 'Over Budget',
          /** Label for a column in a data table; entries will be a representation of a DOM element. */
          columnElement: 'Element',
          /** Label for a column in a data table; entries will be the number of milliseconds since the page started loading. */
          columnStartTime: 'Start Time',
          /** Label for a column in a data table; entries will be the total number of milliseconds from the start time until the end time. */
          columnDuration: 'Duration',
          /** Label for a column in a data table; entries will be a representation of a DOM element that did not meet certain suggestions. */
          columnFailingElem: 'Failing Elements',
          /** Label for a column in a data table; entries will be a description of the table item. */
          columnDescription: 'Description',
          /** Label for a row in a data table; entries will be the total number and byte size of all resources loaded by a web page. */
          totalResourceType: 'Total',
          /** Label for a row in a data table; entries will be the total number and byte size of all 'Document' resources loaded by a web page. */
          documentResourceType: 'Document',
          /** Label for a row in a data table; entries will be the total number and byte size of all 'Script' resources loaded by a web page. 'Script' refers to JavaScript or other files that are executable by a browser. */
          scriptResourceType: 'Script',
          /** Label for a row in a data table; entries will be the total number and byte size of all 'Stylesheet' resources loaded by a web page. 'Stylesheet' refers to CSS stylesheets. */
          stylesheetResourceType: 'Stylesheet',
          /** Label for a row in a data table; entries will be the total number and byte size of all 'Image' resources loaded by a web page. */
          imageResourceType: 'Image',
          /** Label for a row in a data table; entries will be the total number and byte size of all 'Media' resources loaded by a web page. 'Media' refers to audio and video files. */
          mediaResourceType: 'Media',
          /** Label for a row in a data table; entries will be the total number and byte size of all 'Font' resources loaded by a web page. */
          fontResourceType: 'Font',
          /** Label for a row in a data table; entries will be the total number and byte size of all resources loaded by a web page that don't fit into the categories of Document, Script, Stylesheet, Image, Media, & Font.*/
          otherResourceType: 'Other',
          /** Label for a row in a data table; entries will be the total number and byte size of all third-party resources loaded by a web page. 'Third-party resources are items loaded from URLs that aren't controlled by the owner of the web page. */
          thirdPartyResourceType: 'Third-party',
          /** Label used to identify a value in a table where many individual values are aggregated to a single value, for brevity. "Other resources" could also be read as "the rest of the resources". Resource refers to network resources requested by the browser. */
          otherResourcesLabel: 'Other resources',
          /** The name of the metric that marks the time at which the first text or image is painted by the browser. Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
          firstContentfulPaintMetric: 'First Contentful Paint',
          /** The name of the metric that marks the time at which the page is fully loaded and is able to quickly respond to user input (clicks, taps, and keypresses feel responsive). Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
          interactiveMetric: 'Time to Interactive',
          /** The name of the metric that marks the time at which a majority of the content has been painted by the browser. Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
          firstMeaningfulPaintMetric: 'First Meaningful Paint',
          /** The name of a metric that calculates the total duration of blocking time for a web page. Blocking times are time periods when the page would be blocked (prevented) from responding to user input (clicks, taps, and keypresses will feel slow to respond). Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
          totalBlockingTimeMetric: 'Total Blocking Time',
          /** The name of the metric "Maximum Potential First Input Delay" that marks the maximum estimated time between the page receiving input (a user clicking, tapping, or typing) and the page responding. Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
          maxPotentialFIDMetric: 'Max Potential First Input Delay',
          /** The name of the metric that summarizes how quickly the page looked visually complete. The name of this metric is largely abstract and can be loosely translated. Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
          speedIndexMetric: 'Speed Index',
          /** The name of the metric that marks the time at which the largest text or image is painted by the browser. Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
          largestContentfulPaintMetric: 'Largest Contentful Paint',
          /** The name of the metric "Cumulative Layout Shift" that indicates how much the page changes its layout while it loads. If big segments of the page shift their location during load, the Cumulative Layout Shift will be higher. Shown to users as the label for the numeric metric value. Ideally fits within a ~40 character limit. */
          cumulativeLayoutShiftMetric: 'Cumulative Layout Shift',
          /** Table item value for the severity of a small, or low impact vulnerability. Part of a ranking scale in the form: low, medium, high. */
          itemSeverityLow: 'Low',
          /** Table item value for the severity of a vulnerability. Part of a ranking scale in the form: low, medium, high. */
          itemSeverityMedium: 'Medium',
          /** Table item value for the severity of a high impact, or dangerous vulnerability. Part of a ranking scale in the form: low, medium, high. */
          itemSeverityHigh: 'High',
        };

        const formats = {
          number: {
            bytes: {
              maximumFractionDigits: 0,
            },
            milliseconds: {
              maximumFractionDigits: 0,
            },
            seconds: {
              // Force the seconds to the tenths place for limited output and ease of scanning
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            },
            extendedPercent: {
              // Force allow up to two digits after decimal place in percentages. (Intl.NumberFormat options)
              maximumFractionDigits: 2,
              style: 'percent',
            },
          },
        };

        /**
 * Look up the best available locale for the requested language through these fall backs:
 * - exact match
 * - progressively shorter prefixes (`de-CH-1996` -> `de-CH` -> `de`)
 * - supported locales in Intl formatters
 *
 * If `locale` isn't provided or one could not be found, DEFAULT_LOCALE is returned.
 * @param {string|string[]=} locales
 * @return {LH.Locale}
 */
        function lookupLocale(locales) {
          // If Node was built with `--with-intl=none`, `Intl` won't exist.
          if (typeof Intl !== 'object') {
            throw new Error('Lighthouse must be run in Node with `Intl` support. See https://nodejs.org/api/intl.html for help');
          }

          // TODO: could do more work to sniff out the user's locale
          const canonicalLocales = Intl.getCanonicalLocales(locales);

          // Filter by what's available in this runtime.
          const availableLocales = Intl.NumberFormat.supportedLocalesOf(canonicalLocales);

          const closestLocale = lookupClosestLocale(availableLocales, LOCALES);

          if (!closestLocale) {
            // Log extra info if we're pretty sure this version of Node was built with `--with-intl=small-icu`.
            if (Intl.NumberFormat.supportedLocalesOf('es').length === 0) {
              log.warn('i18n', 'Requested locale not available in this version of node. The `full-icu` npm module can provide additional locales. For help, see https://github.com/GoogleChrome/lighthouse/blob/master/readme.md#how-do-i-get-localized-lighthouse-results-via-the-cli');
            }
            // eslint-disable-next-line max-len
            log.warn('i18n', `locale(s) '${locales}' not available. Falling back to default '${DEFAULT_LOCALE}'`);
          }

          return closestLocale || DEFAULT_LOCALE;
        }

        /**
 * Function to retrieve all 'argumentElement's from an ICU message. An argumentElement
 * is an ICU element with an argument in it, like '{varName}' or '{varName, number, bytes}'. This
 * differs from 'messageElement's which are just arbitrary text in a message.
 *
 * Notes:
 *  This function will recursively inspect plural elements for nested argumentElements.
 *
 *  We need to find all the elements from the plural format sections, but
 *  they need to be deduplicated. I.e. "=1{hello {icu}} =other{hello {icu}}"
 *  the variable "icu" would appear twice if it wasn't de duplicated. And they cannot
 *  be stored in a set because they are not equal since their locations are different,
 *  thus they are stored via a Map keyed on the "id" which is the ICU varName.
 *
 * @param {Array<MessageElement>} icuElements
 * @param {Map<string, ArgumentElement>} [seenElementsById]
 * @return {Map<string, ArgumentElement>}
 */
        function collectAllCustomElementsFromICU(icuElements, seenElementsById = new Map()) {
          for (const el of icuElements) {
            // We are only interested in elements that need ICU formatting (argumentElements)
            if (el.type !== 'argumentElement') continue;

            seenElementsById.set(el.id, el);

            // Plurals need to be inspected recursively
            if (!el.format || el.format.type !== 'pluralFormat') continue;
            // Look at all options of the plural (=1{} =other{}...)
            for (const option of el.format.options) {
              // Run collections on each option's elements
              collectAllCustomElementsFromICU(option.value.elements, seenElementsById);
            }
          }

          return seenElementsById;
        }

        /**
 * Returns a copy of the `values` object, with the values formatted based on how
 * they will be used in their icuMessage, e.g. KB or milliseconds. The original
 * object is unchanged.
 * @param {MessageFormat} messageFormatter
 * @param {Readonly<Record<string, string | number>>} values
 * @param {string} lhlMessage Used for clear error logging.
 * @return {Record<string, string | number>}
 */
        function _preformatValues(messageFormatter, values, lhlMessage) {
          const elementMap = collectAllCustomElementsFromICU(messageFormatter.getAst().elements);
          const argumentElements = [...elementMap.values()];

          /** @type {Record<string, string | number>} */
          const formattedValues = {};

          for (const {id, format} of argumentElements) {
            // Throw an error if a message's value isn't provided
            if (id && (id in values) === false) {
              throw new Error(`ICU Message "${lhlMessage}" contains a value reference ("${id}") ` +
        `that wasn't provided`);
            }

            const value = values[id];

            // Direct `{id}` replacement and non-numeric values need no formatting.
            if (!format || format.type !== 'numberFormat') {
              formattedValues[id] = value;
              continue;
            }

            if (typeof value !== 'number') {
              throw new Error(`ICU Message "${lhlMessage}" contains a numeric reference ("${id}") ` +
        'but provided value was not a number');
            }

            // Format values for known styles.
            if (format.style === 'milliseconds') {
              // Round all milliseconds to the nearest 10.
              formattedValues[id] = Math.round(value / 10) * 10;
            } else if (format.style === 'seconds' && id === 'timeInMs') {
              // Convert all seconds to the correct unit (currently only for `timeInMs`).
              formattedValues[id] = Math.round(value / 100) / 10;
            } else if (format.style === 'bytes') {
              // Replace all the bytes with KB.
              formattedValues[id] = value / 1024;
            } else {
              // For all other number styles, the value isn't changed.
              formattedValues[id] = value;
            }
          }

          // Throw an error if a value is provided but has no placeholder in the message.
          for (const valueId of Object.keys(values)) {
            if (valueId in formattedValues) continue;

            // errorCode is a special case always allowed to help LHError ease-of-use.
            if (valueId === 'errorCode') {
              formattedValues.errorCode = values.errorCode;
              continue;
            }

            throw new Error(`Provided value "${valueId}" does not match any placeholder in ` +
      `ICU message "${lhlMessage}"`);
          }

          return formattedValues;
        }

        /**
 * Format string `message` by localizing `values` and inserting them.
 * @param {string} message
 * @param {Record<string, string | number>} values
 * @param {LH.Locale} locale
 * @return {string}
 */
        function _formatMessage(message, values = {}, locale) {
          // When using accented english, force the use of a different locale for number formatting.
          const localeForMessageFormat = (locale === 'en-XA' || locale === 'en-XL') ? 'de-DE' : locale;

          const formatter = new MessageFormat(message, localeForMessageFormat, formats);

          // Preformat values for the message format like KB and milliseconds.
          const valuesForMessageFormat = _preformatValues(formatter, values, message);

          return formatter.format(valuesForMessageFormat);
        }

        /**
 * Retrieves the localized version of `icuMessage` and formats with any given
 * value replacements.
 * @param {LH.IcuMessage} icuMessage
 * @param {LH.Locale} locale
 * @return {string}
 */
        function _localizeIcuMessage(icuMessage, locale) {
          const localeMessages = LOCALES[locale];
          if (!localeMessages) throw new Error(`Unsupported locale '${locale}'`);
          const localeMessage = localeMessages[icuMessage.i18nId];

          // Fall back to the default (usually the original english message) if we couldn't find a
          // message in the specified locale. This could be because of string drift between
          // Lighthouse versions or because new strings haven't been updated yet. Better to have
          // an english message than no message at all; in some cases it won't even matter.
          if (!localeMessage) {
            return icuMessage.formattedDefault;
          }

          return _formatMessage(localeMessage.message, icuMessage.values, locale);
        }

        /** @param {string[]} pathInLHR */
        function _formatPathAsString(pathInLHR) {
          let pathAsString = '';
          for (const property of pathInLHR) {
            if (/^[a-z]+$/i.test(property)) {
              if (pathAsString.length) pathAsString += '.';
              pathAsString += property;
            } else {
              if (/]|"|'|\s/.test(property)) throw new Error(`Cannot handle "${property}" in i18n`);
              pathAsString += `[${property}]`;
            }
          }

          return pathAsString;
        }

        /**
 * @param {LH.Locale} locale
 * @return {LH.I18NRendererStrings}
 */
        function getRendererFormattedStrings(locale) {
          const localeMessages = LOCALES[locale];
          if (!localeMessages) throw new Error(`Unsupported locale '${locale}'`);

          const icuMessageIds = Object.keys(localeMessages).filter(f => f.startsWith('report/'));
          const strings = /** @type {LH.I18NRendererStrings} */ ({});
          for (const icuMessageId of icuMessageIds) {
            const [filename, varName] = icuMessageId.split(' | ');
            if (!filename.endsWith('util.js')) throw new Error(`Unexpected message: ${icuMessageId}`);

            const key = /** @type {keyof LH.I18NRendererStrings} */ (varName);
            strings[key] = localeMessages[icuMessageId].message;
          }

          return strings;
        }

        /**
 * Returns a function that generates `LH.IcuMessage` objects to localize the
 * messages in `fileStrings` and the shared `i18n.UIStrings`.
 * @param {string} filename
 * @param {Record<string, string>} fileStrings
 */
        function createIcuMessageFn(filename, fileStrings) {
          /**
   * Combined so fn can access both caller's strings and i18n.UIStrings shared across LH.
   * @type {Record<string, string>}
   */
          const mergedStrings = {...UIStrings, ...fileStrings};

          /**
   * Convert a message string and replacement values into an `LH.IcuMessage`.
   * @param {string} message
   * @param {Record<string, string | number>} [values]
   * @return {LH.IcuMessage}
   */
          const getIcuMessageFn = (message, values) => {
            const keyname = Object.keys(mergedStrings).find(key => mergedStrings[key] === message);
            if (!keyname) throw new Error(`Could not locate: ${message}`);

            const filenameToLookup = keyname in fileStrings ? filename : __filename;
            const unixStyleFilename = path.relative(LH_ROOT, filenameToLookup).replace(/\\/g, '/');
            const i18nId = `${unixStyleFilename} | ${keyname}`;

            return {
              i18nId,
              values,
              formattedDefault: _formatMessage(message, values, DEFAULT_LOCALE),
            };
          };

          return getIcuMessageFn;
        }

        /**
 * Returns whether `icuMessageOrNot`` is an `LH.IcuMessage` instance.
 * @param {unknown} icuMessageOrNot
 * @return {icuMessageOrNot is LH.IcuMessage}
 */
        function isIcuMessage(icuMessageOrNot) {
          if (!isObjectOfUnknownValues(icuMessageOrNot)) {
            return false;
          }

          const {i18nId, values, formattedDefault} = icuMessageOrNot;
          if (typeof i18nId !== 'string') {
            return false;
          }

          // formattedDefault is required.
          if (typeof formattedDefault !== 'string') {
            return false;
          }

          // Values is optional.
          if (values !== undefined) {
            if (!isObjectOfUnknownValues(values)) {
              return false;
            }
            for (const value of Object.values(values)) {
              if (typeof value !== 'string' && typeof value !== 'number') {
                return false;
              }
            }
          }

          // Finally return true if i18nId seems correct.
          return MESSAGE_I18N_ID_REGEX.test(i18nId);
        }

        /**
 * Get the localized and formatted form of `icuMessageOrRawString` if it's an
 * LH.IcuMessage, or get it back directly if it's already a string.
 * Warning: this function throws if `icuMessageOrRawString` is not the expected
 * type (use function from `createIcuMessageFn` to create a valid LH.IcuMessage)
 * or `locale` isn't supported (use `lookupLocale` to find a valid locale).
 * @param {LH.IcuMessage | string} icuMessageOrRawString
 * @param {LH.Locale} locale
 * @return {string}
 */
        function getFormatted(icuMessageOrRawString, locale) {
          if (isIcuMessage(icuMessageOrRawString)) {
            return _localizeIcuMessage(icuMessageOrRawString, locale);
          }

          if (typeof icuMessageOrRawString === 'string') {
            return icuMessageOrRawString;
          }

          // Should be impossible from types, but do a strict check in case malformed JSON makes it this far.
          throw new Error('Attempted to format invalid icuMessage type');
        }

        /**
 * Recursively walk the input object, looking for property values that are
 * `LH.IcuMessage`s and replace them with their localized values. Primarily
 * used with the full LHR or a Config as input.
 * Returns a map of locations that were replaced to the `IcuMessage` that was at
 * that location.
 * @param {unknown} inputObject
 * @param {LH.Locale} locale
 * @return {LH.IcuMessagePaths}
 */
        function replaceIcuMessages(inputObject, locale) {
          /**
   * @param {unknown} subObject
   * @param {LH.IcuMessagePaths} icuMessagePaths
   * @param {string[]} pathInLHR
   */
          function replaceInObject(subObject, icuMessagePaths, pathInLHR = []) {
            if (!isObjectOrArrayOfUnknownValues(subObject)) return;

            for (const [property, possibleIcuMessage] of Object.entries(subObject)) {
              const currentPathInLHR = pathInLHR.concat([property]);

              // Replace any IcuMessages with a localized string.
              if (isIcuMessage(possibleIcuMessage)) {
                const formattedString = _localizeIcuMessage(possibleIcuMessage, locale);
                const messageInstancesInLHR = icuMessagePaths[possibleIcuMessage.i18nId] || [];
                const currentPathAsString = _formatPathAsString(currentPathInLHR);

                messageInstancesInLHR.push(
          possibleIcuMessage.values ?
            {values: possibleIcuMessage.values, path: currentPathAsString} :
            currentPathAsString
                );

                // @ts-ignore - tsc doesn't like that `property` can be either string key or array index.
                subObject[property] = formattedString;
                icuMessagePaths[possibleIcuMessage.i18nId] = messageInstancesInLHR;
              } else {
                replaceInObject(possibleIcuMessage, icuMessagePaths, currentPathInLHR);
              }
            }
          }

          /** @type {LH.IcuMessagePaths} */
          const icuMessagePaths = {};
          replaceInObject(inputObject, icuMessagePaths);
          return icuMessagePaths;
        }

        /**
 * Populate the i18n string lookup dict with locale data
 * Used when the host environment selects the locale and serves lighthouse the intended locale file
 * @see https://docs.google.com/document/d/1jnt3BqKB-4q3AE94UWFA0Gqspx8Sd_jivlB7gQMlmfk/edit
 * @param {LH.Locale} locale
 * @param {LhlMessages} lhlMessages
 */
        function registerLocaleData(locale, lhlMessages) {
          LOCALES[locale] = lhlMessages;
        }

        /**
 * Returns true if the given value is a string or an LH.IcuMessage.
 * @param {unknown} value
 * @return {value is string|LH.IcuMessage}
 */
        function isStringOrIcuMessage(value) {
          return typeof value === 'string' || isIcuMessage(value);
        }

        module.exports = {
          _formatPathAsString,
          UIStrings,
          lookupLocale,
          getRendererFormattedStrings,
          createIcuMessageFn,
          getFormatted,
          replaceIcuMessages,
          isIcuMessage,
          collectAllCustomElementsFromICU,
          registerLocaleData,
          isStringOrIcuMessage,
          // TODO: exported for backwards compatibility. Consider removing on future breaking change.
          createMessageInstanceIdFn: createIcuMessageFn,
        };
      }).call(this);
    }).call(this, '/lighthouse-core/lib/i18n/i18n.js');
  }, {'../../../root.js': 24, '../type-verifiers.js': 5, './locales.js': 3, 'intl-messageformat': 13, 'lighthouse-logger': 14, 'lookup-closest-locale': 20, 'path': 22}], 3: [function(require, module, exports) {
    (function(__dirname) {
      (function() {
        /**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
        'use strict';

        /**
 * @fileoverview
 * Define message file to be used for a given locale. A few aliases are defined below.
 *
 * Google locale inheritance rules: https://goto.google.com/ccssm
 * CLDR language aliases: https://www.unicode.org/cldr/charts/latest/supplemental/aliases.html
 * CLDR locale inheritance: https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/parentLocales.json
 */

        // TODO(paulirish): Centralize locale inheritance (combining this & i18n.lookupLocale()), adopt cldr parentLocale rules.

        /** @typedef {Record<string, {message: string}>} LhlMessages */

        const fs = require('fs');

        /** @type {Record<string, LhlMessages>} */
        const files = {
          'ar': JSON.parse(fs.readFileSync(`${__dirname}/locales/ar.json`, 'utf8')),
          'ar-XB': JSON.parse(fs.readFileSync(`${__dirname}/locales/ar-XB.json`, 'utf8')),
          'bg': JSON.parse(fs.readFileSync(`${__dirname}/locales/bg.json`, 'utf8')),
          'ca': JSON.parse(fs.readFileSync(`${__dirname}/locales/ca.json`, 'utf8')),
          'cs': JSON.parse(fs.readFileSync(`${__dirname}/locales/cs.json`, 'utf8')),
          'da': JSON.parse(fs.readFileSync(`${__dirname}/locales/da.json`, 'utf8')),
          'de': JSON.parse(fs.readFileSync(`${__dirname}/locales/de.json`, 'utf8')),
          'el': JSON.parse(fs.readFileSync(`${__dirname}/locales/el.json`, 'utf8')),
          'en-GB': JSON.parse(fs.readFileSync(`${__dirname}/locales/en-GB.json`, 'utf8')),
          'en-US': JSON.parse(fs.readFileSync(`${__dirname}/locales/en-US.json`, 'utf8')),
          'en-XA': JSON.parse(fs.readFileSync(`${__dirname}/locales/en-XA.json`, 'utf8')),
          'en-XL': JSON.parse(fs.readFileSync(`${__dirname}/locales/en-XL.json`, 'utf8')),
          'es': JSON.parse(fs.readFileSync(`${__dirname}/locales/es.json`, 'utf8')),
          'es-419': JSON.parse(fs.readFileSync(`${__dirname}/locales/es-419.json`, 'utf8')),
          'fi': JSON.parse(fs.readFileSync(`${__dirname}/locales/fi.json`, 'utf8')),
          'fil': JSON.parse(fs.readFileSync(`${__dirname}/locales/fil.json`, 'utf8')),
          'fr': JSON.parse(fs.readFileSync(`${__dirname}/locales/fr.json`, 'utf8')),
          'he': JSON.parse(fs.readFileSync(`${__dirname}/locales/he.json`, 'utf8')),
          'hi': JSON.parse(fs.readFileSync(`${__dirname}/locales/hi.json`, 'utf8')),
          'hr': JSON.parse(fs.readFileSync(`${__dirname}/locales/hr.json`, 'utf8')),
          'hu': JSON.parse(fs.readFileSync(`${__dirname}/locales/hu.json`, 'utf8')),
          'id': JSON.parse(fs.readFileSync(`${__dirname}/locales/id.json`, 'utf8')),
          'it': JSON.parse(fs.readFileSync(`${__dirname}/locales/it.json`, 'utf8')),
          'ja': JSON.parse(fs.readFileSync(`${__dirname}/locales/ja.json`, 'utf8')),
          'ko': JSON.parse(fs.readFileSync(`${__dirname}/locales/ko.json`, 'utf8')),
          'lt': JSON.parse(fs.readFileSync(`${__dirname}/locales/lt.json`, 'utf8')),
          'lv': JSON.parse(fs.readFileSync(`${__dirname}/locales/lv.json`, 'utf8')),
          'nl': JSON.parse(fs.readFileSync(`${__dirname}/locales/nl.json`, 'utf8')),
          'no': JSON.parse(fs.readFileSync(`${__dirname}/locales/no.json`, 'utf8')),
          'pl': JSON.parse(fs.readFileSync(`${__dirname}/locales/pl.json`, 'utf8')),
          'pt': JSON.parse(fs.readFileSync(`${__dirname}/locales/pt.json`, 'utf8')),
          'pt-PT': JSON.parse(fs.readFileSync(`${__dirname}/locales/pt-PT.json`, 'utf8')),
          'ro': JSON.parse(fs.readFileSync(`${__dirname}/locales/ro.json`, 'utf8')),
          'ru': JSON.parse(fs.readFileSync(`${__dirname}/locales/ru.json`, 'utf8')),
          'sk': JSON.parse(fs.readFileSync(`${__dirname}/locales/sk.json`, 'utf8')),
          'sl': JSON.parse(fs.readFileSync(`${__dirname}/locales/sl.json`, 'utf8')),
          'sr': JSON.parse(fs.readFileSync(`${__dirname}/locales/sr.json`, 'utf8')),
          'sr-Latn': JSON.parse(fs.readFileSync(`${__dirname}/locales/sr-Latn.json`, 'utf8')),
          'sv': JSON.parse(fs.readFileSync(`${__dirname}/locales/sv.json`, 'utf8')),
          'ta': JSON.parse(fs.readFileSync(`${__dirname}/locales/ta.json`, 'utf8')),
          'te': JSON.parse(fs.readFileSync(`${__dirname}/locales/te.json`, 'utf8')),
          'th': JSON.parse(fs.readFileSync(`${__dirname}/locales/th.json`, 'utf8')),
          'tr': JSON.parse(fs.readFileSync(`${__dirname}/locales/tr.json`, 'utf8')),
          'uk': JSON.parse(fs.readFileSync(`${__dirname}/locales/uk.json`, 'utf8')),
          'vi': JSON.parse(fs.readFileSync(`${__dirname}/locales/vi.json`, 'utf8')),
          'zh': JSON.parse(fs.readFileSync(`${__dirname}/locales/zh.json`, 'utf8')),
          'zh-HK': JSON.parse(fs.readFileSync(`${__dirname}/locales/zh-HK.json`, 'utf8')),
          'zh-TW': JSON.parse(fs.readFileSync(`${__dirname}/locales/zh-TW.json`, 'utf8')),
        };

        // The keys within this const must exactly match the LH.Locale type in externs.d.ts
        /** @type {Record<LH.Locale, LhlMessages>} */
        const locales = {
          'en-US': files['en-US'], // The 'source' strings, with descriptions
          'en': files['en-US'], // According to CLDR/ICU, 'en' == 'en-US' dates/numbers (Why?!)

          // TODO: en-GB has just ~10 messages that are different from en-US. We should only ship those.
          'en-AU': files['en-GB'], // Alias of 'en-GB'
          'en-GB': files['en-GB'], // Alias of 'en-GB'
          'en-IE': files['en-GB'], // Alias of 'en-GB'
          'en-SG': files['en-GB'], // Alias of 'en-GB'
          'en-ZA': files['en-GB'], // Alias of 'en-GB'
          'en-IN': files['en-GB'], // Alias of 'en-GB'

          // All locales from here have a messages file, though we allow fallback to the base locale when the files are identical
          'ar-XB': files['ar-XB'], // psuedolocalization
          'ar': files['ar'],
          'bg': files['bg'],
          'ca': files['ca'],
          'cs': files['cs'],
          'da': files['da'],
          'de': files['de'], // de-AT, de-CH identical, so they fall back into de
          'el': files['el'],
          'en-XA': files['en-XA'], // psuedolocalization
          'en-XL': files['en-XL'], // local psuedolocalization
          'es': files['es'],
          'es-419': files['es-419'],
          // Aliases of es-419: https://raw.githubusercontent.com/unicode-cldr/cldr-core/master/supplemental/parentLocales.json
          'es-AR': files['es-419'],
          'es-BO': files['es-419'],
          'es-BR': files['es-419'],
          'es-BZ': files['es-419'],
          'es-CL': files['es-419'],
          'es-CO': files['es-419'],
          'es-CR': files['es-419'],
          'es-CU': files['es-419'],
          'es-DO': files['es-419'],
          'es-EC': files['es-419'],
          'es-GT': files['es-419'],
          'es-HN': files['es-419'],
          'es-MX': files['es-419'],
          'es-NI': files['es-419'],
          'es-PA': files['es-419'],
          'es-PE': files['es-419'],
          'es-PR': files['es-419'],
          'es-PY': files['es-419'],
          'es-SV': files['es-419'],
          'es-US': files['es-419'],
          'es-UY': files['es-419'],
          'es-VE': files['es-419'],

          'fi': files['fi'],
          'fil': files['fil'],
          'fr': files['fr'], // fr-CH identical, so it falls back into fr
          'he': files['he'],
          'hi': files['hi'],
          'hr': files['hr'],
          'hu': files['hu'],
          'gsw': files['de'], // swiss german. identical (for our purposes) to 'de'
          'id': files['id'],
          'in': files['id'], // Alias of 'id'
          'it': files['it'],
          'iw': files['he'], // Alias of 'he'
          'ja': files['ja'],
          'ko': files['ko'],
          'lt': files['lt'],
          'lv': files['lv'],
          'mo': files['ro'], // Alias of 'ro'
          'nl': files['nl'],
          'nb': files['no'], // Alias of 'no'
          'no': files['no'],
          'pl': files['pl'],
          'pt': files['pt'], // pt-BR identical, so it falls back into pt
          'pt-PT': files['pt-PT'],
          'ro': files['ro'],
          'ru': files['ru'],
          'sk': files['sk'],
          'sl': files['sl'],
          'sr': files['sr'],
          'sr-Latn': files['sr-Latn'],
          'sv': files['sv'],
          'ta': files['ta'],
          'te': files['te'],
          'th': files['th'],
          'tl': files['fil'], // Alias of 'fil'
          'tr': files['tr'],
          'uk': files['uk'],
          'vi': files['vi'],
          'zh': files['zh'], // aka ZH-Hans, sometimes seen as zh-CN, zh-Hans-CN, Simplified Chinese
          'zh-HK': files['zh-HK'], // aka zh-Hant-HK. Note: yue-Hant-HK is not supported.
          'zh-TW': files['zh-TW'], // aka zh-Hant, zh-Hant-TW, Traditional Chinese
        };

        module.exports = locales;
      }).call(this);
    }).call(this, '/lighthouse-core/lib/i18n');
  }, {'fs': 6}], 4: [function(require, module, exports) {
    /**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
    'use strict';

    const _set = require('lodash.set');
    const _get = require('lodash.get');

    const i18n = require('./i18n.js');

    /**
 * @fileoverview Use the lhr.i18n.icuMessagePaths object to change locales.
 *
 * `icuMessagePaths` is an object keyed by `LH.IcuMessage['i18nId']`s. Within each is either
 * 1) an array of strings, which are just object paths to where that message is used in the LHR
 * 2) an array of `LH.IcuMessagePath`s which include both a `path` and a `values` object
 *    which will be used in the replacement within `i18n.getFormatted()`
 *
 * An example:
    "icuMessagePaths": {
    "lighthouse-core/audits/metrics/first-contentful-paint.js | title": [
      "audits[first-contentful-paint].title"
    ],
    "lighthouse-core/audits/server-response-time.js | displayValue": [
      {
        "values": {
          "timeInMs": 570.5630000000001
        },
        "path": "audits[server-response-time].displayValue"
      }
    ],
    "lighthouse-core/lib/i18n/i18n.js | columnTimeSpent": [
      "audits[mainthread-work-breakdown].details.headings[1].text",
      "audits[network-rtt].details.headings[1].text",
      "audits[network-server-latency].details.headings[1].text"
    ],
    ...
 */

    /**
 * Returns a new LHR with all strings changed to the new `requestedLocale`.
 * @param {LH.Result} lhr
 * @param {LH.Locale} requestedLocale
 * @return {{lhr: LH.Result, missingIcuMessageIds: string[]}}
 */
    function swapLocale(lhr, requestedLocale) {
      // Copy LHR to avoid mutating provided LHR.
      lhr = JSON.parse(JSON.stringify(lhr));

      const locale = i18n.lookupLocale(requestedLocale);
      const originalLocale = lhr.configSettings.locale;
      const {icuMessagePaths} = lhr.i18n;
      const missingIcuMessageIds = [];

      if (!icuMessagePaths) throw new Error('missing icuMessagePaths');

      for (const [i18nId, icuMessagePath] of Object.entries(icuMessagePaths)) {
        for (const instance of icuMessagePath) {
          // The path that _formatPathAsString() generated.
          let path;
          let values;
          if (typeof instance === 'string') {
            path = instance;
          } else {
            path = instance.path;
            // `values` are the string template values to be used. eg. `values: {wastedBytes: 9028}`
            values = instance.values;
          }

          // If the path isn't valid or the value isn't a string, there's no point in trying to replace it.
          /** @type {unknown} */
          const originalString = _get(lhr, path);
          if (typeof originalString !== 'string') {
            continue;
          }

          const icuMessage = {
            i18nId,
            values,
            // The default value is the string already in place.
            formattedDefault: originalString,
          };
          // Get new formatted strings in revised locale.
          const relocalizedString = i18n.getFormatted(icuMessage, locale);

          // If we couldn't find a new replacement message, keep things as is.
          if (relocalizedString === originalString) {
            if (locale !== originalLocale) {
              // If the string remained the same while the locale changed, there may have been an issue.
              missingIcuMessageIds.push(i18nId);
            }
            continue;
          }

          // Write string back into the LHR.
          _set(lhr, path, relocalizedString);
        }
      }

      lhr.i18n.rendererFormattedStrings = i18n.getRendererFormattedStrings(locale);
      // Tweak the config locale
      lhr.configSettings.locale = locale;
      return {
        lhr,
        missingIcuMessageIds,
      };
    }

    module.exports = swapLocale;
  }, {'./i18n.js': 2, 'lodash.get': 18, 'lodash.set': 19}], 5: [function(require, module, exports) {
    /**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
    'use strict';

    /**
 * @fileoverview A collection of general type verification functions for dealing
 * with external data. If these grow in scope they could be auto-generated with
 * something like `io-ts`, but it's not worth the complexity yet.
 */

    /**
 * Type predicate verifying `val` is an object (excluding `Array` and `null`).
 * @param {unknown} val
 * @return {val is Record<string, unknown>}
 */
    function isObjectOfUnknownValues(val) {
      return typeof val === 'object' && val !== null && !Array.isArray(val);
    }

    /**
 * Type predicate verifying `val` is an object or an array.
 * @param {unknown} val
 * @return {val is Record<string, unknown>|Array<unknown>}
 */
    function isObjectOrArrayOfUnknownValues(val) {
      return typeof val === 'object' && val !== null;
    }

    module.exports = {
      isObjectOfUnknownValues,
      isObjectOrArrayOfUnknownValues,
    };
  }, {}], 6: [function(require, module, exports) {

  }, {}], 7: [function(require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    'use strict';

    const R = typeof Reflect === 'object' ? Reflect : null;
    const ReflectApply = R && typeof R.apply === 'function'
      ? R.apply
      : function ReflectApply(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      };

    let ReflectOwnKeys;
    if (R && typeof R.ownKeys === 'function') {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target);
      };
    }

    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }

    const NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
      return value !== value;
    };

    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    module.exports = EventEmitter;
    module.exports.once = once;

    // Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter;

    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    let defaultMaxListeners = 10;

    function checkListener(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }

    Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
        }
        defaultMaxListeners = arg;
      },
    });

    EventEmitter.init = function() {
      if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
        this._events = Object.create(null);
        this._eventsCount = 0;
      }

      this._maxListeners = this._maxListeners || undefined;
    };

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
      }
      this._maxListeners = n;
      return this;
    };

    function _getMaxListeners(that) {
      if (that._maxListeners === undefined) {
        return EventEmitter.defaultMaxListeners;
      }
      return that._maxListeners;
    }

    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };

    EventEmitter.prototype.emit = function emit(type) {
      const args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      let doError = (type === 'error');

      const events = this._events;
      if (events !== undefined) {
        doError = (doError && events.error === undefined);
      } else if (!doError) {
        return false;
      }

      // If there is no 'error' event listener then throw.
      if (doError) {
        let er;
        if (args.length > 0) {
          er = args[0];
        }
        if (er instanceof Error) {
          // Note: The comments on the `throw` lines are intentional, they show
          // up in Node's output if this results in an unhandled exception.
          throw er; // Unhandled 'error' event
        }
        // At least give some kind of context to the user
        const err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
        err.context = er;
        throw err; // Unhandled 'error' event
      }

      const handler = events[type];

      if (handler === undefined) {
        return false;
      }

      if (typeof handler === 'function') {
        ReflectApply(handler, this, args);
      } else {
        const len = handler.length;
        const listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i) {
          ReflectApply(listeners[i], this, args);
        }
      }

      return true;
    };

    function _addListener(target, type, listener, prepend) {
      let m;
      let events;
      let existing;

      checkListener(listener);

      events = target._events;
      if (events === undefined) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
      } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener !== undefined) {
          target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

          // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object
          events = target._events;
        }
        existing = events[type];
      }

      if (existing === undefined) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
          // If we've already got an array, just append.
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }

        // Check for listener leak
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          // No error code for this since it is a Warning
          // eslint-disable-next-line no-restricted-syntax
          const w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }

      return target;
    }

    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0) {
          return this.listener.call(this.target);
        }
        return this.listener.apply(this.target, arguments);
      }
    }

    function _onceWrap(target, type, listener) {
      const state = {fired: false, wrapFn: undefined, target: target, type: type, listener: listener};
      const wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }

    EventEmitter.prototype.once = function once(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };

    EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

    // Emits a 'removeListener' event if and only if the listener was removed.
    EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      let list; let events; let position; let i; let originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined) {
        return this;
      }

      list = events[type];
      if (list === undefined) {
        return this;
      }

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0) {
          this._events = Object.create(null);
        } else {
          delete events[type];
          if (events.removeListener) {
            this.emit('removeListener', type, list.listener || listener);
          }
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0) {
          return this;
        }

        if (position === 0) {
          list.shift();
        } else {
          spliceOne(list, position);
        }

        if (list.length === 1) {
          events[type] = list[0];
        }

        if (events.removeListener !== undefined) {
          this.emit('removeListener', type, originalListener || listener);
        }
      }

      return this;
    };

    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

    EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      let listeners; let events; let i;

      events = this._events;
      if (events === undefined) {
        return this;
      }

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0) {
            this._events = Object.create(null);
          } else {
            delete events[type];
          }
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        const keys = Object.keys(events);
        let key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

    function _listeners(target, type, unwrap) {
      const events = target._events;

      if (events === undefined) {
        return [];
      }

      const evlistener = events[type];
      if (evlistener === undefined) {
        return [];
      }

      if (typeof evlistener === 'function') {
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      }

      return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }

    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };

    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };

    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };

    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      const events = this._events;

      if (events !== undefined) {
        const evlistener = events[type];

        if (typeof evlistener === 'function') {
          return 1;
        } else if (evlistener !== undefined) {
          return evlistener.length;
        }
      }

      return 0;
    }

    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };

    function arrayClone(arr, n) {
      const copy = new Array(n);
      for (let i = 0; i < n; ++i) {
        copy[i] = arr[i];
      }
      return copy;
    }

    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++) {
        list[index] = list[index + 1];
      }
      list.pop();
    }

    function unwrapListeners(arr) {
      const ret = new Array(arr.length);
      for (let i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }

    function once(emitter, name) {
      return new Promise(function(resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }

        function resolver() {
          if (typeof emitter.removeListener === 'function') {
            emitter.removeListener('error', errorListener);
          }
          resolve([].slice.call(arguments));
        }

        eventTargetAgnosticAddListener(emitter, name, resolver, {once: true});
        if (name !== 'error') {
          addErrorHandlerIfEventEmitter(emitter, errorListener, {once: true});
        }
      });
    }

    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === 'function') {
        eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
      }
    }

    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === 'function') {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === 'function') {
        // EventTarget does not have `error` event semantics like Node
        // EventEmitters, we do not listen for `error` events here.
        emitter.addEventListener(name, function wrapListener(arg) {
          // IE does not have builtin `{ once: true }` support so we
          // have to do it manually.
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
  }, {}], 8: [function(require, module, exports) {
    'use strict';

    const parser = require('./lib/parser');

    module.exports = parser;
    module.exports['default'] = parser;
  }, {'./lib/parser': 9}], 9: [function(require, module, exports) {
    /*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

    'use strict';

    function peg$subclass(child, parent) {
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
    }

    function peg$SyntaxError(message, expected, found, location) {
      this.message = message;
      this.expected = expected;
      this.found = found;
      this.location = location;
      this.name = 'SyntaxError';

      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(this, peg$SyntaxError);
      }
    }

    peg$subclass(peg$SyntaxError, Error);

    peg$SyntaxError.buildMessage = function(expected, found) {
      const DESCRIBE_EXPECTATION_FNS = {
        'literal': function(expectation) {
          return '"' + literalEscape(expectation.text) + '"';
        },

        'class': function(expectation) {
          let escapedParts = '';
          let i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + '-' + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return '[' + (expectation.inverted ? '^' : '') + escapedParts + ']';
        },

        'any': function(expectation) {
          return 'any character';
        },

        'end': function(expectation) {
          return 'end of input';
        },

        'other': function(expectation) {
          return expectation.description;
        },
      };

      function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
      }

      function literalEscape(s) {
        return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g, function(ch) {
        return '\\x0' + hex(ch);
      })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
        return '\\x' + hex(ch);
      });
      }

      function classEscape(s) {
        return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g, '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g, function(ch) {
        return '\\x0' + hex(ch);
      })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
        return '\\x' + hex(ch);
      });
      }

      function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
      }

      function describeExpected(expected) {
        const descriptions = new Array(expected.length);
        let i; let j;

        for (i = 0; i < expected.length; i++) {
          descriptions[i] = describeExpectation(expected[i]);
        }

        descriptions.sort();

        if (descriptions.length > 0) {
          for (i = 1, j = 1; i < descriptions.length; i++) {
            if (descriptions[i - 1] !== descriptions[i]) {
              descriptions[j] = descriptions[i];
              j++;
            }
          }
          descriptions.length = j;
        }

        switch (descriptions.length) {
          case 1:
            return descriptions[0];

          case 2:
            return descriptions[0] + ' or ' + descriptions[1];

          default:
            return descriptions.slice(0, -1).join(', ')
          + ', or '
          + descriptions[descriptions.length - 1];
        }
      }

      function describeFound(found) {
        return found ? '"' + literalEscape(found) + '"' : 'end of input';
      }

      return 'Expected ' + describeExpected(expected) + ' but ' + describeFound(found) + ' found.';
    };

    function peg$parse(input, options) {
      options = options !== void 0 ? options : {};

      const peg$FAILED = {};

      const peg$startRuleFunctions = {start: peg$parsestart};
      let peg$startRuleFunction = peg$parsestart;

      const peg$c0 = function(elements) {
        return {
          type: 'messageFormatPattern',
          elements: elements,
          location: location(),
        };
      };
      const peg$c1 = function(chunks) {
        return chunks.reduce(function(all, chunk) {
          return all.concat(chunk);
        }, []).join('');
      };
      const peg$c2 = function(messageText) {
        return {
          type: 'messageTextElement',
          value: messageText,
          location: location(),
        };
      };
      const peg$c3 = function(chars) {
        return chars.join('');
      };
      const peg$c4 = '{';
      const peg$c5 = peg$literalExpectation('{', false);
      const peg$c6 = ',';
      const peg$c7 = peg$literalExpectation(',', false);
      const peg$c8 = '}';
      const peg$c9 = peg$literalExpectation('}', false);
      const peg$c10 = function(id, format) {
        return {
          type: 'argumentElement',
          id: id,
          format: format && format[2],
          location: location(),
        };
      };
      const peg$c11 = 'number';
      const peg$c12 = peg$literalExpectation('number', false);
      const peg$c13 = 'date';
      const peg$c14 = peg$literalExpectation('date', false);
      const peg$c15 = 'time';
      const peg$c16 = peg$literalExpectation('time', false);
      const peg$c17 = function(type, style) {
        return {
          type: type + 'Format',
          style: style && style[2],
          location: location(),
        };
      };
      const peg$c18 = 'plural';
      const peg$c19 = peg$literalExpectation('plural', false);
      const peg$c20 = function(pluralStyle) {
        return {
          type: pluralStyle.type,
          ordinal: false,
          offset: pluralStyle.offset || 0,
          options: pluralStyle.options,
          location: location(),
        };
      };
      const peg$c21 = 'selectordinal';
      const peg$c22 = peg$literalExpectation('selectordinal', false);
      const peg$c23 = function(pluralStyle) {
        return {
          type: pluralStyle.type,
          ordinal: true,
          offset: pluralStyle.offset || 0,
          options: pluralStyle.options,
          location: location(),
        };
      };
      const peg$c24 = 'select';
      const peg$c25 = peg$literalExpectation('select', false);
      const peg$c26 = function(options) {
        return {
          type: 'selectFormat',
          options: options,
          location: location(),
        };
      };
      const peg$c27 = '=';
      const peg$c28 = peg$literalExpectation('=', false);
      const peg$c29 = function(selector, pattern) {
        return {
          type: 'optionalFormatPattern',
          selector: selector,
          value: pattern,
          location: location(),
        };
      };
      const peg$c30 = 'offset:';
      const peg$c31 = peg$literalExpectation('offset:', false);
      const peg$c32 = function(number) {
        return number;
      };
      const peg$c33 = function(offset, options) {
        return {
          type: 'pluralFormat',
          offset: offset,
          options: options,
          location: location(),
        };
      };
      const peg$c34 = peg$otherExpectation('whitespace');
      const peg$c35 = /^[ \t\n\r]/;
      const peg$c36 = peg$classExpectation([' ', '\t', '\n', '\r'], false, false);
      const peg$c37 = peg$otherExpectation('optionalWhitespace');
      const peg$c38 = /^[0-9]/;
      const peg$c39 = peg$classExpectation([['0', '9']], false, false);
      const peg$c40 = /^[0-9a-f]/i;
      const peg$c41 = peg$classExpectation([['0', '9'], ['a', 'f']], false, true);
      const peg$c42 = '0';
      const peg$c43 = peg$literalExpectation('0', false);
      const peg$c44 = /^[1-9]/;
      const peg$c45 = peg$classExpectation([['1', '9']], false, false);
      const peg$c46 = function(digits) {
        return parseInt(digits, 10);
      };
      const peg$c47 = '\'';
      const peg$c48 = peg$literalExpectation('\'', false);
      const peg$c49 = /^[ \t\n\r,.+={}#]/;
      const peg$c50 = peg$classExpectation([' ', '\t', '\n', '\r', ',', '.', '+', '=', '{', '}', '#'], false, false);
      const peg$c51 = peg$anyExpectation();
      const peg$c52 = function(char) {
        return char;
      };
      const peg$c53 = function(sequence) {
        return sequence;
      };
      const peg$c54 = /^[^{}\\\0-\x1F\x7F \t\n\r]/;
      const peg$c55 = peg$classExpectation(['{', '}', '\\', ['\0', '\x1F'], '\x7F', ' ', '\t', '\n', '\r'], true, false);
      const peg$c56 = '\\\\';
      const peg$c57 = peg$literalExpectation('\\\\', false);
      const peg$c58 = function() {
        return '\\';
      };
      const peg$c59 = '\\#';
      const peg$c60 = peg$literalExpectation('\\#', false);
      const peg$c61 = function() {
        return '\\#';
      };
      const peg$c62 = '\\{';
      const peg$c63 = peg$literalExpectation('\\{', false);
      const peg$c64 = function() {
        return '\u007B';
      };
      const peg$c65 = '\\}';
      const peg$c66 = peg$literalExpectation('\\}', false);
      const peg$c67 = function() {
        return '\u007D';
      };
      const peg$c68 = '\\u';
      const peg$c69 = peg$literalExpectation('\\u', false);
      const peg$c70 = function(digits) {
        return String.fromCharCode(parseInt(digits, 16));
      };

      let peg$currPos = 0;
      let peg$savedPos = 0;
      const peg$posDetailsCache = [{line: 1, column: 1}];
      let peg$maxFailPos = 0;
      let peg$maxFailExpected = [];
      let peg$silentFails = 0;

      let peg$result;

      if ('startRule' in options) {
        if (!(options.startRule in peg$startRuleFunctions)) {
          throw new Error('Can\'t start parsing from rule "' + options.startRule + '".');
        }

        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
      }

      function text() {
        return input.substring(peg$savedPos, peg$currPos);
      }

      function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
      }

      function expected(description, location) {
        location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);

        throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
        );
      }

      function error(message, location) {
        location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);

        throw peg$buildSimpleError(message, location);
      }

      function peg$literalExpectation(text, ignoreCase) {
        return {type: 'literal', text: text, ignoreCase: ignoreCase};
      }

      function peg$classExpectation(parts, inverted, ignoreCase) {
        return {type: 'class', parts: parts, inverted: inverted, ignoreCase: ignoreCase};
      }

      function peg$anyExpectation() {
        return {type: 'any'};
      }

      function peg$endExpectation() {
        return {type: 'end'};
      }

      function peg$otherExpectation(description) {
        return {type: 'other', description: description};
      }

      function peg$computePosDetails(pos) {
        let details = peg$posDetailsCache[pos]; let p;

        if (details) {
          return details;
        } else {
          p = pos - 1;
          while (!peg$posDetailsCache[p]) {
            p--;
          }

          details = peg$posDetailsCache[p];
          details = {
            line: details.line,
            column: details.column,
          };

          while (p < pos) {
            if (input.charCodeAt(p) === 10) {
              details.line++;
              details.column = 1;
            } else {
              details.column++;
            }

            p++;
          }

          peg$posDetailsCache[pos] = details;
          return details;
        }
      }

      function peg$computeLocation(startPos, endPos) {
        const startPosDetails = peg$computePosDetails(startPos);
        const endPosDetails = peg$computePosDetails(endPos);

        return {
          start: {
            offset: startPos,
            line: startPosDetails.line,
            column: startPosDetails.column,
          },
          end: {
            offset: endPos,
            line: endPosDetails.line,
            column: endPosDetails.column,
          },
        };
      }

      function peg$fail(expected) {
        if (peg$currPos < peg$maxFailPos) {
          return;
        }

        if (peg$currPos > peg$maxFailPos) {
          peg$maxFailPos = peg$currPos;
          peg$maxFailExpected = [];
        }

        peg$maxFailExpected.push(expected);
      }

      function peg$buildSimpleError(message, location) {
        return new peg$SyntaxError(message, null, null, location);
      }

      function peg$buildStructuredError(expected, found, location) {
        return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
        );
      }

      function peg$parsestart() {
        let s0;

        s0 = peg$parsemessageFormatPattern();

        return s0;
      }

      function peg$parsemessageFormatPattern() {
        let s0; let s1; let s2;

        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsemessageFormatElement();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsemessageFormatElement();
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c0(s1);
        }
        s0 = s1;

        return s0;
      }

      function peg$parsemessageFormatElement() {
        let s0;

        s0 = peg$parsemessageTextElement();
        if (s0 === peg$FAILED) {
          s0 = peg$parseargumentElement();
        }

        return s0;
      }

      function peg$parsemessageText() {
        let s0; let s1; let s2; let s3; let s4; let s5;

        s0 = peg$currPos;
        s1 = [];
        s2 = peg$currPos;
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsechars();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s3 = [s3, s4, s5];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$currPos;
            s3 = peg$parse_();
            if (s3 !== peg$FAILED) {
              s4 = peg$parsechars();
              if (s4 !== peg$FAILED) {
                s5 = peg$parse_();
                if (s5 !== peg$FAILED) {
                  s3 = [s3, s4, s5];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c1(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsews();
          if (s1 !== peg$FAILED) {
            s0 = input.substring(s0, peg$currPos);
          } else {
            s0 = s1;
          }
        }

        return s0;
      }

      function peg$parsemessageTextElement() {
        let s0; let s1;

        s0 = peg$currPos;
        s1 = peg$parsemessageText();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c2(s1);
        }
        s0 = s1;

        return s0;
      }

      function peg$parseargument() {
        let s0; let s1; let s2;

        s0 = peg$parsenumber();
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parsequoteEscapedChar();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsequoteEscapedChar();
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c3(s1);
          }
          s0 = s1;
        }

        return s0;
      }

      function peg$parseargumentElement() {
        let s0; let s1; let s2; let s3; let s4; let s5; let s6; let s7; let s8;

        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 123) {
          s1 = peg$c4;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c5);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseargument();
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                s5 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 44) {
                  s6 = peg$c6;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c7);
                  }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseelementFormat();
                    if (s8 !== peg$FAILED) {
                      s6 = [s6, s7, s8];
                      s5 = s6;
                    } else {
                      peg$currPos = s5;
                      s5 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
                if (s5 === peg$FAILED) {
                  s5 = null;
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s7 = peg$c8;
                      peg$currPos++;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c9);
                      }
                    }
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c10(s3, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parseelementFormat() {
        let s0;

        s0 = peg$parsesimpleFormat();
        if (s0 === peg$FAILED) {
          s0 = peg$parsepluralFormat();
          if (s0 === peg$FAILED) {
            s0 = peg$parseselectOrdinalFormat();
            if (s0 === peg$FAILED) {
              s0 = peg$parseselectFormat();
            }
          }
        }

        return s0;
      }

      function peg$parsesimpleFormat() {
        let s0; let s1; let s2; let s3; let s4; let s5; let s6;

        s0 = peg$currPos;
        if (input.substr(peg$currPos, 6) === peg$c11) {
          s1 = peg$c11;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c12);
          }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c13) {
            s1 = peg$c13;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c14);
            }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c15) {
              s1 = peg$c15;
              peg$currPos += 4;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c16);
              }
            }
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 44) {
              s4 = peg$c6;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c7);
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsechars();
                if (s6 !== peg$FAILED) {
                  s4 = [s4, s5, s6];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c17(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsepluralFormat() {
        let s0; let s1; let s2; let s3; let s4; let s5;

        s0 = peg$currPos;
        if (input.substr(peg$currPos, 6) === peg$c18) {
          s1 = peg$c18;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c19);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s3 = peg$c6;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c7);
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                s5 = peg$parsepluralStyle();
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c20(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parseselectOrdinalFormat() {
        let s0; let s1; let s2; let s3; let s4; let s5;

        s0 = peg$currPos;
        if (input.substr(peg$currPos, 13) === peg$c21) {
          s1 = peg$c21;
          peg$currPos += 13;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c22);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s3 = peg$c6;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c7);
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                s5 = peg$parsepluralStyle();
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c23(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parseselectFormat() {
        let s0; let s1; let s2; let s3; let s4; let s5; let s6;

        s0 = peg$currPos;
        if (input.substr(peg$currPos, 6) === peg$c24) {
          s1 = peg$c24;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c25);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s3 = peg$c6;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c7);
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseoptionalFormatPattern();
                if (s6 !== peg$FAILED) {
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$parseoptionalFormatPattern();
                  }
                } else {
                  s5 = peg$FAILED;
                }
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c26(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parseselector() {
        let s0; let s1; let s2; let s3;

        s0 = peg$currPos;
        s1 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c27;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c28);
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsenumber();
          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parsechars();
        }

        return s0;
      }

      function peg$parseoptionalFormatPattern() {
        let s0; let s1; let s2; let s3; let s4; let s5; let s6;

        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseselector();
          if (s2 !== peg$FAILED) {
            s3 = peg$parse_();
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 123) {
                s4 = peg$c4;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c5);
                }
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsemessageFormatPattern();
                if (s5 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 125) {
                    s6 = peg$c8;
                    peg$currPos++;
                  } else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c9);
                    }
                  }
                  if (s6 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c29(s2, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parseoffset() {
        let s0; let s1; let s2; let s3;

        s0 = peg$currPos;
        if (input.substr(peg$currPos, 7) === peg$c30) {
          s1 = peg$c30;
          peg$currPos += 7;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c31);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            s3 = peg$parsenumber();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c32(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsepluralStyle() {
        let s0; let s1; let s2; let s3; let s4;

        s0 = peg$currPos;
        s1 = peg$parseoffset();
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseoptionalFormatPattern();
            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parseoptionalFormatPattern();
              }
            } else {
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c33(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsews() {
        let s0; let s1;

        peg$silentFails++;
        s0 = [];
        if (peg$c35.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c36);
          }
        }
        if (s1 !== peg$FAILED) {
          while (s1 !== peg$FAILED) {
            s0.push(s1);
            if (peg$c35.test(input.charAt(peg$currPos))) {
              s1 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c36);
              }
            }
          }
        } else {
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c34);
          }
        }

        return s0;
      }

      function peg$parse_() {
        let s0; let s1; let s2;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsews();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsews();
        }
        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c37);
          }
        }

        return s0;
      }

      function peg$parsedigit() {
        let s0;

        if (peg$c38.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c39);
          }
        }

        return s0;
      }

      function peg$parsehexDigit() {
        let s0;

        if (peg$c40.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c41);
          }
        }

        return s0;
      }

      function peg$parsenumber() {
        let s0; let s1; let s2; let s3; let s4; let s5;

        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 48) {
          s1 = peg$c42;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c43);
          }
        }
        if (s1 === peg$FAILED) {
          s1 = peg$currPos;
          s2 = peg$currPos;
          if (peg$c44.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c45);
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parsedigit();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parsedigit();
            }
            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s1 = input.substring(s1, peg$currPos);
          } else {
            s1 = s2;
          }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c46(s1);
        }
        s0 = s1;

        return s0;
      }

      function peg$parsequoteEscapedChar() {
        let s0; let s1; let s2;

        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 39) {
          s2 = peg$c47;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c48);
          }
        }
        if (s2 === peg$FAILED) {
          if (peg$c49.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c50);
            }
          }
        }
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c51);
            }
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c52(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 39) {
            s1 = peg$c47;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c48);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseescape();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c53(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }

        return s0;
      }

      function peg$parseapostrophe() {
        let s0;

        if (input.charCodeAt(peg$currPos) === 39) {
          s0 = peg$c47;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c48);
          }
        }

        return s0;
      }

      function peg$parseescape() {
        let s0;

        if (peg$c49.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c50);
          }
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseapostrophe();
        }

        return s0;
      }

      function peg$parsechar() {
        let s0; let s1; let s2; let s3; let s4; let s5; let s6; let s7;

        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 39) {
          s1 = peg$c47;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c48);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseapostrophe();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c53(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          if (peg$c54.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c55);
            }
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c56) {
              s1 = peg$c56;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c57);
              }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c58();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c59) {
                s1 = peg$c59;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c60);
                }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c61();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c62) {
                  s1 = peg$c62;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c63);
                  }
                }
                if (s1 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c64();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.substr(peg$currPos, 2) === peg$c65) {
                    s1 = peg$c65;
                    peg$currPos += 2;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c66);
                    }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c67();
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c68) {
                      s1 = peg$c68;
                      peg$currPos += 2;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c69);
                      }
                    }
                    if (s1 !== peg$FAILED) {
                      s2 = peg$currPos;
                      s3 = peg$currPos;
                      s4 = peg$parsehexDigit();
                      if (s4 !== peg$FAILED) {
                        s5 = peg$parsehexDigit();
                        if (s5 !== peg$FAILED) {
                          s6 = peg$parsehexDigit();
                          if (s6 !== peg$FAILED) {
                            s7 = peg$parsehexDigit();
                            if (s7 !== peg$FAILED) {
                              s4 = [s4, s5, s6, s7];
                              s3 = s4;
                            } else {
                              peg$currPos = s3;
                              s3 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s3;
                          s3 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                      if (s3 !== peg$FAILED) {
                        s2 = input.substring(s2, peg$currPos);
                      } else {
                        s2 = s3;
                      }
                      if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c70(s2);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  }
                }
              }
            }
          }
        }

        return s0;
      }

      function peg$parsechars() {
        let s0; let s1; let s2;

        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsechar();
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsechar();
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c3(s1);
        }
        s0 = s1;

        return s0;
      }

      peg$result = peg$startRuleFunction();

      if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
      } else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
          peg$fail(peg$endExpectation());
        }

        throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
        );
      }
    }

    module.exports = {
      SyntaxError: peg$SyntaxError,
      parse: peg$parse,
    };
  }, {}], 10: [function(require, module, exports) {
    'use strict';
    /*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/
    const __extends = (this && this.__extends) || (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({__proto__: []} instanceof Array && function(d, b) {
              d.__proto__ = b;
            }) ||
            function(d, b) {
              for (const p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, '__esModule', {value: true});
    const Compiler = /** @class */ (function() {
      function Compiler(locales, formats, formatters) {
        this.locales = [];
        this.formats = {
          number: {},
          date: {},
          time: {},
        };
        this.pluralNumberFormat = null;
        this.currentPlural = null;
        this.pluralStack = [];
        this.locales = locales;
        this.formats = formats;
        this.formatters = formatters;
      }
      Compiler.prototype.compile = function(ast) {
        this.pluralStack = [];
        this.currentPlural = null;
        this.pluralNumberFormat = null;
        return this.compileMessage(ast);
      };
      Compiler.prototype.compileMessage = function(ast) {
        const _this = this;
        if (!(ast && ast.type === 'messageFormatPattern')) {
          throw new Error('Message AST is not of type: "messageFormatPattern"');
        }
        const elements = ast.elements;
        const pattern = elements
            .filter(function(el) {
              return el.type === 'messageTextElement' || el.type === 'argumentElement';
            })
            .map(function(el) {
              return el.type === 'messageTextElement'
                ? _this.compileMessageText(el)
                : _this.compileArgument(el);
            });
        if (pattern.length !== elements.length) {
          throw new Error('Message element does not have a valid type');
        }
        return pattern;
      };
      Compiler.prototype.compileMessageText = function(element) {
      // When this `element` is part of plural sub-pattern and its value contains
      // an unescaped '#', use a `PluralOffsetString` helper to properly output
      // the number with the correct offset in the string.
        if (this.currentPlural && /(^|[^\\])#/g.test(element.value)) {
        // Create a cache a NumberFormat instance that can be reused for any
        // PluralOffsetString instance in this message.
          if (!this.pluralNumberFormat) {
            this.pluralNumberFormat = new Intl.NumberFormat(this.locales);
          }
          return new PluralOffsetString(this.currentPlural.id, this.currentPlural.format.offset, this.pluralNumberFormat, element.value);
        }
        // Unescape the escaped '#'s in the message text.
        return element.value.replace(/\\#/g, '#');
      };
      Compiler.prototype.compileArgument = function(element) {
        const format = element.format; const id = element.id;
        const formatters = this.formatters;
        if (!format) {
          return new StringFormat(id);
        }
        const _a = this; const formats = _a.formats; const locales = _a.locales;
        switch (format.type) {
          case 'numberFormat':
            return {
              id: id,
              format: formatters.getNumberFormat(locales, formats.number[format.style]).format,
            };
          case 'dateFormat':
            return {
              id: id,
              format: formatters.getDateTimeFormat(locales, formats.date[format.style]).format,
            };
          case 'timeFormat':
            return {
              id: id,
              format: formatters.getDateTimeFormat(locales, formats.time[format.style]).format,
            };
          case 'pluralFormat':
            return new PluralFormat(id, format.offset, this.compileOptions(element), formatters.getPluralRules(locales, {
              type: format.ordinal ? 'ordinal' : 'cardinal',
            }));
          case 'selectFormat':
            return new SelectFormat(id, this.compileOptions(element));
          default:
            throw new Error('Message element does not have a valid format type');
        }
      };
      Compiler.prototype.compileOptions = function(element) {
        const _this = this;
        const format = element.format;
        const options = format.options;
        // Save the current plural element, if any, then set it to a new value when
        // compiling the options sub-patterns. This conforms the spec's algorithm
        // for handling `"#"` syntax in message text.
        this.pluralStack.push(this.currentPlural);
        this.currentPlural = format.type === 'pluralFormat' ? element : null;
        const optionsHash = options.reduce(function(all, option) {
        // Compile the sub-pattern and save it under the options's selector.
          all[option.selector] = _this.compileMessage(option.value);
          return all;
        }, {});
        // Pop the plural stack to put back the original current plural value.
        this.currentPlural = this.pluralStack.pop();
        return optionsHash;
      };
      return Compiler;
    }());
    exports.default = Compiler;
    // -- Compiler Helper Classes --------------------------------------------------
    const Formatter = /** @class */ (function() {
      function Formatter(id) {
        this.id = id;
      }
      return Formatter;
    }());
    var StringFormat = /** @class */ (function(_super) {
      __extends(StringFormat, _super);
      function StringFormat() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      StringFormat.prototype.format = function(value) {
        if (!value && typeof value !== 'number') {
          return '';
        }
        return typeof value === 'string' ? value : String(value);
      };
      return StringFormat;
    }(Formatter));
    var PluralFormat = /** @class */ (function() {
      function PluralFormat(id, offset, options, pluralRules) {
        this.id = id;
        this.offset = offset;
        this.options = options;
        this.pluralRules = pluralRules;
      }
      PluralFormat.prototype.getOption = function(value) {
        const options = this.options;
        const option = options['=' + value] ||
            options[this.pluralRules.select(value - this.offset)];
        return option || options.other;
      };
      return PluralFormat;
    }());
    var PluralOffsetString = /** @class */ (function(_super) {
      __extends(PluralOffsetString, _super);
      function PluralOffsetString(id, offset, numberFormat, string) {
        const _this = _super.call(this, id) || this;
        _this.offset = offset;
        _this.numberFormat = numberFormat;
        _this.string = string;
        return _this;
      }
      PluralOffsetString.prototype.format = function(value) {
        const number = this.numberFormat.format(value - this.offset);
        return this.string
            .replace(/(^|[^\\])#/g, '$1' + number)
            .replace(/\\#/g, '#');
      };
      return PluralOffsetString;
    }(Formatter));
    exports.PluralOffsetString = PluralOffsetString;
    var SelectFormat = /** @class */ (function() {
      function SelectFormat(id, options) {
        this.id = id;
        this.options = options;
      }
      SelectFormat.prototype.getOption = function(value) {
        const options = this.options;
        return options[value] || options.other;
      };
      return SelectFormat;
    }());
    exports.SelectFormat = SelectFormat;
    function isSelectOrPluralFormat(f) {
      return !!f.options;
    }
    exports.isSelectOrPluralFormat = isSelectOrPluralFormat;
  }, {}], 11: [function(require, module, exports) {
    'use strict';
    /*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/
    const __extends = (this && this.__extends) || (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({__proto__: []} instanceof Array && function(d, b) {
              d.__proto__ = b;
            }) ||
            function(d, b) {
              for (const p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __assign = (this && this.__assign) || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (const p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) {
              t[p] = s[p];
            }
          }
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, '__esModule', {value: true});
    /* jslint esnext: true */
    const compiler_1 = require('./compiler');
    // -- MessageFormat --------------------------------------------------------
    function resolveLocale(locales) {
      if (typeof locales === 'string') {
        locales = [locales];
      }
      try {
        return Intl.NumberFormat.supportedLocalesOf(locales, {
        // IE11 localeMatcher `lookup` seems to convert `en` -> `en-US`
        // but not other browsers,
          localeMatcher: 'best fit',
        })[0];
      } catch (e) {
        return IntlMessageFormat.defaultLocale;
      }
    }
    function formatPatterns(pattern, values) {
      let result = '';
      for (let _i = 0, pattern_1 = pattern; _i < pattern_1.length; _i++) {
        const part = pattern_1[_i];
        // Exist early for string parts.
        if (typeof part === 'string') {
          result += part;
          continue;
        }
        const id = part.id;
        // Enforce that all required values are provided by the caller.
        if (!(values && id in values)) {
          throw new FormatError('A value must be provided for: ' + id, id);
        }
        const value = values[id];
        // Recursively format plural and select parts' option — which can be a
        // nested pattern structure. The choosing of the option to use is
        // abstracted-by and delegated-to the part helper object.
        if (compiler_1.isSelectOrPluralFormat(part)) {
          result += formatPatterns(part.getOption(value), values);
        } else {
          result += part.format(value);
        }
      }
      return result;
    }
    function mergeConfig(c1, c2) {
      if (!c2) {
        return c1;
      }
      return __assign({}, (c1 || {}), (c2 || {}), Object.keys(c1).reduce(function(all, k) {
        all[k] = __assign({}, c1[k], (c2[k] || {}));
        return all;
      }, {}));
    }
    function mergeConfigs(defaultConfig, configs) {
      if (!configs) {
        return defaultConfig;
      }
      return Object.keys(defaultConfig).reduce(function(all, k) {
        all[k] = mergeConfig(defaultConfig[k], configs[k]);
        return all;
      }, __assign({}, defaultConfig));
    }
    var FormatError = /** @class */ (function(_super) {
      __extends(FormatError, _super);
      function FormatError(msg, variableId) {
        const _this = _super.call(this, msg) || this;
        _this.variableId = variableId;
        return _this;
      }
      return FormatError;
    }(Error));
    function createDefaultFormatters() {
      return {
        getNumberFormat: function() {
          let _a;
          const args = [];
          for (let _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return new ((_a = Intl.NumberFormat).bind.apply(_a, [void 0].concat(args)))();
        },
        getDateTimeFormat: function() {
          let _a;
          const args = [];
          for (let _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return new ((_a = Intl.DateTimeFormat).bind.apply(_a, [void 0].concat(args)))();
        },
        getPluralRules: function() {
          let _a;
          const args = [];
          for (let _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return new ((_a = Intl.PluralRules).bind.apply(_a, [void 0].concat(args)))();
        },
      };
    }
    exports.createDefaultFormatters = createDefaultFormatters;
    var IntlMessageFormat = /** @class */ (function() {
      function IntlMessageFormat(message, locales, overrideFormats, opts) {
        const _this = this;
        if (locales === void 0) {
          locales = IntlMessageFormat.defaultLocale;
        }
        this.format = function(values) {
          try {
            return formatPatterns(_this.pattern, values);
          } catch (e) {
            if (e.variableId) {
              throw new Error('The intl string context variable \'' + e.variableId + '\' was not provided to the string \'' + _this.message + '\'');
            } else {
              throw e;
            }
          }
        };
        if (typeof message === 'string') {
          if (!IntlMessageFormat.__parse) {
            throw new TypeError('IntlMessageFormat.__parse must be set to process `message` of type `string`');
          }
          // Parse string messages into an AST.
          this.ast = IntlMessageFormat.__parse(message);
        } else {
          this.ast = message;
        }
        this.message = message;
        if (!(this.ast && this.ast.type === 'messageFormatPattern')) {
          throw new TypeError('A message must be provided as a String or AST.');
        }
        // Creates a new object with the specified `formats` merged with the default
        // formats.
        const formats = mergeConfigs(IntlMessageFormat.formats, overrideFormats);
        // Defined first because it's used to build the format pattern.
        this.locale = resolveLocale(locales || []);
        const formatters = (opts && opts.formatters) || createDefaultFormatters();
        // Compile the `ast` to a pattern that is highly optimized for repeated
        // `format()` invocations. **Note:** This passes the `locales` set provided
        // to the constructor instead of just the resolved locale.
        this.pattern = new compiler_1.default(locales, formats, formatters).compile(this.ast);
      // "Bind" `format()` method to `this` so it can be passed by reference like
      // the other `Intl` APIs.
      }
      IntlMessageFormat.prototype.resolvedOptions = function() {
        return {locale: this.locale};
      };
      IntlMessageFormat.prototype.getAst = function() {
        return this.ast;
      };
      IntlMessageFormat.defaultLocale = 'en';
      IntlMessageFormat.__parse = undefined;
      // Default format options used as the prototype of the `formats` provided to the
      // constructor. These are used when constructing the internal Intl.NumberFormat
      // and Intl.DateTimeFormat instances.
      IntlMessageFormat.formats = {
        number: {
          currency: {
            style: 'currency',
          },
          percent: {
            style: 'percent',
          },
        },
        date: {
          short: {
            month: 'numeric',
            day: 'numeric',
            year: '2-digit',
          },
          medium: {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          },
          long: {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          },
          full: {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          },
        },
        time: {
          short: {
            hour: 'numeric',
            minute: 'numeric',
          },
          medium: {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          },
          long: {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
          },
          full: {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
          },
        },
      };
      return IntlMessageFormat;
    }());
    exports.IntlMessageFormat = IntlMessageFormat;
    exports.default = IntlMessageFormat;
  }, {'./compiler': 10}], 12: [function(require, module, exports) {
    'use strict';
    /*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/
    function __export(m) {
      for (const p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, '__esModule', {value: true});
    const intl_messageformat_parser_1 = require('intl-messageformat-parser');
    const core_1 = require('./core');
    core_1.default.__parse = intl_messageformat_parser_1.default.parse;
    __export(require('./core'));
    exports.default = core_1.default;
  }, {'./core': 11, 'intl-messageformat-parser': 8}], 13: [function(require, module, exports) {
    'use strict';
    const IntlMessageFormat = require('./dist').default;

    // Re-export `IntlMessageFormat` as the CommonJS default exports with all the
    // locale data registered, and with English set as the default locale. Define
    // the `default` prop for use with other compiled ES6 Modules.
    exports = module.exports = IntlMessageFormat;
    exports['default'] = exports;
  }, {'./dist': 12}], 14: [function(require, module, exports) {
    (function(process) {
      (function() {
        /**
 * @license Copyright 2016 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
        'use strict';

        const debug = require('debug');
        const marky = require('marky');

        const EventEmitter = require('events').EventEmitter;
        const isWindows = process.platform === 'win32';

        // process.browser is set when browserify'd via the `process` npm module
        const isBrowser = process.browser;

        const colors = {
          red: isBrowser ? 'crimson' : 1,
          yellow: isBrowser ? 'gold' : 3,
          cyan: isBrowser ? 'darkturquoise' : 6,
          green: isBrowser ? 'forestgreen' : 2,
          blue: isBrowser ? 'steelblue' : 4,
          magenta: isBrowser ? 'palevioletred' : 5,
        };

        // allow non-red/yellow colors for debug()
        debug.colors = [colors.cyan, colors.green, colors.blue, colors.magenta];

        class Emitter extends EventEmitter {
          /**
   * Fires off all status updates. Listen with
   * `require('lib/log').events.addListener('status', callback)`
   * @param {string} title
   * @param {!Array<*>} argsArray
   */
          issueStatus(title, argsArray) {
            if (title === 'status' || title === 'statusEnd') {
              this.emit(title, [title, ...argsArray]);
            }
          }

          /**
   * Fires off all warnings. Listen with
   * `require('lib/log').events.addListener('warning', callback)`
   * @param {string} title
   * @param {!Array<*>} argsArray
   */
          issueWarning(title, argsArray) {
            this.emit('warning', [title, ...argsArray]);
          }
        }

        const loggersByTitle = {};
        const loggingBufferColumns = 25;
        let level_;

        class Log {
          static _logToStdErr(title, argsArray) {
            const log = Log.loggerfn(title);
            log(...argsArray);
          }

          static loggerfn(title) {
            title = `LH:${title}`;
            let log = loggersByTitle[title];
            if (!log) {
              log = debug(title);
              loggersByTitle[title] = log;
              // errors with red, warnings with yellow.
              if (title.endsWith('error')) {
                log.color = colors.red;
              } else if (title.endsWith('warn')) {
                log.color = colors.yellow;
              }
            }
            return log;
          }

          /**
   * @param {string} level
   */
          static setLevel(level) {
            level_ = level;
            switch (level) {
              case 'silent':
                debug.enable('-LH:*');
                break;
              case 'verbose':
                debug.enable('LH:*');
                break;
              case 'error':
                debug.enable('-LH:*, LH:*:error');
                break;
              default:
                debug.enable('LH:*, -LH:*:verbose');
            }
          }

          /**
   * A simple formatting utility for event logging.
   * @param {string} prefix
   * @param {!Object} data A JSON-serializable object of event data to log.
   * @param {string=} level Optional logging level. Defaults to 'log'.
   */
          static formatProtocol(prefix, data, level) {
            const columns = (!process || process.browser) ? Infinity : process.stdout.columns;
            const method = data.method || '?????';
            const maxLength = columns - method.length - prefix.length - loggingBufferColumns;
            // IO.read ignored here to avoid logging megabytes of trace data
            const snippet = (data.params && method !== 'IO.read') ?
      JSON.stringify(data.params).substr(0, maxLength) : '';
            Log._logToStdErr(`${prefix}:${level || ''}`, [method, snippet]);
          }

          /**
   * @return {boolean}
   */
          static isVerbose() {
            return level_ === 'verbose';
          }

          static time({msg, id, args = []}, level = 'log') {
            marky.mark(id);
            Log[level]('status', msg, ...args);
          }

          static timeEnd({msg, id, args = []}, level = 'verbose') {
            Log[level]('statusEnd', msg, ...args);
            marky.stop(id);
          }

          static log(title, ...args) {
            Log.events.issueStatus(title, args);
            return Log._logToStdErr(title, args);
          }

          static warn(title, ...args) {
            Log.events.issueWarning(title, args);
            return Log._logToStdErr(`${title}:warn`, args);
          }

          static error(title, ...args) {
            return Log._logToStdErr(`${title}:error`, args);
          }

          static verbose(title, ...args) {
            Log.events.issueStatus(title, args);
            return Log._logToStdErr(`${title}:verbose`, args);
          }

          /**
   * Add surrounding escape sequences to turn a string green when logged.
   * @param {string} str
   * @return {string}
   */
          static greenify(str) {
            return `${Log.green}${str}${Log.reset}`;
          }

          /**
   * Add surrounding escape sequences to turn a string red when logged.
   * @param {string} str
   * @return {string}
   */
          static redify(str) {
            return `${Log.red}${str}${Log.reset}`;
          }

          static get green() {
            return '\x1B[32m';
          }

          static get red() {
            return '\x1B[31m';
          }

          static get yellow() {
            return '\x1b[33m';
          }

          static get purple() {
            return '\x1b[95m';
          }

          static get reset() {
            return '\x1B[0m';
          }

          static get bold() {
            return '\x1b[1m';
          }

          static get dim() {
            return '\x1b[2m';
          }

          static get tick() {
            return isWindows ? '\u221A' : '✓';
          }

          static get cross() {
            return isWindows ? '\u00D7' : '✘';
          }

          static get whiteSmallSquare() {
            return isWindows ? '\u0387' : '▫';
          }

          static get heavyHorizontal() {
            return isWindows ? '\u2500' : '━';
          }

          static get heavyVertical() {
            return isWindows ? '\u2502 ' : '┃ ';
          }

          static get heavyUpAndRight() {
            return isWindows ? '\u2514' : '┗';
          }

          static get heavyVerticalAndRight() {
            return isWindows ? '\u251C' : '┣';
          }

          static get heavyDownAndHorizontal() {
            return isWindows ? '\u252C' : '┳';
          }

          static get doubleLightHorizontal() {
            return '──';
          }
        }

        Log.events = new Emitter();
        Log.takeTimeEntries = () => {
          const entries = marky.getEntries();
          marky.clear();
          return entries;
        };
        Log.getTimeEntries = () => marky.getEntries();

        module.exports = Log;
      }).call(this);
    }).call(this, require('_process'));
  }, {'_process': 23, 'debug': 15, 'events': 7, 'marky': 21}], 15: [function(require, module, exports) {
    (function(process) {
      (function() {
        /**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

        exports = module.exports = require('./debug');
        exports.log = log;
        exports.formatArgs = formatArgs;
        exports.save = save;
        exports.load = load;
        exports.useColors = useColors;
        exports.storage = 'undefined' !== typeof chrome
               && 'undefined' !== typeof chrome.storage
          ? chrome.storage.local
          : localstorage();

        /**
 * Colors.
 */

        exports.colors = [
          'lightseagreen',
          'forestgreen',
          'goldenrod',
          'dodgerblue',
          'darkorchid',
          'crimson',
        ];

        /**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

        function useColors() {
          // NB: In an Electron preload script, document will be defined but not fully
          // initialized. Since we know we're in Chrome, we'll just detect this case
          // explicitly
          if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
            return true;
          }

          // is webkit? http://stackoverflow.com/a/16459606/376773
          // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
          return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
        }

        /**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

        exports.formatters.j = function(v) {
          try {
            return JSON.stringify(v);
          } catch (err) {
            return '[UnexpectedJSONParseError]: ' + err.message;
          }
        };


        /**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

        function formatArgs(args) {
          const useColors = this.useColors;

          args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

          if (!useColors) return;

          const c = 'color: ' + this.color;
          args.splice(1, 0, c, 'color: inherit');

          // the final "%c" is somewhat tricky, because there could be other
          // arguments passed either before or after the %c, so we need to
          // figure out the correct index to insert the CSS into
          let index = 0;
          let lastC = 0;
          args[0].replace(/%[a-zA-Z%]/g, function(match) {
            if ('%%' === match) return;
            index++;
            if ('%c' === match) {
              // we only are interested in the *last* %c
              // (the user may have provided their own)
              lastC = index;
            }
          });

          args.splice(lastC, 0, c);
        }

        /**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

        function log() {
          // this hackery is required for IE8/9, where
          // the `console.log` function doesn't have 'apply'
          return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
        }

        /**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

        function save(namespaces) {
          try {
            if (null == namespaces) {
              exports.storage.removeItem('debug');
            } else {
              exports.storage.debug = namespaces;
            }
          } catch (e) {}
        }

        /**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

        function load() {
          let r;
          try {
            r = exports.storage.debug;
          } catch (e) {}

          // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
          if (!r && typeof process !== 'undefined' && 'env' in process) {
            r = process.env.DEBUG;
          }

          return r;
        }

        /**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

        exports.enable(load());

        /**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

        function localstorage() {
          try {
            return window.localStorage;
          } catch (e) {}
        }
      }).call(this);
    }).call(this, require('_process'));
  }, {'./debug': 16, '_process': 23}], 16: [function(require, module, exports) {
    /**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

    exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require('ms');

    /**
 * The currently active debug mode names, and names to skip.
 */

    exports.names = [];
    exports.skips = [];

    /**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

    exports.formatters = {};

    /**
 * Previous log timestamp.
 */

    let prevTime;

    /**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

    function selectColor(namespace) {
      let hash = 0; let i;

      for (i in namespace) {
        hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }

      return exports.colors[Math.abs(hash) % exports.colors.length];
    }

    /**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

    function createDebug(namespace) {
      function debug() {
        // disabled?
        if (!debug.enabled) return;

        const self = debug;

        // set `diff` timestamp
        const curr = Number(new Date());
        const ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;

        // turn the `arguments` into a proper Array
        const args = new Array(arguments.length);
        for (let i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }

        args[0] = exports.coerce(args[0]);

        if ('string' !== typeof args[0]) {
          // anything else let's inspect with %O
          args.unshift('%O');
        }

        // apply any `formatters` transformations
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          // if we encounter an escaped % then don't increase the array index
          if (match === '%%') return match;
          index++;
          const formatter = exports.formatters[format];
          if ('function' === typeof formatter) {
            const val = args[index];
            match = formatter.call(self, val);

            // now we need to remove `args[index]` since it's inlined in the `format`
            args.splice(index, 1);
            index--;
          }
          return match;
        });

        // apply env-specific formatting (colors, etc.)
        exports.formatArgs.call(self, args);

        const logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }

      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);

      // env-specific initialization logic for debug instances
      if ('function' === typeof exports.init) {
        exports.init(debug);
      }

      return debug;
    }

    /**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

    function enable(namespaces) {
      exports.save(namespaces);

      exports.names = [];
      exports.skips = [];

      const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
      const len = split.length;

      for (let i = 0; i < len; i++) {
        if (!split[i]) continue; // ignore empty strings
        namespaces = split[i].replace(/\*/g, '.*?');
        if (namespaces[0] === '-') {
          exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          exports.names.push(new RegExp('^' + namespaces + '$'));
        }
      }
    }

    /**
 * Disable debug output.
 *
 * @api public
 */

    function disable() {
      exports.enable('');
    }

    /**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

    function enabled(name) {
      let i; let len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }

    /**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
  }, {'ms': 17}], 17: [function(require, module, exports) {
    /**
 * Helpers.
 */

    const s = 1000;
    const m = s * 60;
    const h = m * 60;
    const d = h * 24;
    const y = d * 365.25;

    /**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

    module.exports = function(val, options) {
      options = options || {};
      const type = typeof val;
      if (type === 'string' && val.length > 0) {
        return parse(val);
      } else if (type === 'number' && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
      );
    };

    /**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      const match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
      );
      if (!match) {
        return;
      }
      const n = parseFloat(match[1]);
      const type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'days':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return undefined;
      }
    }

    /**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

    function fmtShort(ms) {
      if (ms >= d) {
        return Math.round(ms / d) + 'd';
      }
      if (ms >= h) {
        return Math.round(ms / h) + 'h';
      }
      if (ms >= m) {
        return Math.round(ms / m) + 'm';
      }
      if (ms >= s) {
        return Math.round(ms / s) + 's';
      }
      return ms + 'ms';
    }

    /**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

    function fmtLong(ms) {
      return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
    }

    /**
 * Pluralization helper.
 */

    function plural(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + ' ' + name;
      }
      return Math.ceil(ms / n) + ' ' + name + 's';
    }
  }, {}], 18: [function(require, module, exports) {
    (function(global) {
      (function() {
        /**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

        /** Used as the `TypeError` message for "Functions" methods. */
        const FUNC_ERROR_TEXT = 'Expected a function';

        /** Used to stand-in for `undefined` hash values. */
        const HASH_UNDEFINED = '__lodash_hash_undefined__';

        /** Used as references for various `Number` constants. */
        const INFINITY = 1 / 0;

        /** `Object#toString` result references. */
        const funcTag = '[object Function]';
        const genTag = '[object GeneratorFunction]';
        const symbolTag = '[object Symbol]';

        /** Used to match property names within property paths. */
        const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
        const reIsPlainProp = /^\w*$/;
        const reLeadingDot = /^\./;
        const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

        /**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
        const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

        /** Used to match backslashes in property paths. */
        const reEscapeChar = /\\(\\)?/g;

        /** Used to detect host constructors (Safari). */
        const reIsHostCtor = /^\[object .+?Constructor\]$/;

        /** Detect free variable `global` from Node.js. */
        const freeGlobal = typeof global === 'object' && global && global.Object === Object && global;

        /** Detect free variable `self`. */
        const freeSelf = typeof self === 'object' && self && self.Object === Object && self;

        /** Used as a reference to the global object. */
        const root = freeGlobal || freeSelf || Function('return this')();

        /**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
        function getValue(object, key) {
          return object == null ? undefined : object[key];
        }

        /**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
        function isHostObject(value) {
          // Many host objects are `Object` objects that can coerce to strings
          // despite having improperly defined `toString` methods.
          let result = false;
          if (value != null && typeof value.toString !== 'function') {
            try {
              result = !!(String(value));
            } catch (e) {}
          }
          return result;
        }

        /** Used for built-in method references. */
        const arrayProto = Array.prototype;
        const funcProto = Function.prototype;
        const objectProto = Object.prototype;

        /** Used to detect overreaching core-js shims. */
        const coreJsData = root['__core-js_shared__'];

        /** Used to detect methods masquerading as native. */
        const maskSrcKey = (function() {
          const uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
          return uid ? ('Symbol(src)_1.' + uid) : '';
        }());

        /** Used to resolve the decompiled source of functions. */
        const funcToString = funcProto.toString;

        /** Used to check objects for own properties. */
        const hasOwnProperty = objectProto.hasOwnProperty;

        /**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
        const objectToString = objectProto.toString;

        /** Used to detect if a method is native. */
        const reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
        );

        /** Built-in value references. */
        const Symbol = root.Symbol;
        const splice = arrayProto.splice;

        /* Built-in method references that are verified to be native. */
        const Map = getNative(root, 'Map');
        const nativeCreate = getNative(Object, 'create');

        /** Used to convert symbols to primitives and strings. */
        const symbolProto = Symbol ? Symbol.prototype : undefined;
        const symbolToString = symbolProto ? symbolProto.toString : undefined;

        /**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
        function Hash(entries) {
          let index = -1;
          const length = entries ? entries.length : 0;

          this.clear();
          while (++index < length) {
            const entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }

        /**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
        function hashClear() {
          this.__data__ = nativeCreate ? nativeCreate(null) : {};
        }

        /**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
        function hashDelete(key) {
          return this.has(key) && delete this.__data__[key];
        }

        /**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
        function hashGet(key) {
          const data = this.__data__;
          if (nativeCreate) {
            const result = data[key];
            return result === HASH_UNDEFINED ? undefined : result;
          }
          return hasOwnProperty.call(data, key) ? data[key] : undefined;
        }

        /**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
        function hashHas(key) {
          const data = this.__data__;
          return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
        }

        /**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
        function hashSet(key, value) {
          const data = this.__data__;
          data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
          return this;
        }

        // Add methods to `Hash`.
        Hash.prototype.clear = hashClear;
        Hash.prototype['delete'] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;

        /**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
        function ListCache(entries) {
          let index = -1;
          const length = entries ? entries.length : 0;

          this.clear();
          while (++index < length) {
            const entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }

        /**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
        function listCacheClear() {
          this.__data__ = [];
        }

        /**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
        function listCacheDelete(key) {
          const data = this.__data__;
          const index = assocIndexOf(data, key);

          if (index < 0) {
            return false;
          }
          const lastIndex = data.length - 1;
          if (index == lastIndex) {
            data.pop();
          } else {
            splice.call(data, index, 1);
          }
          return true;
        }

        /**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
        function listCacheGet(key) {
          const data = this.__data__;
          const index = assocIndexOf(data, key);

          return index < 0 ? undefined : data[index][1];
        }

        /**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
        function listCacheHas(key) {
          return assocIndexOf(this.__data__, key) > -1;
        }

        /**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
        function listCacheSet(key, value) {
          const data = this.__data__;
          const index = assocIndexOf(data, key);

          if (index < 0) {
            data.push([key, value]);
          } else {
            data[index][1] = value;
          }
          return this;
        }

        // Add methods to `ListCache`.
        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype['delete'] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;

        /**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
        function MapCache(entries) {
          let index = -1;
          const length = entries ? entries.length : 0;

          this.clear();
          while (++index < length) {
            const entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }

        /**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
        function mapCacheClear() {
          this.__data__ = {
            'hash': new Hash,
            'map': new (Map || ListCache),
            'string': new Hash,
          };
        }

        /**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
        function mapCacheDelete(key) {
          return getMapData(this, key)['delete'](key);
        }

        /**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
        function mapCacheGet(key) {
          return getMapData(this, key).get(key);
        }

        /**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
        function mapCacheHas(key) {
          return getMapData(this, key).has(key);
        }

        /**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
        function mapCacheSet(key, value) {
          getMapData(this, key).set(key, value);
          return this;
        }

        // Add methods to `MapCache`.
        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype['delete'] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;

        /**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
        function assocIndexOf(array, key) {
          let length = array.length;
          while (length--) {
            if (eq(array[length][0], key)) {
              return length;
            }
          }
          return -1;
        }

        /**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
        function baseGet(object, path) {
          path = isKey(path, object) ? [path] : castPath(path);

          let index = 0;
          const length = path.length;

          while (object != null && index < length) {
            object = object[toKey(path[index++])];
          }
          return (index && index == length) ? object : undefined;
        }

        /**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
        function baseIsNative(value) {
          if (!isObject(value) || isMasked(value)) {
            return false;
          }
          const pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
          return pattern.test(toSource(value));
        }

        /**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
        function baseToString(value) {
          // Exit early for strings to avoid a performance hit in some environments.
          if (typeof value === 'string') {
            return value;
          }
          if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : '';
          }
          const result = (String(value));
          return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
        }

        /**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
        function castPath(value) {
          return isArray(value) ? value : stringToPath(value);
        }

        /**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
        function getMapData(map, key) {
          const data = map.__data__;
          return isKeyable(key)
            ? data[typeof key === 'string' ? 'string' : 'hash']
            : data.map;
        }

        /**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
        function getNative(object, key) {
          const value = getValue(object, key);
          return baseIsNative(value) ? value : undefined;
        }

        /**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
        function isKey(value, object) {
          if (isArray(value)) {
            return false;
          }
          const type = typeof value;
          if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
            return true;
          }
          return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
        }

        /**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
        function isKeyable(value) {
          const type = typeof value;
          return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
            ? (value !== '__proto__')
            : (value === null);
        }

        /**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
        function isMasked(func) {
          return !!maskSrcKey && (maskSrcKey in func);
        }

        /**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
        var stringToPath = memoize(function(string) {
          string = toString(string);

          const result = [];
          if (reLeadingDot.test(string)) {
            result.push('');
          }
          string.replace(rePropName, function(match, number, quote, string) {
            result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
          });
          return result;
        });

        /**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
        function toKey(value) {
          if (typeof value === 'string' || isSymbol(value)) {
            return value;
          }
          const result = (String(value));
          return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
        }

        /**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
        function toSource(func) {
          if (func != null) {
            try {
              return funcToString.call(func);
            } catch (e) {}
            try {
              return (String(func));
            } catch (e) {}
          }
          return '';
        }

        /**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
        function memoize(func, resolver) {
          if (typeof func !== 'function' || (resolver && typeof resolver !== 'function')) {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          var memoized = function() {
            const args = arguments;
            const key = resolver ? resolver.apply(this, args) : args[0];
            const cache = memoized.cache;

            if (cache.has(key)) {
              return cache.get(key);
            }
            const result = func.apply(this, args);
            memoized.cache = cache.set(key, result);
            return result;
          };
          memoized.cache = new (memoize.Cache || MapCache);
          return memoized;
        }

        // Assign cache to `_.memoize`.
        memoize.Cache = MapCache;

        /**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
        function eq(value, other) {
          return value === other || (value !== value && other !== other);
        }

        /**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
        var isArray = Array.isArray;

        /**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
        function isFunction(value) {
          // The use of `Object#toString` avoids issues with the `typeof` operator
          // in Safari 8-9 which returns 'object' for typed array and other constructors.
          const tag = isObject(value) ? objectToString.call(value) : '';
          return tag == funcTag || tag == genTag;
        }

        /**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
        function isObject(value) {
          const type = typeof value;
          return !!value && (type == 'object' || type == 'function');
        }

        /**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
        function isObjectLike(value) {
          return !!value && typeof value === 'object';
        }

        /**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
        function isSymbol(value) {
          return typeof value === 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
        }

        /**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
        function toString(value) {
          return value == null ? '' : baseToString(value);
        }

        /**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
        function get(object, path, defaultValue) {
          const result = object == null ? undefined : baseGet(object, path);
          return result === undefined ? defaultValue : result;
        }

        module.exports = get;
      }).call(this);
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});
  }, {}], 19: [function(require, module, exports) {
    (function(global) {
      (function() {
        /**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

        /** Used as the `TypeError` message for "Functions" methods. */
        const FUNC_ERROR_TEXT = 'Expected a function';

        /** Used to stand-in for `undefined` hash values. */
        const HASH_UNDEFINED = '__lodash_hash_undefined__';

        /** Used as references for various `Number` constants. */
        const INFINITY = 1 / 0;
        const MAX_SAFE_INTEGER = 9007199254740991;

        /** `Object#toString` result references. */
        const funcTag = '[object Function]';
        const genTag = '[object GeneratorFunction]';
        const symbolTag = '[object Symbol]';

        /** Used to match property names within property paths. */
        const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
        const reIsPlainProp = /^\w*$/;
        const reLeadingDot = /^\./;
        const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

        /**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
        const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

        /** Used to match backslashes in property paths. */
        const reEscapeChar = /\\(\\)?/g;

        /** Used to detect host constructors (Safari). */
        const reIsHostCtor = /^\[object .+?Constructor\]$/;

        /** Used to detect unsigned integer values. */
        const reIsUint = /^(?:0|[1-9]\d*)$/;

        /** Detect free variable `global` from Node.js. */
        const freeGlobal = typeof global === 'object' && global && global.Object === Object && global;

        /** Detect free variable `self`. */
        const freeSelf = typeof self === 'object' && self && self.Object === Object && self;

        /** Used as a reference to the global object. */
        const root = freeGlobal || freeSelf || Function('return this')();

        /**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
        function getValue(object, key) {
          return object == null ? undefined : object[key];
        }

        /**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
        function isHostObject(value) {
          // Many host objects are `Object` objects that can coerce to strings
          // despite having improperly defined `toString` methods.
          let result = false;
          if (value != null && typeof value.toString !== 'function') {
            try {
              result = !!(String(value));
            } catch (e) {}
          }
          return result;
        }

        /** Used for built-in method references. */
        const arrayProto = Array.prototype;
        const funcProto = Function.prototype;
        const objectProto = Object.prototype;

        /** Used to detect overreaching core-js shims. */
        const coreJsData = root['__core-js_shared__'];

        /** Used to detect methods masquerading as native. */
        const maskSrcKey = (function() {
          const uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
          return uid ? ('Symbol(src)_1.' + uid) : '';
        }());

        /** Used to resolve the decompiled source of functions. */
        const funcToString = funcProto.toString;

        /** Used to check objects for own properties. */
        const hasOwnProperty = objectProto.hasOwnProperty;

        /**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
        const objectToString = objectProto.toString;

        /** Used to detect if a method is native. */
        const reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
        );

        /** Built-in value references. */
        const Symbol = root.Symbol;
        const splice = arrayProto.splice;

        /* Built-in method references that are verified to be native. */
        const Map = getNative(root, 'Map');
        const nativeCreate = getNative(Object, 'create');

        /** Used to convert symbols to primitives and strings. */
        const symbolProto = Symbol ? Symbol.prototype : undefined;
        const symbolToString = symbolProto ? symbolProto.toString : undefined;

        /**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
        function Hash(entries) {
          let index = -1;
          const length = entries ? entries.length : 0;

          this.clear();
          while (++index < length) {
            const entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }

        /**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
        function hashClear() {
          this.__data__ = nativeCreate ? nativeCreate(null) : {};
        }

        /**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
        function hashDelete(key) {
          return this.has(key) && delete this.__data__[key];
        }

        /**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
        function hashGet(key) {
          const data = this.__data__;
          if (nativeCreate) {
            const result = data[key];
            return result === HASH_UNDEFINED ? undefined : result;
          }
          return hasOwnProperty.call(data, key) ? data[key] : undefined;
        }

        /**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
        function hashHas(key) {
          const data = this.__data__;
          return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
        }

        /**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
        function hashSet(key, value) {
          const data = this.__data__;
          data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
          return this;
        }

        // Add methods to `Hash`.
        Hash.prototype.clear = hashClear;
        Hash.prototype['delete'] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;

        /**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
        function ListCache(entries) {
          let index = -1;
          const length = entries ? entries.length : 0;

          this.clear();
          while (++index < length) {
            const entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }

        /**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
        function listCacheClear() {
          this.__data__ = [];
        }

        /**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
        function listCacheDelete(key) {
          const data = this.__data__;
          const index = assocIndexOf(data, key);

          if (index < 0) {
            return false;
          }
          const lastIndex = data.length - 1;
          if (index == lastIndex) {
            data.pop();
          } else {
            splice.call(data, index, 1);
          }
          return true;
        }

        /**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
        function listCacheGet(key) {
          const data = this.__data__;
          const index = assocIndexOf(data, key);

          return index < 0 ? undefined : data[index][1];
        }

        /**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
        function listCacheHas(key) {
          return assocIndexOf(this.__data__, key) > -1;
        }

        /**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
        function listCacheSet(key, value) {
          const data = this.__data__;
          const index = assocIndexOf(data, key);

          if (index < 0) {
            data.push([key, value]);
          } else {
            data[index][1] = value;
          }
          return this;
        }

        // Add methods to `ListCache`.
        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype['delete'] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;

        /**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
        function MapCache(entries) {
          let index = -1;
          const length = entries ? entries.length : 0;

          this.clear();
          while (++index < length) {
            const entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }

        /**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
        function mapCacheClear() {
          this.__data__ = {
            'hash': new Hash,
            'map': new (Map || ListCache),
            'string': new Hash,
          };
        }

        /**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
        function mapCacheDelete(key) {
          return getMapData(this, key)['delete'](key);
        }

        /**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
        function mapCacheGet(key) {
          return getMapData(this, key).get(key);
        }

        /**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
        function mapCacheHas(key) {
          return getMapData(this, key).has(key);
        }

        /**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
        function mapCacheSet(key, value) {
          getMapData(this, key).set(key, value);
          return this;
        }

        // Add methods to `MapCache`.
        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype['delete'] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;

        /**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
        function assignValue(object, key, value) {
          const objValue = object[key];
          if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
            object[key] = value;
          }
        }

        /**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
        function assocIndexOf(array, key) {
          let length = array.length;
          while (length--) {
            if (eq(array[length][0], key)) {
              return length;
            }
          }
          return -1;
        }

        /**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
        function baseIsNative(value) {
          if (!isObject(value) || isMasked(value)) {
            return false;
          }
          const pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
          return pattern.test(toSource(value));
        }

        /**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
        function baseSet(object, path, value, customizer) {
          if (!isObject(object)) {
            return object;
          }
          path = isKey(path, object) ? [path] : castPath(path);

          let index = -1;
          const length = path.length;
          const lastIndex = length - 1;
          let nested = object;

          while (nested != null && ++index < length) {
            const key = toKey(path[index]);
            let newValue = value;

            if (index != lastIndex) {
              const objValue = nested[key];
              newValue = customizer ? customizer(objValue, key, nested) : undefined;
              if (newValue === undefined) {
                newValue = isObject(objValue)
                  ? objValue
                  : (isIndex(path[index + 1]) ? [] : {});
              }
            }
            assignValue(nested, key, newValue);
            nested = nested[key];
          }
          return object;
        }

        /**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
        function baseToString(value) {
          // Exit early for strings to avoid a performance hit in some environments.
          if (typeof value === 'string') {
            return value;
          }
          if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : '';
          }
          const result = (String(value));
          return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
        }

        /**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
        function castPath(value) {
          return isArray(value) ? value : stringToPath(value);
        }

        /**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
        function getMapData(map, key) {
          const data = map.__data__;
          return isKeyable(key)
            ? data[typeof key === 'string' ? 'string' : 'hash']
            : data.map;
        }

        /**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
        function getNative(object, key) {
          const value = getValue(object, key);
          return baseIsNative(value) ? value : undefined;
        }

        /**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
        function isIndex(value, length) {
          length = length == null ? MAX_SAFE_INTEGER : length;
          return !!length &&
    (typeof value === 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
        }

        /**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
        function isKey(value, object) {
          if (isArray(value)) {
            return false;
          }
          const type = typeof value;
          if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
            return true;
          }
          return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
        }

        /**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
        function isKeyable(value) {
          const type = typeof value;
          return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
            ? (value !== '__proto__')
            : (value === null);
        }

        /**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
        function isMasked(func) {
          return !!maskSrcKey && (maskSrcKey in func);
        }

        /**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
        var stringToPath = memoize(function(string) {
          string = toString(string);

          const result = [];
          if (reLeadingDot.test(string)) {
            result.push('');
          }
          string.replace(rePropName, function(match, number, quote, string) {
            result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
          });
          return result;
        });

        /**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
        function toKey(value) {
          if (typeof value === 'string' || isSymbol(value)) {
            return value;
          }
          const result = (String(value));
          return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
        }

        /**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
        function toSource(func) {
          if (func != null) {
            try {
              return funcToString.call(func);
            } catch (e) {}
            try {
              return (String(func));
            } catch (e) {}
          }
          return '';
        }

        /**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
        function memoize(func, resolver) {
          if (typeof func !== 'function' || (resolver && typeof resolver !== 'function')) {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          var memoized = function() {
            const args = arguments;
            const key = resolver ? resolver.apply(this, args) : args[0];
            const cache = memoized.cache;

            if (cache.has(key)) {
              return cache.get(key);
            }
            const result = func.apply(this, args);
            memoized.cache = cache.set(key, result);
            return result;
          };
          memoized.cache = new (memoize.Cache || MapCache);
          return memoized;
        }

        // Assign cache to `_.memoize`.
        memoize.Cache = MapCache;

        /**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
        function eq(value, other) {
          return value === other || (value !== value && other !== other);
        }

        /**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
        var isArray = Array.isArray;

        /**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
        function isFunction(value) {
          // The use of `Object#toString` avoids issues with the `typeof` operator
          // in Safari 8-9 which returns 'object' for typed array and other constructors.
          const tag = isObject(value) ? objectToString.call(value) : '';
          return tag == funcTag || tag == genTag;
        }

        /**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
        function isObject(value) {
          const type = typeof value;
          return !!value && (type == 'object' || type == 'function');
        }

        /**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
        function isObjectLike(value) {
          return !!value && typeof value === 'object';
        }

        /**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
        function isSymbol(value) {
          return typeof value === 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
        }

        /**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
        function toString(value) {
          return value == null ? '' : baseToString(value);
        }

        /**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
        function set(object, path, value) {
          return object == null ? object : baseSet(object, path, value);
        }

        module.exports = set;
      }).call(this);
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});
  }, {}], 20: [function(require, module, exports) {
    // @flow
    // "lookup" algorithm http://tools.ietf.org/html/rfc4647#section-3.4
    // assumes normalized language tags, and matches in a case sensitive manner
    module.exports = function lookupClosestLocale(locale/* : string | string[] | void */, available/* : { [string]: any } */)/* : ?string */ {
      if (typeof locale === 'string' && available[locale]) return locale;
      const locales = [].concat(locale || []);
      for (let l = 0, ll = locales.length; l < ll; ++l) {
        const current = locales[l].split('-');
        while (current.length) {
          const candidate = current.join('-');
          if (available[candidate]) return candidate;
          current.pop();
        }
      }
    };
  }, {}], 21: [function(require, module, exports) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {value: true});

    /* global performance */
    const perf = typeof performance !== 'undefined' && performance;

    const now = perf && perf.now ? function() {
      return perf.now();
    } : function() {
      return Date.now();
    };

    function throwIfEmpty(name) {
      if (!name) {
        throw new Error('name must be non-empty');
      }
    }

    // simple binary sort insertion
    function insertSorted(arr, item) {
      let low = 0;
      let high = arr.length;
      let mid;
      while (low < high) {
        mid = (low + high) >>> 1; // like (num / 2) but faster
        if (arr[mid].startTime < item.startTime) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      arr.splice(low, 0, item);
    }

    exports.mark = void 0;
    exports.stop = void 0;
    exports.getEntries = void 0;
    exports.clear = void 0;

    if (
      perf &&
  perf.mark &&
  perf.getEntriesByName &&
  perf.getEntriesByType &&
  perf.clearMeasures
    ) {
      exports.mark = function(name) {
        throwIfEmpty(name);
        perf.mark(('start ' + name));
      };
      exports.stop = function(name) {
        throwIfEmpty(name);
        perf.mark(('end ' + name));
        perf.measure(name, ('start ' + name), ('end ' + name));
        const entries = perf.getEntriesByName(name);
        return entries[entries.length - 1];
      };
      exports.getEntries = function() {
        return perf.getEntriesByType('measure');
      };
      exports.clear = function() {
        perf.clearMarks();
        perf.clearMeasures();
      };
    } else {
      let marks = {};
      let entries = [];
      exports.mark = function(name) {
        throwIfEmpty(name);
        const startTime = now();
        marks['$' + name] = startTime;
      };
      exports.stop = function(name) {
        throwIfEmpty(name);
        const endTime = now();
        const startTime = marks['$' + name];
        if (!startTime) {
          throw new Error(('no known mark: ' + name));
        }
        const entry = {
          startTime: startTime,
          name: name,
          duration: endTime - startTime,
          entryType: 'measure',
        };
        // per the spec this should be at least 150:
        // https://www.w3.org/TR/resource-timing-1/#extensions-performance-interface
        // we just have no limit, per Chrome and Edge's de-facto behavior
        insertSorted(entries, entry);
        return entry;
      };
      exports.getEntries = function() {
        return entries;
      };
      exports.clear = function() {
        marks = {};
        entries = [];
      };
    }
  }, {}], 22: [function(require, module, exports) {
    (function(process) {
      (function() {
        // 'path' module extracted from Node.js v8.11.1 (only the posix part)
        // transplited with Babel

        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.

        'use strict';

        function assertPath(path) {
          if (typeof path !== 'string') {
            throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
          }
        }

        // Resolves . and .. elements in a path with directory names
        function normalizeStringPosix(path, allowAboveRoot) {
          let res = '';
          let lastSegmentLength = 0;
          let lastSlash = -1;
          let dots = 0;
          let code;
          for (let i = 0; i <= path.length; ++i) {
            if (i < path.length) {
              code = path.charCodeAt(i);
            } else if (code === 47 /* /*/) {
              break;
            } else {
              code = 47;
            }
            if (code === 47 /* /*/) {
              if (lastSlash === i - 1 || dots === 1) {
                // NOOP
              } else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /* .*/ || res.charCodeAt(res.length - 2) !== 46 /* .*/) {
                  if (res.length > 2) {
                    const lastSlashIndex = res.lastIndexOf('/');
                    if (lastSlashIndex !== res.length - 1) {
                      if (lastSlashIndex === -1) {
                        res = '';
                        lastSegmentLength = 0;
                      } else {
                        res = res.slice(0, lastSlashIndex);
                        lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
                      }
                      lastSlash = i;
                      dots = 0;
                      continue;
                    }
                  } else if (res.length === 2 || res.length === 1) {
                    res = '';
                    lastSegmentLength = 0;
                    lastSlash = i;
                    dots = 0;
                    continue;
                  }
                }
                if (allowAboveRoot) {
                  if (res.length > 0) {
                    res += '/..';
                  } else {
                    res = '..';
                  }
                  lastSegmentLength = 2;
                }
              } else {
                if (res.length > 0) {
                  res += '/' + path.slice(lastSlash + 1, i);
                } else {
                  res = path.slice(lastSlash + 1, i);
                }
                lastSegmentLength = i - lastSlash - 1;
              }
              lastSlash = i;
              dots = 0;
            } else if (code === 46 /* .*/ && dots !== -1) {
              ++dots;
            } else {
              dots = -1;
            }
          }
          return res;
        }

        function _format(sep, pathObject) {
          const dir = pathObject.dir || pathObject.root;
          const base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
          if (!dir) {
            return base;
          }
          if (dir === pathObject.root) {
            return dir + base;
          }
          return dir + sep + base;
        }

        var posix = {
          // path.resolve([from ...], to)
          resolve: function resolve() {
            let resolvedPath = '';
            let resolvedAbsolute = false;
            let cwd;

            for (let i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
              var path;
              if (i >= 0) {
                path = arguments[i];
              } else {
                if (cwd === undefined) {
                  cwd = process.cwd();
                }
                path = cwd;
              }

              assertPath(path);

              // Skip empty entries
              if (path.length === 0) {
                continue;
              }

              resolvedPath = path + '/' + resolvedPath;
              resolvedAbsolute = path.charCodeAt(0) === 47;
            }

            // At this point the path should be resolved to a full absolute path, but
            // handle relative paths to be safe (might happen when process.cwd() fails)

            // Normalize the path
            resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

            if (resolvedAbsolute) {
              if (resolvedPath.length > 0) {
                return '/' + resolvedPath;
              } else {
                return '/';
              }
            } else if (resolvedPath.length > 0) {
              return resolvedPath;
            } else {
              return '.';
            }
          },

          normalize: function normalize(path) {
            assertPath(path);

            if (path.length === 0) return '.';

            const isAbsolute = path.charCodeAt(0) === 47;
            const trailingSeparator = path.charCodeAt(path.length - 1) === 47;

            // Normalize the path
            path = normalizeStringPosix(path, !isAbsolute);

            if (path.length === 0 && !isAbsolute) path = '.';
            if (path.length > 0 && trailingSeparator) path += '/';

            if (isAbsolute) return '/' + path;
            return path;
          },

          isAbsolute: function isAbsolute(path) {
            assertPath(path);
            return path.length > 0 && path.charCodeAt(0) === 47;
          },

          join: function join() {
            if (arguments.length === 0) {
              return '.';
            }
            let joined;
            for (let i = 0; i < arguments.length; ++i) {
              const arg = arguments[i];
              assertPath(arg);
              if (arg.length > 0) {
                if (joined === undefined) {
                  joined = arg;
                } else {
                  joined += '/' + arg;
                }
              }
            }
            if (joined === undefined) {
              return '.';
            }
            return posix.normalize(joined);
          },

          relative: function relative(from, to) {
            assertPath(from);
            assertPath(to);

            if (from === to) return '';

            from = posix.resolve(from);
            to = posix.resolve(to);

            if (from === to) return '';

            // Trim any leading backslashes
            let fromStart = 1;
            for (; fromStart < from.length; ++fromStart) {
              if (from.charCodeAt(fromStart) !== 47 /* /*/) {
                break;
              }
            }
            const fromEnd = from.length;
            const fromLen = fromEnd - fromStart;

            // Trim any leading backslashes
            let toStart = 1;
            for (; toStart < to.length; ++toStart) {
              if (to.charCodeAt(toStart) !== 47 /* /*/) {
                break;
              }
            }
            const toEnd = to.length;
            const toLen = toEnd - toStart;

            // Compare paths to find the longest common path from root
            const length = fromLen < toLen ? fromLen : toLen;
            let lastCommonSep = -1;
            let i = 0;
            for (; i <= length; ++i) {
              if (i === length) {
                if (toLen > length) {
                  if (to.charCodeAt(toStart + i) === 47 /* /*/) {
                    // We get here if `from` is the exact base path for `to`.
                    // For example: from='/foo/bar'; to='/foo/bar/baz'
                    return to.slice(toStart + i + 1);
                  } else if (i === 0) {
                    // We get here if `from` is the root
                    // For example: from='/'; to='/foo'
                    return to.slice(toStart + i);
                  }
                } else if (fromLen > length) {
                  if (from.charCodeAt(fromStart + i) === 47 /* /*/) {
                    // We get here if `to` is the exact base path for `from`.
                    // For example: from='/foo/bar/baz'; to='/foo/bar'
                    lastCommonSep = i;
                  } else if (i === 0) {
                    // We get here if `to` is the root.
                    // For example: from='/foo'; to='/'
                    lastCommonSep = 0;
                  }
                }
                break;
              }
              const fromCode = from.charCodeAt(fromStart + i);
              const toCode = to.charCodeAt(toStart + i);
              if (fromCode !== toCode) {
                break;
              } else if (fromCode === 47 /* /*/) {
                lastCommonSep = i;
              }
            }

            let out = '';
            // Generate the relative path based on the path difference between `to`
            // and `from`
            for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
              if (i === fromEnd || from.charCodeAt(i) === 47 /* /*/) {
                if (out.length === 0) {
                  out += '..';
                } else {
                  out += '/..';
                }
              }
            }

            // Lastly, append the rest of the destination (`to`) path that comes after
            // the common path parts
            if (out.length > 0) {
              return out + to.slice(toStart + lastCommonSep);
            } else {
              toStart += lastCommonSep;
              if (to.charCodeAt(toStart) === 47 /* /*/) {
                ++toStart;
              }
              return to.slice(toStart);
            }
          },

          _makeLong: function _makeLong(path) {
            return path;
          },

          dirname: function dirname(path) {
            assertPath(path);
            if (path.length === 0) return '.';
            let code = path.charCodeAt(0);
            const hasRoot = code === 47;
            let end = -1;
            let matchedSlash = true;
            for (let i = path.length - 1; i >= 1; --i) {
              code = path.charCodeAt(i);
              if (code === 47 /* /*/) {
                if (!matchedSlash) {
                  end = i;
                  break;
                }
              } else {
                // We saw the first non-path separator
                matchedSlash = false;
              }
            }

            if (end === -1) return hasRoot ? '/' : '.';
            if (hasRoot && end === 1) return '//';
            return path.slice(0, end);
          },

          basename: function basename(path, ext) {
            if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
            assertPath(path);

            let start = 0;
            let end = -1;
            let matchedSlash = true;
            let i;

            if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
              if (ext.length === path.length && ext === path) return '';
              let extIdx = ext.length - 1;
              let firstNonSlashEnd = -1;
              for (i = path.length - 1; i >= 0; --i) {
                const code = path.charCodeAt(i);
                if (code === 47 /* /*/) {
                  // If we reached a path separator that was not part of a set of path
                  // separators at the end of the string, stop now
                  if (!matchedSlash) {
                    start = i + 1;
                    break;
                  }
                } else {
                  if (firstNonSlashEnd === -1) {
                    // We saw the first non-path separator, remember this index in case
                    // we need it if the extension ends up not matching
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                  }
                  if (extIdx >= 0) {
                    // Try to match the explicit extension
                    if (code === ext.charCodeAt(extIdx)) {
                      if (--extIdx === -1) {
                        // We matched the extension, so mark this as the end of our path
                        // component
                        end = i;
                      }
                    } else {
                      // Extension does not match, so our result is the entire path
                      // component
                      extIdx = -1;
                      end = firstNonSlashEnd;
                    }
                  }
                }
              }

              if (start === end) end = firstNonSlashEnd; else if (end === -1) end = path.length;
              return path.slice(start, end);
            } else {
              for (i = path.length - 1; i >= 0; --i) {
                if (path.charCodeAt(i) === 47 /* /*/) {
                  // If we reached a path separator that was not part of a set of path
                  // separators at the end of the string, stop now
                  if (!matchedSlash) {
                    start = i + 1;
                    break;
                  }
                } else if (end === -1) {
                  // We saw the first non-path separator, mark this as the end of our
                  // path component
                  matchedSlash = false;
                  end = i + 1;
                }
              }

              if (end === -1) return '';
              return path.slice(start, end);
            }
          },

          extname: function extname(path) {
            assertPath(path);
            let startDot = -1;
            let startPart = 0;
            let end = -1;
            let matchedSlash = true;
            // Track the state of characters (if any) we see before our first dot and
            // after any path separator we find
            let preDotState = 0;
            for (let i = path.length - 1; i >= 0; --i) {
              const code = path.charCodeAt(i);
              if (code === 47 /* /*/) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                  startPart = i + 1;
                  break;
                }
                continue;
              }
              if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
              }
              if (code === 46 /* .*/) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1) {
                  startDot = i;
                } else if (preDotState !== 1) {
                  preDotState = 1;
                }
              } else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
              }
            }

            if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
              return '';
            }
            return path.slice(startDot, end);
          },

          format: function format(pathObject) {
            if (pathObject === null || typeof pathObject !== 'object') {
              throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
            }
            return _format('/', pathObject);
          },

          parse: function parse(path) {
            assertPath(path);

            const ret = {root: '', dir: '', base: '', ext: '', name: ''};
            if (path.length === 0) return ret;
            let code = path.charCodeAt(0);
            const isAbsolute = code === 47;
            let start;
            if (isAbsolute) {
              ret.root = '/';
              start = 1;
            } else {
              start = 0;
            }
            let startDot = -1;
            let startPart = 0;
            let end = -1;
            let matchedSlash = true;
            let i = path.length - 1;

            // Track the state of characters (if any) we see before our first dot and
            // after any path separator we find
            let preDotState = 0;

            // Get non-dir info
            for (; i >= start; --i) {
              code = path.charCodeAt(i);
              if (code === 47 /* /*/) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                  startPart = i + 1;
                  break;
                }
                continue;
              }
              if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
              }
              if (code === 46 /* .*/) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1) startDot = i; else if (preDotState !== 1) preDotState = 1;
              } else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
              }
            }

            if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
              if (end !== -1) {
                if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end); else ret.base = ret.name = path.slice(startPart, end);
              }
            } else {
              if (startPart === 0 && isAbsolute) {
                ret.name = path.slice(1, startDot);
                ret.base = path.slice(1, end);
              } else {
                ret.name = path.slice(startPart, startDot);
                ret.base = path.slice(startPart, end);
              }
              ret.ext = path.slice(startDot, end);
            }

            if (startPart > 0) ret.dir = path.slice(0, startPart - 1); else if (isAbsolute) ret.dir = '/';

            return ret;
          },

          sep: '/',
          delimiter: ':',
          win32: null,
          posix: null,
        };

        posix.posix = posix;

        module.exports = posix;
      }).call(this);
    }).call(this, require('_process'));
  }, {'_process': 23}], 23: [function(require, module, exports) {
    // shim for using process in browser
    const process = module.exports = {};

    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    let cachedSetTimeout;
    let cachedClearTimeout;

    function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout() {
      throw new Error('clearTimeout has not been defined');
    }
    (function() {
      try {
        if (typeof setTimeout === 'function') {
          cachedSetTimeout = setTimeout;
        } else {
          cachedSetTimeout = defaultSetTimout;
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        if (typeof clearTimeout === 'function') {
          cachedClearTimeout = clearTimeout;
        } else {
          cachedClearTimeout = defaultClearTimeout;
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    }());
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
      // normal enviroments in sane situations
        return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
      // normal enviroments in sane situations
        return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return cachedClearTimeout.call(this, marker);
        }
      }
    }
    let queue = [];
    let draining = false;
    let currentQueue;
    let queueIndex = -1;

    function cleanUpNextTick() {
      if (!draining || !currentQueue) {
        return;
      }
      draining = false;
      if (currentQueue.length) {
        queue = currentQueue.concat(queue);
      } else {
        queueIndex = -1;
      }
      if (queue.length) {
        drainQueue();
      }
    }

    function drainQueue() {
      if (draining) {
        return;
      }
      const timeout = runTimeout(cleanUpNextTick);
      draining = true;

      let len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run();
          }
        }
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }

    process.nextTick = function(fun) {
      const args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
        for (let i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
      }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;

    process.listeners = function(name) {
      return [];
    };

    process.binding = function(name) {
      throw new Error('process.binding is not supported');
    };

    process.cwd = function() {
      return '/';
    };
    process.chdir = function(dir) {
      throw new Error('process.chdir is not supported');
    };
    process.umask = function() {
      return 0;
    };
  }, {}], 24: [function(require, module, exports) {
    (function(__dirname) {
      (function() {
        /**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
        'use strict';

        module.exports.LH_ROOT = __dirname;
      }).call(this);
    }).call(this, '/');
  }, {}]}, {}, [1])(1);
});

Lighthouse.i18n.availableLocales = ['ar-XB', 'ar', 'bg', 'ca', 'cs', 'da', 'de', 'el', 'en-GB', 'en-US', 'en-XA', 'en-XL', 'es-419', 'es', 'fi', 'fil', 'fr', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nl', 'no', 'pl', 'pt-PT', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr-Latn', 'sr', 'sv', 'ta', 'te', 'th', 'tr', 'uk', 'vi', 'zh-HK', 'zh-TW', 'zh'];
document.dispatchEvent(new Event('lighthouseModuleLoaded-i18n'));
