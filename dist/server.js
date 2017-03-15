'use strict';

var _graphql = require('graphql');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var query = '{\n  kitscon(id: "17.1"){\n    id,\n    date,\n    attendees {\n      id,\n      name,\n      talk {\n        title\n      }\n    },\n    talks {\n      id,\n      title,\n      talker {\n        id,\n        name\n      }\n    }\n  }\n}';

var run = function run(query) {
  (0, _graphql.graphql)(_schema2.default, query).then(function (result) {
    console.log(JSON.stringify(result, null, 2));
  });
};

run(query);