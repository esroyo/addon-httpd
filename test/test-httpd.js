/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { startServerAsync } = require('../httpd');
const tabs = require('sdk/tabs');
const { pathFor } = require('sdk/system');
const file = require('sdk/io/file');
const { cleanUI } = require("sdk/test/utils")

const basePath = pathFor("ProfD");
const port = 8099;
const host = 'http://localhost:' + port + '/';

function serve({ name, content }) {
  content = content || '<html><head><title>'+name+'</title></head><body></body></html>';
  let srv = startServerAsync(port, basePath);
  let pagePath = file.join(basePath, name + '.html');
  let pageStream = file.open(pagePath, 'w');
  pageStream.write(content);
  pageStream.close();
  return srv;
}

exports.testServer = function*(assert) {
  let title = "testServer";
  let server = serve({ name: title });
  let url = host + title + '.html';
  assert.pass("opening " + url);
  let tab = yield new Promise(resolve => {
    tabs.open({
      url: url,
      onReady: resolve
    });
  });
  assert.equal(tab.title, title, "the tab title is correct");
  yield cleanUI();
  yield new Promise(resolve => server.stop(resolve));
}

require('sdk/test').run(exports);
