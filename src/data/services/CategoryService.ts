import { Category, Subcategory } from "@/src/types/Category";
import { customAuthFetch } from "./util";

export class CategoryService {
  /**
   * Fetch all categories from the backend and optionally sort them by `order` or `name`.
   *
   * @param token - Auth token for authenticated request
   * @param sortBy - Optional field to sort by ('order' or 'name')
   * @returns Promise<Category[]>
   */
  static async getAllCategories(token: string): Promise<Category[]> {
    try {
      const categories = await customAuthFetch("categories", "GET", token);

      if (!Array.isArray(categories)) return [];

      return categories;
    } catch (err: any) {
      console.error("Error getting categories: ", err.message);
      return [];
    }
  }

  static async getAllSubcategories(
    token: string,
    category_id: string
  ): Promise<Subcategory[]> {
    try {
      const subcategories = await customAuthFetch(
        `subcategories/${category_id}`,
        "GET",
        token
      );

      if (!Array.isArray(subcategories)) return [];

      return subcategories;
    } catch (err: any) {
      console.error("Error getting subcategories: ", err.message);
      return [];
    }
  }
}
