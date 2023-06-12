export default {
    routes: [
      {
        method: 'POST',
        path: '/news-cus',
        handler: 'customs.findOne',
      },
      {
        method: 'POST',
        path: '/reset-view-day',
        handler: 'customs.resetViewOfDay',
      },
      {
        method: 'POST',
        path: '/reset-view-hour',
        handler: 'customs.resetViewOfHour',
      },
      {
        method: 'POST',
        path: '/create-news-by-crawler',
        handler: 'customs.createNewCrawl',
      },
      {
        method: "GET",
        path: "/category/:categoryField",
        handler: "customs.getNewsForCategory",
      },
      {
        method: "GET",
        path: "/news/hot",
        handler: "customs.getHotNews",
      },
      {
        method: "GET",
        path: "/news/newest",
        handler: "customs.getNewestNews",
      },
      {
        method: "GET",
        path: "/news/infinitive",
        handler: "customs.getInfinitiveNews",
      },
    ]
  }