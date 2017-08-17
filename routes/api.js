'use strict';

const express = require('express');
const router = express.Router();

require('./blog')(router);
require('./api_cdn')(router);

module.exports = router;