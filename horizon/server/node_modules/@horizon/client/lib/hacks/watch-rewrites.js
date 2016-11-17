"use strict";

exports.__esModule = true;
exports.default = watchRewrites;
/*
 Some common queries run on an entire collection or on a collection of
 indeterminate size. RethinkDB doesn't actually keep track of the
 ordering of these queries when sending changes. The initial changes
 will be ordered, but subsequent changes come in arbitrary order and
 don't respect the ordering of the query. So, for convenience, we add
 a very high limit so that the server will keep track of the order for
 us.

 Note: queries like collection.order(field).watch are not reasonable
 in production systems. You should add an explicit limit.
*/

function watchRewrites(self, query) {
  // The only query type at the moment that doesn't get these rewrites
  // is find, since it returns a single document
  if (query.find === undefined && query.order !== undefined && query.limit === undefined) {
    var limit = self.constructor.IMPLICIT_LIMIT || 100000;
    // Need to copy the object, since it could be reused
    return Object.assign({ limit: limit }, query);
  } else {
    return query;
  }
}
//# sourceMappingURL=watch-rewrites.js.map