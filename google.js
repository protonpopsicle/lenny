import 'dotenv/config';

import { run } from './db.js';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

const DOCUMENT_ID = process.env.G_DOCUMENT_ID;

const keys = JSON.parse(process.env.G_CREDS);
const auth = new GoogleAuth({
  credentials: keys,
  scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/documents'],
});
const client = await auth.getClient();

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
    const selection = await getDocText(client);
    return selection;
  } catch (err) {
    console.error('Error selecting document:', err);
    return null;
  }
}

run().catch(console.dir);

export { selection };