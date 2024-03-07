import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../../infrastructure/product/repository/product.repository";

describe("Test find product use case", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
      sequelize = new Sequelize({
          dialect: "sqlite",
          storage: ":memory:",
          logging: false,
          sync: { force: true },
      });

      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
  });

  afterEach(async () => {
      await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("1", "Product A", 10);

    await productRepository.create(product);

    product.changeName("Product A Updated");
    product.changePrice(12);

    const productCreated = await usecase.execute(product);

    const result = await productRepository.find(productCreated.id);

    expect(result.name).toEqual(product.name);
    expect(result.price).toEqual(product.price);

  });
});
