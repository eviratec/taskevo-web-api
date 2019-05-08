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

module.exports = function () {

  const DBS = [

    // ??? Domain
    "Category",
    "List",

    // User Domain
    "Auth",
    "Hash",
    "ResourceOwner",
    "Resource",
    "Token",
    "User",

  ];

  let connection = {
    host: process.env.TASKEVO_DB_HOST,
    user: process.env.TASKEVO_DB_USER,
    password: process.env.TASKEVO_DB_PASS,
    database: process.env.TASKEVO_DB_NAME,
    charset: 'utf8',
  };

  if (process.env.TASKEVO_SOCKET) {
    // TASKEVO_SOCKET=/Applications/MAMP/tmp/mysql/mysql.sock
    connection.socketPath = process.env.TASKEVO_SOCKET;
  }

  const knex = require('knex')({
    client: 'mysql',
    connection: connection,
  });

  const bookshelf = require('bookshelf')(knex);

  const db = {};

  Object.defineProperties(db, {
    _knex: {
      value: knex,
    },
    _bookshelf: {
      value: bookshelf,
    },
  });

  DBS.forEach(t => {
    require(`./db/${t}`)(db);
  });

  return db;

};
