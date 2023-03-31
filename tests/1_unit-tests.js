const chai = require("chai");
const assert = chai.assert;

const Translator = require("../components/translator.js");
const translator = new Translator();
const UKToUSLocale = "british-to-american";
const USToUKLocale = "american-to-british";
const USToUKTexts = {
  "Mangoes are my favorite fruit.": "Mangoes are my favourite fruit.",
  "I ate yogurt for breakfast.": "I ate yoghurt for breakfast.",
  "We had a party at my friend's condo.": "We had a party at my friend's flat.",
  "Can you toss this in the trashcan for me?":
    "Can you toss this in the bin for me?",
  "The parking lot was full.": "The car park was full.",
  "Like a high tech Rube Goldberg machine.":
    "Like a high tech Heath Robinson device.",
  "To play hooky means to skip class or work.":
    "To bunk off means to skip class or work.",
  "No Mr. Bond, I expect you to die.": "No Mr Bond, I expect you to die.",
  "Dr. Grosh will see you now.": "Dr Grosh will see you now.",
  "Lunch is at 12:15 today.": "Lunch is at 12.15 today.",
};
const UKToUSTexts = {
  "We watched the footie match for a while.":
    "We watched the soccer match for a while.",
  "Paracetamol takes up to an hour to work.":
    "Tylenol takes up to an hour to work.",
  "First, caramelise the onions.": "First, caramelize the onions.",
  "I spent the bank holiday at the funfair.":
    "I spent the public holiday at the carnival.",
  "I had a bicky then went to the chippy.":
    "I had a cookie then went to the fish-and-chip shop.",
  "I've just got bits and bobs in my bum bag.":
    "I've just got odds and ends in my fanny pack.",
  "The car boot sale at Boxted Airfield was called off.":
    "The swap meet at Boxted Airfield was called off.",
  "Have you met Mrs Kalyani?": "Have you met Mrs. Kalyani?",
  "Prof Joyner of King's College, London.":
    "Prof. Joyner of King's College, London.",
  "Tea time is usually around 4 or 4.30.":
    "Tea time is usually around 4 or 4:30.",
};
const plainToHighlightedTexts = [
  [
    USToUKLocale,
    "Mangoes are my favorite fruit.",
    'Mangoes are my <span class="highlight">favourite</span> fruit.',
  ],
  [
    USToUKLocale,
    "I ate yogurt for breakfast.",
    'I ate <span class="highlight">yoghurt</span> for breakfast.',
  ],
  [
    UKToUSLocale,
    "We watched the footie match for a while.",
    'We watched the <span class="highlight">soccer</span> match for a while.',
  ],
  [
    UKToUSLocale,
    "Paracetamol takes up to an hour to work.",
    '<span class="highlight">Tylenol</span> takes up to an hour to work.',
  ],
];

suite("Unit Tests", () => {
  let testCount = 1;

  // US to UK text translations
  for (let text of Object.keys(USToUKTexts)) {
    test(`${testCount}) Translate "${text}" to British English`, () => {
      assert.equal(
        translator.translate(text, USToUKLocale, false),
        USToUKTexts[text]
      );
    });
    testCount++;
  }
  // UK to US text translations
  for (let text of Object.keys(UKToUSTexts)) {
    test(`${testCount}) Translate "${text}" to American English`, () => {
      assert.equal(
        translator.translate(text, UKToUSLocale, false),
        UKToUSTexts[text]
      );
    });
    testCount++;
  }
  // text translation highlights
  for (let [locale, input, output] of plainToHighlightedTexts) {
    test(`${testCount}) Highlight translation in ${input}`, () => {
      assert.equal(translator.translate(input, locale, true), output);
    });
    testCount++;
  }
});
