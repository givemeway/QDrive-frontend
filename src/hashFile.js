/*global forge*/
const chunkSize = 1024 * 1024 * 100;

const hashFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrBuffer = event.target.result;
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      resolve(hashHex);
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsArrayBuffer(file);
  });
};

const hashChunk = async (arrBuffer) => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const hashFileChunked = async (file, size) => {
  return new Promise((resolve, reject) => {
    let hash = forge.md.sha256.create();
    let currentChunk = 0;

    let reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      hash.update(data);
      currentChunk++;
      if (currentChunk < size / chunkSize) {
        loadNextChunk();
      } else {
        const result = hash.digest().toHex();
        resolve(result);
      }
    };

    reader.onerror = (event) => {
      reject(event.target.error);
    };

    const loadNextChunk = () => {
      let start = currentChunk * chunkSize;
      let end = Math.min(start + chunkSize, size);
      reader.readAsBinaryString(file.slice(start, end));
    };

    loadNextChunk();
  });
};

export { hashChunk, hashFileChunked, hashFile };
