import { factories } from "@strapi/strapi";
interface ParamsFindOne {
  id: string;
}

export default factories.createCoreController("api::new.new", ({ strapi }) => ({
  // find one new and update view
  async findOne(ctx) {
    try {
      const { id }: ParamsFindOne = ctx.request.body;
      const data =
        (await strapi.service("api::new.customs").findOneCus(id)) || null;

      if (data) {
        await strapi.service("api::new.customs").increaseViews({
          id,
          viewOfDay: data?.viewOfDay,
          viewOfHour: data?.viewOfHour,
        });
      }
      ctx.body = { data };
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
  // reset view
  async resetViewOfDay(ctx) {
    try {
      const data = await strapi.service("api::new.customs").resetViewOfDay();
      ctx.body = { data };
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
  async resetViewOfHour(ctx) {
    try {
      const data = await strapi.service("api::new.customs").resetViewOfHour();
      ctx.body = { data };
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
  // create new
  async createNewCrawl(ctx) {
    try {
      const { caption, category, url } = ctx.request.body;

      // if url and caption is the same a record in db => check categories
      //    if categories have category in request.body => next
      //    else update categories add category
      // else create new record

      let news = await strapi
        .service("api::new.customs")
        .findNewByCaptionAndUrl({ caption, url });

      news = await news[0];
      let categoriesOfNews = await news?.categories.map(
        (category: any) => category?.id
      );

      if (news && categoriesOfNews) {
        if (await categoriesOfNews.includes(category)) {
          return (ctx.response.body = {
            message:
              "Create new isn't success because new is already exist with it's category",
          });
        } else {
          await categoriesOfNews.push(category);
          news = await strapi
            .service("api::new.customs")
            .updateCategories({ id: news?.id, categories: categoriesOfNews });
          return (ctx.response.body = {
            data: { news },
            message: "Update categories successfully",
          });
        }
      } else {
        news = await strapi
          .service("api::new.customs")
          .createNews(ctx.request.body);
        return (ctx.response.body = {
          data: { news },
          message: "Create new successfully",
        });
      }
    } catch (err) {
      ctx.badRequest("Post request error", { moreDetails: err });
    }
  },

  async getNewsForCategory(ctx) {
    try {
      const { categoryField } = ctx.request.params;
      const { page, pageSize, author, caption, filter } = ctx.request.query;

      const entries = await strapi
        .service("api::new.customs")
        .getNewsByCategory({
          categoryField,
          page,
          pageSize,
          author,
          caption,
          filter,
        });

      const category = await strapi.service("api::category.customs")
      .getCategoryByField({categoryField})

      const data = {
        ...entries,
        category
      };
      ctx.response.body = data;
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },

  async getHotNews(ctx) {
    try {
      const data = await strapi.service("api::new.customs").getHotNews();

      ctx.response.body = { data };
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
  async getNewestNews(ctx) {
    try {
      const data = await strapi.service("api::new.customs").getNewestNews();

      ctx.response.body = { data };
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },

  async getInfinitiveNews(ctx) {
    try {
      const { page } = ctx.request.query;
      const data = await strapi
        .service("api::new.customs")
        .getInfinitiveNews({ page });

      ctx.response.body = { data };
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
}));
