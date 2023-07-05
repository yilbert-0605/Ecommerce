const request = require('supertest')
const app = require('../app')
const Product = require('../models/Product')
require('../models')

const BASE_URL_USER ='/api/v1/users/login'
const BASE_URL_CART = '/api/v1/cart'
let TOKEN
let userId
let product
let cartId

beforeAll(async()=>{
    const user = {
        email: "yilbertosorio06@gmail.com",
        password: "123456",
      };

      const res = await request(app)
      .post(BASE_URL_USER)
      .send(user)

      TOKEN = res.body.token
      userId = res.body.user.id
})

test("POST -> 'BASE_URL_CART, should return status code 201 and res.body.quantity === body.quantity", async()=>{

    const productBody ={
        title:"Iphone 12",
        description: "cell Iphone 12",
        price:"2.200"
    }

    product = await Product.create(productBody)

    const cartBody = {
        quantity: 1,
        userId,
        productId: product.id
    }

    const res = await request(app)
    .post(BASE_URL_CART)
    .send(cartBody)
    .set("Authorization", `Bearer ${TOKEN}`);

    cartId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body.quantity).toBe(cartBody.quantity)

})

test("GET -> 'URL_BASE', should return status code 200 and res.body to have length 1", async () => {
    const res = await request(app)
    .get(BASE_URL_CART)
    .set("Authorization", `Bearer ${TOKEN}`)
  
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
  });

  test("Put -> 'URL_BASE', should return status code 200", async () => {
    const cartBody = {
      quantity: 2
    };
    const res = await request(app)
      .put(`${BASE_URL_CART}/${cartId}`)
      .send(cartBody)
      .set("Authorization", `Bearer ${TOKEN}`);
  
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(cartBody.quantity);
  });

  test("DELETE -> 'BASE_URL/:id', should return status code 204", async () => {
    const res = await request(app)
      .delete(`${BASE_URL_CART}/${cartId}`)
      .set("Authorization", `Bearer ${TOKEN}`);
  
    expect(res.status).toBe(204);
    await product.destroy()
  });