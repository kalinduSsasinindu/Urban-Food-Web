export enum CategoryType {
  FRUITS = 'Fruits',
  VEGETABLES = 'Vegetables',
  DAIRY_PRODUCTS = 'Dairy Products',
  BAKED_GOODS = 'Baked Goods',
  HANDMADE_CRAFTS = 'Handmade Crafts'
}

export interface Category {
  type: CategoryType;
  displayName: string;
  icon: string;
  route: string;
}

export const CATEGORIES: Category[] = [
  {
    type: CategoryType.FRUITS,
    displayName: 'Fruits',
    icon: 'fa-apple-alt',
    route: '/category/fruits'
  },
  {
    type: CategoryType.VEGETABLES,
    displayName: 'Vegetables',
    icon: 'fa-carrot',
    route: '/category/vegetables'
  },
  {
    type: CategoryType.DAIRY_PRODUCTS,
    displayName: 'Dairy Products',
    icon: 'fa-cheese',
    route: '/category/dairy-products'
  },
  {
    type: CategoryType.BAKED_GOODS,
    displayName: 'Baked Goods',
    icon: 'fa-bread-slice',
    route: '/category/baked-goods'
  },
  {
    type: CategoryType.HANDMADE_CRAFTS,
    displayName: 'Handmade Crafts',
    icon: 'fa-paint-brush',
    route: '/category/handmade-crafts'
  }
]; 