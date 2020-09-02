const puppeteer = require("puppeteer");

const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true, // start chromium in headless mode on travis and flip flag for non-headless for local machine
      args: ["--no-sandbox"], // to decrease the amount of time to run tests on travis
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    //puppeteer page reference
    this.page = page;
  }

  async login() {
    const user = await userFactory();

    const { session, sig } = sessionFactory(user);

    //setting both cookies to page instance
    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sig });
    // this is to refresh the page so we can log in automatically
    await this.page.goto("http://localhost:3000/blogs");
    // ading delay to load the react app and render all elements
    await this.page.waitFor("a[href='/auth/logout']");
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }
}

module.exports = CustomPage;
