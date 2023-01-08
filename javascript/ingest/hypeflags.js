const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const bestSellers = async () => {
  let bestSellingProducts;
  try {
    const page = await axios.get(
      "https://hypeflags.com/collections/best-sellers"
    );
    if (!page.data || typeof page.data !== "string")
      throw "page.data was empty or malformed";
    const $ = cheerio.load(page.data);
    bestSellingProducts = $(".product-card", "ul")
      .get()
      .filter((e) => {
        let href = $(e).find(".list-wrapper").attr("href").toString();
        return !(
          href.includes("apparel") ||
          href.includes("dresses") ||
          href.includes("accessories") ||
          href.includes("skirts")
        );
      })
      .map((e) => {
        let href = $(e).find(".card-link").attr("href").toString();
        return {
          name: "",
          manufacturer: "Nike",
          releaseDate: "",
          styleCode: "",
          retailPrice: "",
          retailLink: `https://nike.com${href}`,
        };
      });
  } catch (error) {
    console.error(`Error in ${__filename} | ${error}`);
  }
  try {
    if (!upcomingProducts) throw "upcomingProducts was empty or malformed";
    upcomingProducts.forEach(async (product) => {
      const productPage = await axios.get(product.retailLink);
      if (!productPage.data || typeof productPage.data !== "string")
        throw "productPage.data was empty or malformed";
      fs.writeFile("balls.html", productPage.data, () => {});
      const $ = cheerio.load(productPage.data);
      product.imageLinks = $("img[class=image-component]").get();
      console.log(product);
    });
  } catch (error) {
    console.log(`Error in ${__filename} | ${error}`);
  }
};

bestSellers();

module.exports = {
  bestSellers,
};
