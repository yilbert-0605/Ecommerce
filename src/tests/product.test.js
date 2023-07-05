const request = require("supertest");
const app = require("../app");
require("../models");
const Category = require("../models/Category");
const ProductImg = require("../models/ProductImg");

const BASE_URL_USERS = "/api/v1/users/login";
const BASE_URL_PRODUCTS = "/api/v1/products";
let TOKEN;
let category;
let productId;
let productImg;

beforeAll(async () => {
  const user = {
    email: "yilbertosorio06@gmail.com",
    password: "123456",
  };

  const res = await request(app).post(`${BASE_URL_USERS}`).send(user);

  TOKEN = res.body.token;
});

test("POST -> 'BASE_URL' should status code 201 and res.body.title === body.title", async () => {
  const categoryBody = {
    name: "Tecnologi",
  };

  category = await Category.create(categoryBody);

  const product = {
    title: "Iphone 12",
    description: "Iphone 12",
    price: "2.000",
    categoryId: category.id,
  };

  const res = await request(app)
    .post(BASE_URL_PRODUCTS)
    .send(product)
    .set("Authorization", `Bearer ${TOKEN}`);

  productId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body.title).toBe(product.title);
});

test("GET -> 'BASE_URL_PRODUCTS' should status code 200, res.body.length === 1 and res.body[0] to be defined", async () => {
  const res = await request(app).get(BASE_URL_PRODUCTS);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].productImgs).toBeDefined();
});

test("GET -> 'BASE_URL_PRODUCTS?category = category.id' should status code 200, res.body.length === 1 and res.body[0] to be defined", async () => {
  const res = await request(app).get(
    `${BASE_URL_PRODUCTS}?category=${category.id}`
  );

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].productImgs).toBeDefined();
});

test("GET ONE -> 'BASE_URL_PRODUCTS/:id' should status code 200 and res.body.title === Iphone 12", async () => {
  const res = await request(app).get(`${BASE_URL_PRODUCTS}/${productId}`);

  expect(res.status).toBe(200);
  expect(res.body.title).toBe("Iphone 12");
  expect(res.body.category).toBeDefined();
  expect(res.body.productImgs).toBeDefined();
});

test("PUT -> 'BASE_URL_PRODUCTS/:id' should status code 200 and res.body.title === body.title", async () => {
  const product = {
    title: "Iphone 13",
  };
  const res = await request(app)
    .put(`${BASE_URL_PRODUCTS}/${productId}`)
    .send(product)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body.title).toBe(product.title);
});

test("POST -> 'BASE_URL_PRODUCTS/:id/images', should return status code 200, and res.body.length === 1", async () => {
  const productImgBody = {
    url: "http://localhost:8080/api/v1/public/uploads/cocina.jpg",
    filename: "cocina.jpg",
    productId,
  };

  productImg = await ProductImg.create(productImgBody);

  const res = await request(app)
    .post(`${BASE_URL_PRODUCTS}/${productId}/images`)
    .send([productImg.id])
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("DELETE -> 'BASE_URL_PRODUCTS/:id' should status code 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL_PRODUCTS}/${productId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);

  await category.destroy();
  await productImg.destroy();
});
