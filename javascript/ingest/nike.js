const fs = require("fs");
const pptr = require("puppeteer");

const snkrsUpcoming = async () => {
  try {
    const browser = await pptr.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.nike.com/launch?s=upcoming", {
      waitUntil: "load",
    });

    const products = await page.evaluate(() => {
      const productCards = document.querySelectorAll("figure .product-card");
      let products = Array.from(productCards)
        .filter((card) => {
          let href = card.querySelector("a.card-link").getAttribute("href");
          return !(
            href.includes("apparel") ||
            href.includes("dresses") ||
            href.includes("accessories") ||
            href.includes("skirts")
          );
        })
        .map(
          (card) =>
            "https://nike.com" +
            card.querySelector("a.card-link").getAttribute("href")
        );
      return products;
    });

    await page.close();

    await Promise.all(
      products.map(async (link) => {
        const productPage = await browser.newPage();
        await productPage.goto(link, {
          waitUntil: "load",
        });
        pageContent = await productPage.content();
        let pageTitle = await productPage.title();
        const productInfo = await productPage.evaluate(() => {
          let productInfoDiv = document.querySelector(
            "div.product-info.ncss-col-sm-12"
          );
          return {
            name:
              productInfoDiv.querySelector("h1").innerText +
              " " +
              productInfoDiv.querySelector("h5").innerText,
            link: document.location.href,
            releaseDate: productInfoDiv.querySelector(
              "div.available-date-component"
            ).innerText,
            MSRP: productInfoDiv.querySelector("div.headline-5").innerText,
            SKU: productInfoDiv
              .querySelector("div.description-text > p")
              .innerText.match("SKU: [-A-Za-z0-9]+$")[0]
              .replace("SKU: ", ""),
            images: Array.from(
              document.querySelectorAll("div.carousel-card-content > img")
            ).map((img) => img.src),
            manufacturer: "Nike",
          };
        });
        await productPage.close();
        return productInfo;
      })
    );

    console.log(products);

    await browser.close();
  } catch (error) {
    console.error("Error", error);
  }
};

module.exports = {
  snkrsUpcoming,
};
