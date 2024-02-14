const express = require("express");
const app = express();

if (!process.env.PORT) {
  console.error("PORT environment variable is not defined");
  process.exit(1);
}

let trustProxy = process.env.TRUST_PROXY;

// Boolean mode
// If true, the client’s IP address is understood as the left-most entry in the X-Forwarded-* header.
// If false, the app is understood as directly facing the Internet and the client’s IP address is derived from req.connection.remoteAddress. This is the default setting.
if (trustProxy === "true" || trustProxy === "TRUE") {
  trustProxy = true;
} else if (trustProxy === "false" || trustProxy === "FALSE") {
  trustProxy = false;
} else if (isNumber(trustProxy)) {
  // Number
  // Trust the nth hop from the front-facing proxy server as the client.
  trustProxy = parseInt(trustProxy);
} else if (typeof trustProxy === "string" && trustProxy.includes(",")) {
  // String containing comma-separated values
  // an array of IP addresses, and subnets to trust
  trustProxy = trustProxy.split(","); // parse to array
} else if (typeof trustProxy === "string") {
  // String: An IP address or subnet to trust.
  trustProxy = trustProxy;
}

if (trustProxy !== undefined) {
  app.set("trust proxy", trustProxy);
}

app.get("/", (req, res) => {
  const message = `Using trust proxy: ${trustProxy}. IP address: ${req.ip}`;
  res.status(200).send(message);
});

app.listen(process.env.PORT, () => {
  console.log(`Express server listening on port ${process.env.PORT}`);
});

function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}
