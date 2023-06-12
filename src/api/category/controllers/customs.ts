/**
 * category controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::category.category",
  ({ strapi }) => ({
    async getAllCategories(ctx) {
      try {
        const data = await strapi
          .service("api::category.customs")
          .getAllCategories();
        ctx.body = {data};
      } catch (err) {
        ctx.badRequest("Post report controller error", { moreDetails: err });
      }
    },
  })
);
