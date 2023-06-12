import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::category.category",
  ({ strapi }) => ({
    getAllCategories: async () => {
      const entries = await strapi.entityService.findMany(
        "api::category.category",
        {
          fields: ["id", "name", "url", "field", "createdAt"],
          filters: { status: 1 },
          populate: {
            category_parent: {
              fields: ["id"],
            },
          },
        }
      );
      return entries;
    },

    getCategoryByField: async ({ categoryField }) => {
      const entries = await strapi.entityService.findMany(
        "api::category.category",
        {
          fields: ["id", "name", "field", "createdAt", "description"],
          filters: { status: 1, field:categoryField },
        }
      );
      return entries[0];
    },
  })
);
