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

describe("LIST REST API", function () {

  let api;

  let userId;
  let authorization;

  let login;
  let password;

  let $testClient;

  beforeEach(function (done) {

    api = jasmine.startTestApi();
    $testClient = jasmine.createTestClient();

    login = $testClient.uniqueLogin();
    password = $testClient.generatePassword();

    $testClient.initUser(login, password, function (err, d) {
      if (err) return done(err);
      userId = d.UserId;
      authorization = d.TokenKey;
      done();
    });

  });

  afterEach(function (done) {
    api.server.close(done);
  });

  describe("/lists", function () {

    let categoryData;
    let category;
    let categoryId;

    let listData;

    beforeEach(function (done) {
      listData = {
        Name: "My Test List",
      };
      categoryData = {
        Name: "My Test Category",
      };
      $testClient.$post(authorization, `/categories`, categoryData, function (err, res) {
        category = res.d;
        categoryId = category.Id;

        listData.CategoryId = categoryId;

        done();
      });
    });

    describe("[createList] POST /lists", function () {

      describe("creating top-level lists", function () {

        it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
          $testClient.$post(null, `/lists`, listData, function (err, res) {
            expect(res.statusCode).toBe(403);
            done();
          });
        });

        it("RETURNS `HTTP/1.1 200 OK` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            expect(res.statusCode).toBe(200);
            done();
          });
        });

        it("RETURNS AN OBJECT IN THE RESPONSE BODY FOR A SUCCESSFUL REQUEST", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.any(Object));
            done();
          });
        });

        it("RETURNS AN `Id` PROPERTY IN THE RESPONSE BODY OBJECT FOR A SUCCESSFUL REQUEST", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.objectContaining({
              "Id": jasmine.any(String),
            }));
            done();
          });
        });

        it("CREATES A LIST REACHABLE USING THE `Id` PROPERTY IN THE RESPONSE BODY", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/list/${listId}`, function (err, res) {
              expect(res.statusCode).toBe(200);
              done();
            });
          });
        });

        it("ADDS THE LIST TO THE CATEGORY'S LISTS PROPERTY", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/category/${categoryId}`, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.objectContaining({
                "Lists": jasmine.arrayContaining([
                  jasmine.objectContaining({
                    "Id": listId,
                  }),
                ]),
              }));
              done();
            });
          });
        });

        it("ADDS THE LIST TO THE CATEGORY'S LIST OF LISTS", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/category/${categoryId}/lists`, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.arrayContaining([
                jasmine.objectContaining({
                  "Id": listId,
                }),
              ]));
              done();
            });
          });
        });

      });

      describe("creating nested lists", function () {

        let parentListData;
        let parentList;
        let parentListId;

        let childListData;

        beforeEach(function (done) {
          childListData = {
            Name: "My Test Child List",
          };
          parentListData = {
            Name: "My Test Parent List",
          };
          $testClient.$post(authorization, `/lists`, parentListData, function (err, res) {
            parentList = res.d;
            parentListId = parentList.Id;

            childListData.ParentId = parentListId;

            done();
          });
        });

        it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
          $testClient.$post(null, `/lists`, childListData, function (err, res) {
            expect(res.statusCode).toBe(403);
            done();
          });
        });

        it("RETURNS `HTTP/1.1 200 OK` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            expect(res.statusCode).toBe(200);
            done();
          });
        });

        it("RETURNS AN OBJECT IN THE RESPONSE BODY FOR A SUCCESSFUL REQUEST", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.any(Object));
            done();
          });
        });

        it("RETURNS AN `Id` PROPERTY IN THE RESPONSE BODY OBJECT FOR A SUCCESSFUL REQUEST", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.objectContaining({
              "Id": jasmine.any(String),
            }));
            done();
          });
        });

        it("CREATES A LIST REACHABLE USING THE `Id` PROPERTY IN THE RESPONSE BODY", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/list/${listId}`, function (err, res) {
              expect(res.statusCode).toBe(200);
              done();
            });
          });
        });

        it("ADDS THE LIST TO THE PARENT'S LISTS PROPERTY", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/list/${parentListId}`, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.objectContaining({
                "Lists": jasmine.arrayContaining([
                  jasmine.objectContaining({
                    "Id": listId,
                  }),
                ]),
              }));
              done();
            });
          });
        });

        it("ADDS THE LIST TO THE PARENTS'S LIST OF LISTS", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/list/${parentListId}/lists`, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.arrayContaining([
                jasmine.objectContaining({
                  "Id": listId,
                }),
              ]));
              done();
            });
          });
        });

      });

    });

  });

});
