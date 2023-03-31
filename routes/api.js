"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    const { text, locale } = req.body;
    let response;
    try {
      response = {
        text,
        translation: translator.translate(text, locale),
      };
      // console.log(response);
      res.json(response);
    } catch (err) {
      // console.error(err);
      response = { error: err.message };
      // console.log(response);
      res.json(response);
    }
  });
};
