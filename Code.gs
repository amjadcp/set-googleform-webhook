// past this file to the AppScript file


// This function will trigger when you do the post request using the AppScript deploy link
function doPost(e) {
  var formId = e.parameter.formId; // Google Form ID send in POST request
  var sheetName = e.parameter.formName; // Google Form title send in POST rquest
  var form = FormApp.openById(formId);

  // Replace with your sheet ID
  var sheetId = 'sheet_id';

  // Link the form to the sheet
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheetId);

  // Get all sheets in the spreadsheet
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheets = spreadsheet.getSheets();

  // set the sheet name as the form title
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().startsWith('Form')) {
      sheets[i].setName(sheetName);
      break;
    }
  }

  return ContentService.createTextOutput("Done");
}

// This function will trigger when a user submits any of the linked form
function onFormSubmit(e) {
  // Get the active spreadsheet and the first sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Get the headers (field names)
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Get the response values
  var values = e.values;

  // Create an object with the field names and values
  var data = {};
  for (var i = 0; i < headers.length; i++) {
    data[headers[i]] = values[i];
  }
  console.log(data);

  // Get the form URL
  var formUrl = e.range.getSheet().getFormUrl();

  // Extract the form ID from the form URL
  var formId = formUrl.split('/forms/d/')[1].split('/')[0];
  console.log('Form ID: ' + formId);

  // Add the form ID to the data
  data['formId'] = formId;

  // Prepare the options for the HTTP request
  var options = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify(data)
  };

  // Send the HTTP request. Replace the URL with your server webhook url (url from ngrok)
  UrlFetchApp.fetch('webhook_url', options);
}