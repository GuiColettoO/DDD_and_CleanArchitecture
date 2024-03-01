export interface InputListProductDto {}

type Prodcut = {
  id: string;
  name: string;
  price: number;
}

export interface OutputListProductDto {
  products: Prodcut[];
}
