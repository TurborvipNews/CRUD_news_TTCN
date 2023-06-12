import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::new.new", ({ strapi }) => ({
  // find and update
  findOneCus: (id) => {
    return strapi.entityService.findOne("api::new.new", id, {});
  },
  increaseViews: async ({ id, viewOfDay, viewOfHour }) => {
    await strapi.entityService.update("api::new.new", id, {
      data: {
        viewOfDay: ++viewOfDay,
        viewOfHour: ++viewOfHour,
      },
    });
  },

  // reset view
  resetViewOfDay: async () => {
    return await strapi.db.query("api::new.new").updateMany({
      data: {
        viewOfDay: 0,
      },
    });
  },

  resetViewOfHour: async () => {
    return await strapi.db.query("api::new.new").updateMany({
      data: {
        viewOfHour: 0,
      },
    });
  },

  // create new by crawler

  findNewByCaptionAndUrl: async ({ caption, url }) => {
    const entries = await strapi.entityService.findMany("api::new.new", {
      fields: ["id", "caption"],
      filters: {
        caption,
        url,
      },
      populate: {
        categories: {
          fields: ["id"],
        },
      },
    });
    return entries;
  },

  updateCategories: async ({ id, categories }) => {
    const entries = await strapi.entityService.update("api::new.new", id, {
      data: {
        categories,
      },
      fields: ["id", "caption"],
      populate: {
        categories: {
          fields: ["id"],
        },
      },
    });
    return entries;
  },

  createNews: async (data) => {
    const entry = await strapi.entityService.create("api::new.new", {
      data,
    });

    return entry;
  },

  getNewsByCategory: async ({
    categoryField,
    page,
    pageSize,
    author,
    caption,
    filter,
  }) => {
    try {
      const listNews = await strapi.entityService.findMany("api::new.new", {
        populate: {
          categories: {
            fields: ["field"],
          },
        },
        filters: {
          status: 1,
          author: { $containsi: author || "" },
          caption: { $containsi: caption || "" },
          categories: {
            field: categoryField,
          },
        },
        fields: ["id", "caption", "description", "thumbnail", "author","viewOfHour"],
        limit: pageSize,
        start: (page-1) * pageSize,
        sort: { publishedAt: filter },
      });

      const totalNews = await strapi.db.query("api::new.new").count({
        where: {
          status: 1,
          author: { $containsi: author || "" },
          caption: { $containsi: caption || "" },
          categories: {
            field: categoryField,
          },
        },
      });

      const totalPage = Math.ceil(totalNews / pageSize);
      return { listNews, totalPage };
    } catch (error) {
      console.log(error);
    }
  },

  getHotNews: async () => {
    const entries = await strapi.entityService.findMany("api::new.new", {
      filters: {
        status: 1,
      },
      fields: ["id", "caption", "description", "thumbnail"],
      limit: 5,
      sort: { viewOfHour: "desc" },
    });

    return entries;
  },

  getNewestNews: async () => {
    const entries = await strapi.entityService.findMany("api::new.new", {
      filters: {
        status: 1,
      },
      fields: ["id", "caption", "description", "thumbnail"],
      limit: 7,
      sort: { publishedAt: "desc" },
    });

    return entries;
  },

  getInfinitiveNews: async ({ page }) => {
    const entries = await strapi.entityService.findMany("api::new.new", {
      filters: {
        status: 1,
      },
      fields: ["id", "caption", "description", "thumbnail"],
      limit: 10,
      start: page * 10,
      sort: { publishedAt: "desc" },
    });

    return entries;
  },
}));
