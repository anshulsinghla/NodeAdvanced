const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  const sessionObject = {
    passport: {
      user: user._id.toString(),
    },
  };

  // converting to base64 string
  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");

  // creating signature
  const sig = keygrip.sign("session=" + session);
  return { session, sig };
};
