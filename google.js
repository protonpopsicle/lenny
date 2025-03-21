import { promises as fs } from 'fs';
import * as path from 'path';
import * as process from 'process';

import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'credentials', 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials', 'credentials.json');

const DOCUMENT_ID = '1yoFCP-pb3JWQAN_dytSzY_hQPh4p9_UJ_JQGxkj5oo0';

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function checkCredentialsExist() {
  try {
    await fs.access(CREDENTIALS_PATH);
  } catch (error) {
    throw new Error('credentials.json is missing. Please set up Google OAuth credentials.');
  }
}

/**
 * Load or request or authorization to call APIs.
 */
async function authorize() {
  await checkCredentialsExist();
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Returns the text in the given ParagraphElement.
 */
function readParagraphElement(element) {
  if (!('textRun' in element)) {
    return '';
  }
  return element.textRun.content;
}

/**
 * Recurses through a list of Structural Elements to read a document's text where text may be in nested elements.
 */
function readStructuralElements(elements) {
  let text = '';
  for (const value of elements) {
    if ('paragraph' in value) {
      const elements = value.paragraph.elements;
      for (const elem of elements) {
        text += readParagraphElement(elem);
      }
    }
  }
  return text;
}

function isWhitespace(str) {
  return str.trim().length === 0;
}

function getRandomItem(arr) {
  if (!arr.length) {
    throw new Error('Cannot select from empty array');
  }
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
}

async function getDocText(auth) {
  try {
    const docs = google.docs({ version: 'v1', auth });
    const res = await docs.documents.get({
      documentId: DOCUMENT_ID,
    });
    
    const text = readStructuralElements(res.data.body.content);
    const lines = text.split(/\r?\n/);
    const filteredLines = lines.filter(line => !isWhitespace(line));
    
    if (!filteredLines.length) {
      throw new Error('No valid lines found in document');
    }
    
    return getRandomItem(filteredLines);
  } catch (error) {
    throw new Error(`Failed to get document text: ${error.message}`);
  }
}

async function selection() {
  try {
    const auth = await authorize();
    const selection = await getDocText(auth);
    return selection;
  } catch (err) {
    console.error('Error selecting document:', err);
    return null;
  }
}

export { selection };
