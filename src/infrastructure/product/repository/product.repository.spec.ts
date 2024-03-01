import { Sequelize } from "sequelize-typescript";

import ProductRepository from "./product.repository";

import Product from "../../../domain/product/entity/product";
import ProductModel from "./sequelize/product.model";


describe("Product repository tests", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);

    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "1" } });
    expect(productModel.toJSON()).toStrictEqual({
      id: "1",
      name: "Product 1",
      price: 100
    })
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);
    await productRepository.create(product);

    product.changeName("Product 2");
    product.changePrice(200);
    await productRepository.update(product);

    const productModel = await ProductModel.findOne({ where: { id: "1" } });
    expect(productModel.toJSON()).toStrictEqual({
      id: "1",
      name: "Product 2",
      price: 200
    })
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);
    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "1" } });

    const foundProduct = await productRepository.find("1");

    expect(productModel.toJSON()).toStrictEqual({
      id: foundProduct.id,
      name: foundProduct.name,
      price: foundProduct.price
    });
  });

  it("should find all products", async () => {
    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Product 1", 100);
    const product2 = new Product("2", "Product 2", 200);
    await productRepository.create(product1);
    await productRepository.create(product2);

    const foundProducts = await productRepository.findAll();
    const products = [ product1, product2]

    expect(products).toEqual(foundProducts);
  });

  it("should delete a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 100);
    await productRepository.create(product);

    await productRepository.delete("1");

    const productModel = await ProductModel.findOne({ where: { id: "1" } });
    expect(productModel).toBeNull();
  });

});