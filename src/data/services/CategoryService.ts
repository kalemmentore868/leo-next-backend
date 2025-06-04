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

  static async updateCategory(
    token: string,
    category_id: string,
    payload: Partial<Omit<Category, "category_id">>
  ) {
    try {
      return await customAuthFetch(
        `categories/${category_id}`,
        "PUT",
        token,
        payload
      );
    } catch (err: any) {
      console.error("Error updating category: ", err.message);
      throw err;
    }
  }

  static async updateSubCategory(
    token: string,
    category_id: string,
    payload: Partial<Omit<Subcategory, "category_id" | "subcategory_id">>
  ) {
    try {
      return await customAuthFetch(
        `subcategories/${category_id}`,
        "PUT",
        token,
        payload
      );
    } catch (err: any) {
      console.error("Error updating category: ", err.message);
      throw err;
    }
  }

  static async createSubCategory(
    token: string,
    payload: Omit<Subcategory, "subcategory_id" | "iconName">
  ) {
    try {
      return await customAuthFetch("subcategories", "POST", token, payload);
    } catch (err: any) {
      console.error("Error creating subcategory: ", err.message);
      throw err;
    }
  }
}
