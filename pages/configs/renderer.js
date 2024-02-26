const { JSONEditor } = require('jsoneditor');
const fs = require('fs');
const path = require('path');
const { dialog } = require('@electron/remote');

const editorContainer = document.getElementById('jsoneditor');
const fileSelector = document.getElementById('fileSelector');
const saveButton = document.getElementById('saveButton');
const directoryPath = '/Users/bene/ImSwitchConfig/imcontrol_setups';

let editor = new JSONEditor(editorContainer, {});

// Populate the dropdown with files from the directory
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    dialog.showErrorBox('Error loading files', 'Could not read the directory.');
    return;
  }

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      let option = document.createElement('option');
      option.value = file;
      option.innerText = file;
      fileSelector.appendChild(option);
    }
  });
});

// Load the selected file into JSONEditor
fileSelector.addEventListener('change', function() {
  const filePath = path.join(directoryPath, this.value);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      dialog.showErrorBox('Error reading file', 'Could not read the selected file.');
      return;
    }

    const json = JSON.parse(data);
    editor.set(json);
  });
});

// Save changes back to the selected file
saveButton.addEventListener('click', function() {
  const filePath = path.join(directoryPath, fileSelector.value);
  const updatedJson = editor.get();
  
  fs.writeFile(filePath, JSON.stringify(updatedJson, null, 2), (err) => {
    if (err) {
      dialog.showErrorBox('Error saving file', 'Could not save the changes.');
      return;
    }

    dialog.showMessageBox({ message: 'File saved successfully.', buttons: ['OK'] });
  });
});
