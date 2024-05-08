const os = require('os');

module.exports = {
  '*.{js,ts,tsx}': `eslint --cache --fix --cache-location=${os.tmpdir()}`,
};

