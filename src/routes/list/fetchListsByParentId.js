/**
 * Copyright (c) 2019 Callan Peter Milne
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

function fetchListsByParentId (taskevo) {

  const api = taskevo.expressApp;
  const db = taskevo.db;
  const events = taskevo.events;
  const authz = taskevo.authz;

  return function (req, res) {
    let parentId = req.params.parentId;
    let userId = req.authUser.get("Id");
    let parentListUri = `/list/${parentId}`;

    authz.verifyOwnership(parentListUri, userId)
      .then(fetchListsByParentId)
      .then(returnLists)
      .catch(onError);

    function fetchListsByParentId () {
      return db.fetchListsByParentId(parentId);
    }

    function returnLists (lists) {
      res.status(200).send(lists);
    }

    function onError (err) {
      res.status(500).send({ ErrorMsg: err.message });
    }
  }

}

module.exports = fetchListsByParentId;
