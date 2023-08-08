/* global forge */
/* global axios */

import { arrayBufferToBinaryString } from "./util.js";

const generateRandomBytes = (len) => {
  let buffer = new Uint8Array(len);
  crypto.getRandomValues(buffer);
  return buffer;
};

const getPasswordkey = (key) => {
  const enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
};

const getderivedKey = async (salt, callback, enc_key) => {
  const algo_options = {
    name: "PBKDF2",
    salt: salt,
    iterations: 100000,
    hash: "SHA-256",
  };
  const passwordKey = await callback(enc_key);
  const derivedKey = await window.crypto.subtle.deriveKey(
    algo_options,
    passwordKey,
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  return derivedKey;
};

const encryptMessage = (algorithm, text, key, iv) => {
  let enc = new TextEncoder();
  const cipher = forge.cipher.createCipher(algorithm, key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(enc.encode(text)));
  cipher.finish();
  return cipher.output.toHex();
};
const deriveKey = async (password, salt, iterations, length) => {
  const cryptokey = await getderivedKey(salt, getPasswordkey, password);
  const exportedKey = await window.crypto.subtle.exportKey("raw", cryptokey);
  const key = arrayBufferToBinaryString(new Uint8Array(exportedKey));
  // const md = forge.md.sha256.create();
  // const key = forge.pkcs5.pbkdf2(password, salt, iterations, length / 8, md);
  return key;
};

export { deriveKey, encryptMessage };
