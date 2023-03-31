// Heavily based on Kelvin Sanchez's solution
// https://github.com/kelvinsanchez15/american-british-english-translator/blob/master/public/translator.js

// IMPORTS
const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

// GLOBALS
const USToUKLocale = "american-to-british";
const UKToUSLocale = "british-to-american";
const noTranslationNeededMsg = "Everything looks good to me!";
const emptyTextErrMsg = "No text to translate";
const missingParamErrMsg = "Required field(s) missing";
const invalidLocaleMsg = "Invalid value for locale field";
const USTimeRegex = /([1-9]|1[012]):[0-5][0-9]/g;
const UKTimeRegex = /([1-9]|1[012]).[0-5][0-9]/g;

function reverseObjPairs(obj) {
  return Object.assign(
    {},
    ...Object.entries(obj).map(([k, v]) => ({ [v]: k }))
  );
}

function transformText(text, mapObj, replaceCb) {
  const regex = new RegExp(Object.keys(mapObj).join("|"), "gi");
  return text.replace(regex, replaceCb);
}

const USToUKDict = {
  ...americanOnly,
  ...americanToBritishSpelling,
};

const UKToUSDict = {
  ...britishOnly,
  ...reverseObjPairs(americanToBritishSpelling),
};

function highlightText(text) {
  return `<span class="highlight">${text}</span>`;
}

function isValidLocale(locale) {
  return String(locale) === USToUKLocale || String(locale) === UKToUSLocale;
}

class Translator {
  translate(text, locale, shouldHighlight = true) {
    if (text === undefined || !locale) throw new Error(missingParamErrMsg);
    if (text === "") throw new Error(emptyTextErrMsg);
    if (!isValidLocale(locale)) throw new Error(invalidLocaleMsg);

    let lowercasedText = text.toLowerCase();
    let res, highlightedRes;
    let dict, titles, timeRegex;
    const matchesMap = Object.create(null);

    if (locale === UKToUSLocale) {
      dict = UKToUSDict;
      titles = reverseObjPairs(americanToBritishTitles);
      timeRegex = UKTimeRegex;
    } else if (locale == USToUKLocale) {
      dict = USToUKDict;
      titles = americanToBritishTitles;
      timeRegex = USTimeRegex;
    } else {
      // this should never execute
      throw new Error(invalidLocaleMsg);
    }

    // add to-replace titles to map obj
    Object.entries(titles).map(([k, v]) => {
      if (lowercasedText.includes(k)) matchesMap[k] = v;
    });

    // filter words with spaces from dict
    const wordsWithSpaces = Object.fromEntries(
      Object.entries(dict).filter(([k, v]) => k.includes(" "))
    );

    // add spaced word matches to map obj
    Object.entries(wordsWithSpaces).map(([k, v]) => {
      if (lowercasedText.includes(k)) matchesMap[k] = v;
    });

    // add individual word matches to map obj
    const singleWordRegex = /(\w+([-'])(\w+)?['-]?(\w+))|\w+/g;
    lowercasedText.match(singleWordRegex).map((word) => {
      if (dict[word]) return (matchesMap[word] = dict[word]);
    });

    // add time matches to map obj
    const matchedTimes = lowercasedText.match(timeRegex);
    if (matchedTimes) {
      matchedTimes.map((e) => {
        if (locale == USToUKLocale) {
          return (matchesMap[e] = e.replace(":", "."));
        } else if (locale == UKToUSLocale) {
          return (matchesMap[e] = e.replace(".", ":"));
        }
      });
    }

    // no matches
    if (Object.keys(matchesMap).length === 0) return noTranslationNeededMsg;

    const alphaUpperRegex = /[A-Z]/;

    return transformText(text, matchesMap, (matched) => {
      let res = matchesMap[matched.toLowerCase()];
      if (matched.length > 1 && alphaUpperRegex.test(matched.charAt(0)))
        res = res.charAt(0).toUpperCase() + res.slice(1);
      return shouldHighlight ? highlightText(res) : res;
    });
  }
}

module.exports = Translator;
