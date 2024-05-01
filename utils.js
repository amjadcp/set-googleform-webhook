const { google } = require("googleapis");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const {config} = require("dotenv");

config();

let forms;
const authenticateForm = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./key.json",
    scopes: [
      "https://www.googleapis.com/auth/forms.responses.readonly",
      "https://www.googleapis.com/auth/forms.body.readonly",
      "https://www.googleapis.com/auth/forms.body",
      "https://www.googleapis.com/auth/drive",
    ],
  });

  const client = await auth.getClient();
  forms = google.forms({ version: "v1", auth: client });
  console.log("google form authenticated");
};

const fetchForm = async (formId) => {
  const data = await forms.forms.get({
    formId,
  });
  return data.data;
};

const addFormToSheet = async (formId, formName) => {
  const data = new FormData();
  data.append("formId", formId);
  data.append("formName", formName);
  const response = await axios.post(process.env.APP_SCRIPT_URL, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(response.data);
};

module.exports = {
  authenticateForm,
  fetchForm,
  addFormToSheet,
};
