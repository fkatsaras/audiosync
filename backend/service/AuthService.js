'use strict';


/**
 * Check if a user is logged in
 * Verify if the current session has a logged-in user
 *
 * returns ApiResponse
 **/
exports.check_login = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "code" : 0,
  "type" : "type",
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

