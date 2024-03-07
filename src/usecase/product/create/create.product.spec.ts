import { Sequelize } from "sequelize-typescript";
import CreateProductUseCase from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
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

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: "Product A",
      price: 10
    }

    const productCreated = await usecase.execute(input);

    const result = await productRepository.find(productCreated.id);

    expect(result.id).toEqual(productCreated.id);
    expect(result.name).toEqual(input.name);
    expect(result.price).toEqual(input.price);

  });
});
