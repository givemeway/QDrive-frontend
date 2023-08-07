const arrayBufferToHex = (buffer) => {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const generateRandomBytes = (len) => {
  let buffer = new Uint8Array(len);
  crypto.getRandomValues(buffer);
  return buffer;
};

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const arrayBufferToBinaryString = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binaryString = "";
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return binaryString;
};

const binaryStringToArrayBuffer = (binaryString) => {
  let buffer = new ArrayBuffer(binaryString.length);
  let view = new Uint8Array(buffer);
  for (let i = 0; i < binaryString.length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }
  return buffer;
};

const hexToBuffer = (hexString) => {
  let byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
};

async function streamDownloadDecryptToDisk(url, cipher) {
  // create readable stream for ciphertext
  let size;
  let rs_src = fetch(url).then((response) => {
    size = response.headers.get("content-length");
    return response.body;
  });

  // create writable stream for file
  let ws_dest = window
    .showSaveFilePicker()
    .then((handle) => handle.createWritable());

  // create transform stream for decryption
  let ts_dec = new TransformStream({
    async transform(chunk, controller) {
      size = size - chunk.length;
      cipher.update(forge.util.createBuffer(chunk));
      if (size === 0) {
        cipher.finish();
      }
      const decryptedChunk = cipher.output.getBytes();
      const arrBuffer = binaryStringToArrayBuffer(decryptedChunk);
      controller.enqueue(arrBuffer);
    },
  });

  // stream cleartext to file
  let rs_clear = rs_src.then((s) => s.pipeThrough(ts_dec));
  return (await rs_clear).pipeTo(await ws_dest);
}

export {
  arrayBufferToBase64,
  binaryStringToArrayBuffer,
  generateRandomBytes,
  arrayBufferToHex,
  arrayBufferToBinaryString,
  hexToBuffer,
  streamDownloadDecryptToDisk,
};
