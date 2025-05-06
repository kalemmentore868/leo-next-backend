export interface Category {
  category_id: string;
  name: string;
  description: string;
  iconName: string;
  image_url: string;
  order: number;
}

export interface Subcategory {
  subcategory_id: string; // Firebase document ID
  category_id: string;
  name: string;
  iconName: string;
  image_url: string;
  order: number;
}
