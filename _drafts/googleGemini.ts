/** googleAuth
 *
 * Description
 *   - A Class For Google Gemini
 *
 * Functions
 *   [X]
 *
 * Usages
 *   -
 *
 * Requirements
 *   - npm install @google/generative-ai
 *   - npm install -D dotenv jnj-lib-base jnj-lib-doc
 *
 * References
 *   - https://ai.google.dev/tutorials/get_started_node?hl=ko
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */

// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules

// import Path from 'path';

// ? External Modules
// // import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';

// ? UserMade Modules
// import { loadJson, saveJson } from '../base/index.js';
import { loadYaml } from '../doc/index.js';


// & Class AREA
// &---------------------------------------------------------------------------
export class GoogleGemini {
  apiKey;
  genAI;
  model;

  // generationConfig = {
  //   stopSequences: ["red"],
  //   maxOutputTokens: 200,
  //   temperature: 0,
  //   topP: 0.1,
  //   topK: 16,
  // },

  // & CONSTRUCTOR
  constructor({
    user = 'bigwhitekmc',
    model = 'gemini-1.0-pro',
    accountYaml = `C:/JnJ-soft/Developments/_Settings/Apis/ai/gemini/accounts.yaml`,
    generationConfig = {
      temperature: 0,
      topP: 0.1,
      topK: 16,
    },
  } = {}) {
    // "gemini-pro"
    const accounts: any = loadYaml(accountYaml);
    this.apiKey = accounts[user]['api_key'];
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model, generationConfig });
  }

  // &
  answer = async (prompt: string) => {
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };
}
