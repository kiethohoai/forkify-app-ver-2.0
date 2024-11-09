import { TIMEOUT_SEC } from './config.js';

/* === timeout === */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/* === getJSON === */
export const getJSON = async function (url) {
  try {
    // const res = await fetch(url);
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok)
      throw Error(`${data.message} ${res.statusText}  ${res.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};

// TODO: sendJSON
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    return data;
    if (!res.ok)
      throw Error(`${data.message} ${res.statusText}  ${res.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};
