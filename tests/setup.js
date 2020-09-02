jest.setTimeout(30000);

require("../models/User");

const mongoose = require("mongoose");
const keys = require("../config/keys");

// telling mongoose to make use of the node js global promise object
mongoose.Promise = global.Promise;
//useMongoClient to avoid depreceation warning
mongoose.connect(keys.mongoURI);
