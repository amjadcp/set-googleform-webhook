const express = require('express');
const cors = require('cors');
const { fetchForm, addFormToSheet, authenticateForm } = require('./utils');
const app = express();
const port = 3000;

authenticateForm();

app.use(cors());
app.use(express.json({
    type: ["application/json", "text/plain"]
}));

app.post('/api/v1/form', async (req, res) => {
    const { formId } = req.body;
    console.log(formId);
    const data = await fetchForm(formId);
    const formName = data?.info?.title || "undefined";
    await addFormToSheet(formId, formName);
    res.status(200).json({
        message: "Form added to sheet",
    });
});

app.post('/api/v1/webhook', async (req, res) => {
    console.log(req.body);
    res.status(200).json({
        message: "Webhook received",
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});