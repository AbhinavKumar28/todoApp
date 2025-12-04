import { UserModel } from "../models/user.ts";
import type { CategoryResponse, CategoryOld } from "../types/custom.d.ts";

export class CategoryService {
  private userModel: UserModel;
  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }
  async fetchCategories(email: string): Promise<CategoryResponse> {
    const projection = { "categories.category": 1, "categories._id": 1 };

    const userData = await this.userModel.findByEmailWithProjection(email, projection);

    if (!userData || !userData.categories) return [];

    return userData.categories.map((c: CategoryOld) => ({
      _id: c._id,
      category: c.category,
    }));
  }
  async insertCategory(email: string, categoryName: string): Promise<CategoryResponse> {
    const newCategory = await this.userModel.pushCategory(email, categoryName);
    return newCategory;
  }
}
