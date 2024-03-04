import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for customer", () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  })

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const response = await request(app)
    .post("/customer")
    .send({
      name: "John Doe",
      address: {
        street: "Main St",
        number: 123,
        zip: "12345",
        city: "Anytown",
      }
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John Doe");
    expect(response.body.address.street).toBe("Main St");
    expect(response.body.address.number).toBe(123);
    expect(response.body.address.zip).toBe("12345");
    expect(response.body.address.city).toBe("Anytown");

  });

  it("should not create a customer", async() => {
    const response = await request(app)
    .post("/customer")
    .send({
      name: "John Doe",
    })
    expect(response.status).toBe(500);
  })
})
