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

const v4uuid = require("uuid/v4");

function createList (taskevo) {

  const api = taskevo.expressApp;
  const db = taskevo.db;
  const events = taskevo.events;
  const authz = taskevo.authz;

  const List = db.List;

  return function (req, res) {
    let listId = v4uuid();
    let list = List.forge({
      Id: listId,
      OwnerId: req.authUser.get("Id"),
      ParentId: req.body.ParentId || null,
      CategoryId: req.body.CategoryId || null,
      Title: req.body.Title || "New List",
      Created: Math.floor(Date.now()/1000),
    });

    list.save(null, {method: "insert"})
      .then(onCreateSuccess)
      .catch(onError);

    function onCreateSuccess (list) {
      let uri = `/list/${listId}`;
      events.emit("resource:created", uri, req.authUser.get("Id"));
      res.returnNewObject(list);
    }

    function onError (err) {
      res.status(400).send({ ErrorMsg: err.message });
    }
  }

}

module.exports = createList;
