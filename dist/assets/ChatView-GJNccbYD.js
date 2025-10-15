import{r as C,u as Z,e as tt,t as p,j as f}from"./index-D_bUWnp8.js";var M;(function(t){t.STRING="STRING",t.NUMBER="NUMBER",t.INTEGER="INTEGER",t.BOOLEAN="BOOLEAN",t.ARRAY="ARRAY",t.OBJECT="OBJECT"})(M||(M={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var L;(function(t){t.LANGUAGE_UNSPECIFIED="language_unspecified",t.PYTHON="python"})(L||(L={}));var G;(function(t){t.OUTCOME_UNSPECIFIED="outcome_unspecified",t.OUTCOME_OK="outcome_ok",t.OUTCOME_FAILED="outcome_failed",t.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"})(G||(G={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D=["user","model","function","system"];var U;(function(t){t.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",t.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",t.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",t.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",t.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT"})(U||(U={}));var H;(function(t){t.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE"})(H||(H={}));var j;(function(t){t.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",t.NEGLIGIBLE="NEGLIGIBLE",t.LOW="LOW",t.MEDIUM="MEDIUM",t.HIGH="HIGH"})(j||(j={}));var F;(function(t){t.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",t.SAFETY="SAFETY",t.OTHER="OTHER"})(F||(F={}));var O;(function(t){t.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",t.STOP="STOP",t.MAX_TOKENS="MAX_TOKENS",t.SAFETY="SAFETY",t.RECITATION="RECITATION",t.LANGUAGE="LANGUAGE",t.OTHER="OTHER"})(O||(O={}));var $;(function(t){t.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",t.RETRIEVAL_QUERY="RETRIEVAL_QUERY",t.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",t.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",t.CLASSIFICATION="CLASSIFICATION",t.CLUSTERING="CLUSTERING"})($||($={}));var K;(function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.AUTO="AUTO",t.ANY="ANY",t.NONE="NONE"})(K||(K={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h extends Error{constructor(e){super(`[GoogleGenerativeAI Error]: ${e}`)}}class I extends h{constructor(e,n){super(e),this.response=n}}class J extends h{constructor(e,n,s,o){super(e),this.status=n,this.statusText=s,this.errorDetails=o}}class m extends h{}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const et="https://generativelanguage.googleapis.com",nt="v1beta",st="0.15.0",ot="genai-js";var R;(function(t){t.GENERATE_CONTENT="generateContent",t.STREAM_GENERATE_CONTENT="streamGenerateContent",t.COUNT_TOKENS="countTokens",t.EMBED_CONTENT="embedContent",t.BATCH_EMBED_CONTENTS="batchEmbedContents"})(R||(R={}));class it{constructor(e,n,s,o,i){this.model=e,this.task=n,this.apiKey=s,this.stream=o,this.requestOptions=i}toString(){var e,n;const s=((e=this.requestOptions)===null||e===void 0?void 0:e.apiVersion)||nt;let i=`${((n=this.requestOptions)===null||n===void 0?void 0:n.baseUrl)||et}/${s}/${this.model}:${this.task}`;return this.stream&&(i+="?alt=sse"),i}}function at(t){const e=[];return t!=null&&t.apiClient&&e.push(t.apiClient),e.push(`${ot}/${st}`),e.join(" ")}async function rt(t){var e;const n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",at(t.requestOptions)),n.append("x-goog-api-key",t.apiKey);let s=(e=t.requestOptions)===null||e===void 0?void 0:e.customHeaders;if(s){if(!(s instanceof Headers))try{s=new Headers(s)}catch(o){throw new m(`unable to convert customHeaders value ${JSON.stringify(s)} to Headers: ${o.message}`)}for(const[o,i]of s.entries()){if(o==="x-goog-api-key")throw new m(`Cannot set reserved header name ${o}`);if(o==="x-goog-api-client")throw new m(`Header name ${o} can only be set using the apiClient field`);n.append(o,i)}}return n}async function ct(t,e,n,s,o,i){const a=new it(t,e,n,s,i);return{url:a.toString(),fetchOptions:Object.assign(Object.assign({},ft(i)),{method:"POST",headers:await rt(a),body:o})}}async function S(t,e,n,s,o,i,a=fetch){const{url:r,fetchOptions:c}=await ct(t,e,n,s,o,i);return lt(r,c,a)}async function lt(t,e,n=fetch){let s;try{s=await n(t,e)}catch(o){dt(o,t)}return s.ok||await ut(s,t),s}function dt(t,e){let n=t;throw t instanceof J||t instanceof m||(n=new h(`Error fetching from ${e.toString()}: ${t.message}`),n.stack=t.stack),n}async function ut(t,e){let n="",s;try{const o=await t.json();n=o.error.message,o.error.details&&(n+=` ${JSON.stringify(o.error.details)}`,s=o.error.details)}catch{}throw new J(`Error fetching from ${e.toString()}: [${t.status} ${t.statusText}] ${n}`,t.status,t.statusText,s)}function ft(t){const e={};if((t==null?void 0:t.timeout)>=0){const n=new AbortController,s=n.signal;setTimeout(()=>n.abort(),t.timeout),e.signal=s}return e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(t){return t.text=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),T(t.candidates[0]))throw new I(`${v(t)}`,t);return ht(t)}else if(t.promptFeedback)throw new I(`Text not available. ${v(t)}`,t);return""},t.functionCall=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),T(t.candidates[0]))throw new I(`${v(t)}`,t);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),B(t)[0]}else if(t.promptFeedback)throw new I(`Function call not available. ${v(t)}`,t)},t.functionCalls=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),T(t.candidates[0]))throw new I(`${v(t)}`,t);return B(t)}else if(t.promptFeedback)throw new I(`Function call not available. ${v(t)}`,t)},t}function ht(t){var e,n,s,o;const i=[];if(!((n=(e=t.candidates)===null||e===void 0?void 0:e[0].content)===null||n===void 0)&&n.parts)for(const a of(o=(s=t.candidates)===null||s===void 0?void 0:s[0].content)===null||o===void 0?void 0:o.parts)a.text&&i.push(a.text),a.executableCode&&i.push("\n```python\n"+a.executableCode.code+"\n```\n"),a.codeExecutionResult&&i.push("\n```\n"+a.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}function B(t){var e,n,s,o;const i=[];if(!((n=(e=t.candidates)===null||e===void 0?void 0:e[0].content)===null||n===void 0)&&n.parts)for(const a of(o=(s=t.candidates)===null||s===void 0?void 0:s[0].content)===null||o===void 0?void 0:o.parts)a.functionCall&&i.push(a.functionCall);if(i.length>0)return i}const gt=[O.RECITATION,O.SAFETY,O.LANGUAGE];function T(t){return!!t.finishReason&&gt.includes(t.finishReason)}function v(t){var e,n,s;let o="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)o+="Response was blocked",!((e=t.promptFeedback)===null||e===void 0)&&e.blockReason&&(o+=` due to ${t.promptFeedback.blockReason}`),!((n=t.promptFeedback)===null||n===void 0)&&n.blockReasonMessage&&(o+=`: ${t.promptFeedback.blockReasonMessage}`);else if(!((s=t.candidates)===null||s===void 0)&&s[0]){const i=t.candidates[0];T(i)&&(o+=`Candidate was blocked due to ${i.finishReason}`,i.finishMessage&&(o+=`: ${i.finishMessage}`))}return o}function A(t){return this instanceof A?(this.v=t,this):new A(t)}function Et(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var s=n.apply(t,e||[]),o,i=[];return o={},a("next"),a("throw"),a("return"),o[Symbol.asyncIterator]=function(){return this},o;function a(l){s[l]&&(o[l]=function(d){return new Promise(function(_,y){i.push([l,d,_,y])>1||r(l,d)})})}function r(l,d){try{c(s[l](d))}catch(_){u(i[0][3],_)}}function c(l){l.value instanceof A?Promise.resolve(l.value.v).then(g,E):u(i[0][2],l)}function g(l){r("next",l)}function E(l){r("throw",l)}function u(l,d){l(d),i.shift(),i.length&&r(i[0][0],i[0][1])}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Y=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function Ct(t){const e=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),n=vt(e),[s,o]=n.tee();return{stream:pt(s),response:_t(o)}}async function _t(t){const e=[],n=t.getReader();for(;;){const{done:s,value:o}=await n.read();if(s)return x(mt(e));e.push(o)}}function pt(t){return Et(this,arguments,function*(){const n=t.getReader();for(;;){const{value:s,done:o}=yield A(n.read());if(o)break;yield yield A(x(s))}})}function vt(t){const e=t.getReader();return new ReadableStream({start(s){let o="";return i();function i(){return e.read().then(({value:a,done:r})=>{if(r){if(o.trim()){s.error(new h("Failed to parse stream"));return}s.close();return}o+=a;let c=o.match(Y),g;for(;c;){try{g=JSON.parse(c[1])}catch{s.error(new h(`Error parsing JSON response: "${c[1]}"`));return}s.enqueue(g),o=o.substring(c[0].length),c=o.match(Y)}return i()})}}})}function mt(t){const e=t[t.length-1],n={promptFeedback:e==null?void 0:e.promptFeedback};for(const s of t){if(s.candidates)for(const o of s.candidates){const i=o.index;if(n.candidates||(n.candidates=[]),n.candidates[i]||(n.candidates[i]={index:o.index}),n.candidates[i].citationMetadata=o.citationMetadata,n.candidates[i].finishReason=o.finishReason,n.candidates[i].finishMessage=o.finishMessage,n.candidates[i].safetyRatings=o.safetyRatings,o.content&&o.content.parts){n.candidates[i].content||(n.candidates[i].content={role:o.content.role||"user",parts:[]});const a={};for(const r of o.content.parts)r.text&&(a.text=r.text),r.functionCall&&(a.functionCall=r.functionCall),r.executableCode&&(a.executableCode=r.executableCode),r.codeExecutionResult&&(a.codeExecutionResult=r.codeExecutionResult),Object.keys(a).length===0&&(a.text=""),n.candidates[i].content.parts.push(a)}}s.usageMetadata&&(n.usageMetadata=s.usageMetadata)}return n}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function X(t,e,n,s){const o=await S(e,R.STREAM_GENERATE_CONTENT,t,!0,JSON.stringify(n),s);return Ct(o)}async function W(t,e,n,s){const i=await(await S(e,R.GENERATE_CONTENT,t,!1,JSON.stringify(n),s)).json();return{response:x(i)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{text:t}]};if(t.text)return{role:"system",parts:[t]};if(t.parts)return t.role?t:{role:"system",parts:t.parts}}}function N(t){let e=[];if(typeof t=="string")e=[{text:t}];else for(const n of t)typeof n=="string"?e.push({text:n}):e.push(n);return Rt(e)}function Rt(t){const e={role:"user",parts:[]},n={role:"function",parts:[]};let s=!1,o=!1;for(const i of t)"functionResponse"in i?(n.parts.push(i),o=!0):(e.parts.push(i),s=!0);if(s&&o)throw new h("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!s&&!o)throw new h("No content is provided for sending chat message.");return s?e:n}function yt(t,e){var n;let s={model:e==null?void 0:e.model,generationConfig:e==null?void 0:e.generationConfig,safetySettings:e==null?void 0:e.safetySettings,tools:e==null?void 0:e.tools,toolConfig:e==null?void 0:e.toolConfig,systemInstruction:e==null?void 0:e.systemInstruction,cachedContent:(n=e==null?void 0:e.cachedContent)===null||n===void 0?void 0:n.name,contents:[]};const o=t.generateContentRequest!=null;if(t.contents){if(o)throw new m("CountTokensRequest must have one of contents or generateContentRequest, not both.");s.contents=t.contents}else if(o)s=Object.assign(Object.assign({},s),t.generateContentRequest);else{const i=N(t);s.contents=[i]}return{generateContentRequest:s}}function q(t){let e;return t.contents?e=t:e={contents:[N(t)]},t.systemInstruction&&(e.systemInstruction=Q(t.systemInstruction)),e}function It(t){return typeof t=="string"||Array.isArray(t)?{content:N(t)}:t}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],Ot={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};function At(t){let e=!1;for(const n of t){const{role:s,parts:o}=n;if(!e&&s!=="user")throw new h(`First content should be with role 'user', got ${s}`);if(!D.includes(s))throw new h(`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(D)}`);if(!Array.isArray(o))throw new h("Content should have 'parts' property with an array of Parts");if(o.length===0)throw new h("Each Content should have at least one part");const i={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const r of o)for(const c of k)c in r&&(i[c]+=1);const a=Ot[s];for(const r of k)if(!a.includes(r)&&i[r]>0)throw new h(`Content with role '${s}' can't contain '${r}' part`);e=!0}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P="SILENT_ERROR";class Nt{constructor(e,n,s,o){this.model=n,this.params=s,this.requestOptions=o,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=e,s!=null&&s.history&&(At(s.history),this._history=s.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(e){var n,s,o,i,a,r;await this._sendPromise;const c=N(e),g={safetySettings:(n=this.params)===null||n===void 0?void 0:n.safetySettings,generationConfig:(s=this.params)===null||s===void 0?void 0:s.generationConfig,tools:(o=this.params)===null||o===void 0?void 0:o.tools,toolConfig:(i=this.params)===null||i===void 0?void 0:i.toolConfig,systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,cachedContent:(r=this.params)===null||r===void 0?void 0:r.cachedContent,contents:[...this._history,c]};let E;return this._sendPromise=this._sendPromise.then(()=>W(this._apiKey,this.model,g,this.requestOptions)).then(u=>{var l;if(u.response.candidates&&u.response.candidates.length>0){this._history.push(c);const d=Object.assign({parts:[],role:"model"},(l=u.response.candidates)===null||l===void 0?void 0:l[0].content);this._history.push(d)}else{const d=v(u.response);d&&console.warn(`sendMessage() was unsuccessful. ${d}. Inspect response object for details.`)}E=u}),await this._sendPromise,E}async sendMessageStream(e){var n,s,o,i,a,r;await this._sendPromise;const c=N(e),g={safetySettings:(n=this.params)===null||n===void 0?void 0:n.safetySettings,generationConfig:(s=this.params)===null||s===void 0?void 0:s.generationConfig,tools:(o=this.params)===null||o===void 0?void 0:o.tools,toolConfig:(i=this.params)===null||i===void 0?void 0:i.toolConfig,systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,cachedContent:(r=this.params)===null||r===void 0?void 0:r.cachedContent,contents:[...this._history,c]},E=X(this._apiKey,this.model,g,this.requestOptions);return this._sendPromise=this._sendPromise.then(()=>E).catch(u=>{throw new Error(P)}).then(u=>u.response).then(u=>{if(u.candidates&&u.candidates.length>0){this._history.push(c);const l=Object.assign({},u.candidates[0].content);l.role||(l.role="model"),this._history.push(l)}else{const l=v(u);l&&console.warn(`sendMessageStream() was unsuccessful. ${l}. Inspect response object for details.`)}}).catch(u=>{u.message!==P&&console.error(u)}),E}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function St(t,e,n,s){return(await S(e,R.COUNT_TOKENS,t,!1,JSON.stringify(n),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tt(t,e,n,s){return(await S(e,R.EMBED_CONTENT,t,!1,JSON.stringify(n),s)).json()}async function wt(t,e,n,s){const o=n.requests.map(a=>Object.assign(Object.assign({},a),{model:e}));return(await S(e,R.BATCH_EMBED_CONTENTS,t,!1,JSON.stringify({requests:o}),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V{constructor(e,n,s){this.apiKey=e,n.model.includes("/")?this.model=n.model:this.model=`models/${n.model}`,this.generationConfig=n.generationConfig||{},this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=Q(n.systemInstruction),this.cachedContent=n.cachedContent,this.requestOptions=s||{}}async generateContent(e){var n;const s=q(e);return W(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(n=this.cachedContent)===null||n===void 0?void 0:n.name},s),this.requestOptions)}async generateContentStream(e){var n;const s=q(e);return X(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(n=this.cachedContent)===null||n===void 0?void 0:n.name},s),this.requestOptions)}startChat(e){var n;return new Nt(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(n=this.cachedContent)===null||n===void 0?void 0:n.name},e),this.requestOptions)}async countTokens(e){const n=yt(e,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent});return St(this.apiKey,this.model,n,this.requestOptions)}async embedContent(e){const n=It(e);return Tt(this.apiKey,this.model,n,this.requestOptions)}async batchEmbedContents(e){return wt(this.apiKey,this.model,e,this.requestOptions)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(e){this.apiKey=e}getGenerativeModel(e,n){if(!e.model)throw new h("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new V(this.apiKey,e,n)}getGenerativeModelFromCachedContent(e,n){if(!e.name)throw new m("Cached content must contain a `name` field.");if(!e.model)throw new m("Cached content must contain a `model` field.");const s={model:e.model,tools:e.tools,toolConfig:e.toolConfig,systemInstruction:e.systemInstruction,cachedContent:e};return new V(this.apiKey,s,n)}}const b=void 0,Mt=()=>{const[t,e]=C.useState([]),[n,s]=C.useState(""),[o,i]=C.useState(!1),a=C.useRef(null),r=C.useRef(null),{language:c}=Z(),{showToast:g}=tt(),E=C.useMemo(()=>new bt(b),[b]),u=C.useCallback(()=>{a.current=E.getGenerativeModel({model:"gemini-1.5-flash"}).startChat({systemInstruction:{role:"model",parts:[{text:p.chat_system_instruction[c]}]}})},[E,c]);C.useEffect(()=>{{console.error("VITE_GEMINI_API_KEY não foi encontrada. Crie um arquivo .env.local e adicione a variável."),g("A chave da API para o chat não está configurada."),e([{role:"model",text:"Erro de configuração. O serviço de chat está indisponível."}]);return}},[c,u,g,b]),C.useEffect(()=>{var d;(d=r.current)==null||d.scrollIntoView({behavior:"smooth"})},[t]);const l=C.useCallback(async d=>{if(d.preventDefault(),!n.trim()||o)return;const _={role:"user",text:n};if(e(y=>[...y,_]),s(""),i(!0),a.current)try{const w=(await a.current.sendMessage(_.text)).response;e(z=>[...z,{role:"model",text:w.text()}])}catch(y){console.error("Error sending message:",y),e(w=>[...w,{role:"model",text:p.chat_error[c]}]),g(p.error_generic[c])}finally{i(!1)}},[n,o,c,g,a]);return f.jsxs("div",{className:"chat-view-container",children:[f.jsxs("div",{className:"chat-messages",children:[t.map((d,_)=>f.jsx("div",{className:`chat-message-wrapper ${d.role}`,children:f.jsxs("div",{className:`chat-bubble ${d.role}`,children:[d.role==="model"&&f.jsx("div",{className:"chat-bubble-header",children:p.nav_chat[c]}),f.jsxs("p",{children:[d.text,o&&d.role==="model"&&_===t.length-1&&f.jsx("span",{className:"typing-cursor"})]})]})},_)),o&&t.length>0&&t[t.length-1].role==="user"&&f.jsx("div",{className:"chat-message-wrapper model",children:f.jsxs("div",{className:"chat-bubble model",children:[f.jsx("div",{className:"chat-bubble-header",children:p.nav_chat[c]}),f.jsx("p",{children:f.jsx("span",{className:"typing-cursor"})})]})}),f.jsx("div",{ref:r})]}),f.jsxs("form",{className:"chat-input-form",onSubmit:l,children:[f.jsx("input",{type:"text",value:n,onChange:d=>s(d.target.value),placeholder:p.chat_input_placeholder[c].replace("{chatBotName}",p.nav_chat[c]),disabled:o}),f.jsx("button",{type:"submit",disabled:o||!n.trim(),"aria-label":p.send_message_aria[c],children:f.jsx("i",{className:"material-icons",children:"send"})})]})]})};export{Mt as default};
