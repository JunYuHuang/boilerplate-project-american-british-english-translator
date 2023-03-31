# American British Translator

This is the boilerplate for the American British Translator project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/american-british-translator

## General Notes

- API endpoint `/api/translate`
    - 

- `Translator` class
    - should have a method that checks if given locale is valid or not
    - should have a method that checks if there is anything in the given text that needs to be translated?
    - should have a method that returns a wrapped `<span class="highlight"></span>` around all should-be-translated substrings (includes single words, phrases, notations, etc.)
    - should have a `translate(text, locale, shouldHighlight)` method that returns a new translation string based on its parameters