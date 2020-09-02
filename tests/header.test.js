const Page = require("./helpers/page");
let page;

// executed after before each test
beforeEach(async () => {
  page = await Page.build();

  // go to localhost/:3000
  await page.goto("http://localhost:3000");
});

//executed after each test
afterEach(async () => {
  await page.close();
});

test("the header has the correct text", async () => {
  // pullout the logo text and compare it with actual value
  const text = await page.getContentsOf("a.brand-logo");
  expect(text).toEqual("Blogster");
});

test("Clicking login starts oauth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("When signed in, shows logout button", async () => {
  await page.login();

  // extracting the text for particular link
  const text = await page.$eval("a[href='/auth/logout']", (el) => el.innerHTML);
  expect(text).toEqual("Logout");
});
