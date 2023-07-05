const request = require("supertest");
const app = require("../app");
require("../models");

const BASE_URL_USERS = "/api/v1/users/login";
const BASE_URL = "/api/v1/categories";
let TOKEN
let categoryId

beforeAll(async () => {
  const user = {
    email: "yilbertosorio06@gmail.com",
    password: "123456",
  };

  const res = await request(app)
  .post(BASE_URL_USERS)
  .send(user);

  TOKEN = res.body.token;
});

test("POST -> 'BASE_URL, should return status code 201 and res.body.name === body.name", async () => {
  const category = {
    name: "Phone",
  };

  const res = await request(app)
    .post(BASE_URL)
    .send(category)
    .set("Authorization", `Bearer ${TOKEN}`);

  categoryId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.name).toBe(category.name);
});

test("Get -> 'BASE_URL, should return status code 200 and res.body.length === 1", async () => {
  const res = await request(app)
  .get(BASE_URL);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);

});

test("DELETE -> 'BASE_URL, should return status code 204 and res.body === body.name", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${categoryId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);

});
