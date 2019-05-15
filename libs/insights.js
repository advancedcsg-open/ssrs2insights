const fetch = require("node-fetch");
const config = require("config").Insights;

function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  const m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

const send = async (recordset) => {
  return fetch(config.hostname, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": lengthInUtf8Bytes(data),
      "X-Insert-Key": myConfig.insertKey
    },
    body: JSON.stringify(recordset)
  })
}
