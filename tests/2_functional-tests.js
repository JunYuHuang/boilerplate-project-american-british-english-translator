const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

// let Translator = require("../components/translator.js");
const API_ROOT = "/api/translate";
const USToUK = "american-to-british";
const UKToUS = "british-to-american";

suite("Functional Tests", () => {
  test("Translation with text and locale fields: POST request to /api/translate", async () => {
    const reqBody = {
      text: "Mangoes are my favorite fruit.",
      locale: USToUK,
    };
    const resBody = {
      text: reqBody.text,
      translation:
        'Mangoes are my <span class="highlight">favourite</span> fruit.',
    };
    let data = await chai.request(server).post(API_ROOT).send(reqBody);
    assert.deepEqual(data.body, resBody);
  });
  test("Translation with text and invalid locale field: POST request to /api/translate", async () => {
    const reqBody = {
      text: "Mangoes are my favorite fruit.",
      locale: "american-to-chinese",
    };
    const resBody = {
      error: "Invalid value for locale field",
    };
    let data = await chai.request(server).post(API_ROOT).send(reqBody);
    assert.deepEqual(data.body, resBody);
  });
  test("Translation with missing text field: POST request to /api/translate", async () => {
    const reqBody = { locale: USToUK };
    const resBody = {
      error: "Required field(s) missing",
    };
    let data = await chai.request(server).post(API_ROOT).send(reqBody);
    assert.deepEqual(data.body, resBody);
  });
  test("Translation with missing locale field: POST request to /api/translate", async () => {
    const reqBody = {
      text: "Mangoes are my favorite fruit.",
    };
    const resBody = {
      error: "Required field(s) missing",
    };
    let data = await chai.request(server).post(API_ROOT).send(reqBody);
    assert.deepEqual(data.body, resBody);
  });
  test("Translation with empty text: POST request to /api/translate", async () => {
    const reqBody = {
      text: "",
      locale: USToUK,
    };
    const resBody = {
      error: "No text to translate",
    };
    let data = await chai.request(server).post(API_ROOT).send(reqBody);
    assert.deepEqual(data.body, resBody);
  });
  test("Translation with text that needs no translation: POST request to /api/translate", async () => {
    const reqBody = {
      text: "SaintPeter and nhcarrigan give their regards!",
      locale: UKToUS,
    };
    const resBody = {
      text: reqBody.text,
      translation: "Everything looks good to me!",
    };
    let data = await chai.request(server).post(API_ROOT).send(reqBody);
    assert.deepEqual(data.body, resBody);
  });
});
