const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

let snkrsUpcoming = async () => {
  let upcomingProducts;
  try {
    const upcomingPage = await axios.get(
      "https://www.nike.com/launch?s=upcoming"
    );
    if (!upcomingPage.data || typeof upcomingPage.data !== "string")
      throw "upcomingPage.data was empty or malformed";
    const $ = cheerio.load(upcomingPage.data);
    upcomingProducts = $(".product-card", "div")
      .get()
      .filter((e) => {
        let href = $(e).find(".card-link").attr("href").toString();
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
    console.log(`Error in ${__filename} | ${error}`);
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

let snkrsInStock = async () => {};

let yeezyUpcoming = async () => {};

module.exports = {
  snkrsUpcoming,
  snkrsInStock,
  yeezyUpcoming,
};
