const bcrypt = require("bcryptjs");

function hashValue(plainValue) {
  return bcrypt.hashSync(plainValue);
}
function verifyHash(userPass, hashedPass) {
  return bcrypt.compareSync(userPass, hashedPass);
}

module.exports = {
  hashValue,
  verifyHash,
};
