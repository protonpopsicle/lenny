import {promises as fs} from 'fs'
import * as path from 'path'
import * as process from 'process'

import {authenticate} from '@google-cloud/local-auth'
import {google} from 'googleapis'

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
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
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
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

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
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

/*
Returns the text in the given ParagraphElement.
Args:
  element: a ParagraphElement from a Google Doc.
*/
function read_paragraph_element(element) {
    if ('textRun' in element == false) {
	return ''
    }
    return element['textRun']['content']
}

/*
Recurses through a list of Structural Elements to read a document's text where text may be in nested elements.
Args:
  elements: a list of Structural Elements.
*/
function read_structural_elements(elements) {
    let text = ''
    for (const value of elements) {
	if ('paragraph' in value) {
	    elements = value['paragraph']['elements']
	    for (const elem of elements) {
		text += read_paragraph_element(elem)
	    }
	}
    }
    return text
}

function is_whitespace(str) {
    return str.trim().length === 0;
}

function getRandomItem(arr) {
  // Get random index  
  const randIndex = Math.floor(Math.random() * arr.length);

  // Return random element
  return arr[randIndex];
}

async function getDocText(auth) {
    const docs = google.docs({version: 'v1', auth});
    const res = await docs.documents.get({
	documentId: '1yoFCP-pb3JWQAN_dytSzY_hQPh4p9_UJ_JQGxkj5oo0',
    });
    const text = read_structural_elements(res.data.body.content)    
    const lines = text.split(/\r?\n/);
    const filtered_lines = lines.filter(function(value) {
	return !is_whitespace(value);
    });
    console.log(`got ${filtered_lines.length} items`)
    const selection = getRandomItem(filtered_lines)
    console.log(selection);
    return selection
}

async function selection() {
    const auth = await authorize()
    const selection = await getDocText(auth)
    return selection
}

export { selection }
