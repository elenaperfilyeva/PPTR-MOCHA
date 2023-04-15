import { step } from "mocha-steps";
import { expect } from "chai";

import Page from "../builder";
import LoginPage from "../pages/LoginPage";

describe("Mocha steps demo", () => {
    let page;
    let loginPage;

    before(async () => {
        page = await Page.build("Desktop");
        loginPage = await new LoginPage(page);
    });

    after(async () => {
        await page.close();
    });

    step("should load homepage", async () => {
        await page.goto("http://zero.webappsecurity.com/index.html");
        expect(await page.isElementVisible('#signin_button')).to.be.true;
    });

    step('should display login form', async () => {
        await page.waitAndClick("#signin_button");
        expect(await page.isElementVisible("#login_form")).to.be.true;
        expect(await page.isElementVisible('#signin_button')).to.be.false;
    });

    step('should login to application', async () => {
        await loginPage.login("username", "password");
        expect(await page.isElementVisible(".nav-tabs")).to.be.true;
    });

    step('should have 6 navbar links', async () => {
        expect(await page.getCount('.nav-tabs li')).to.equal(6);
    });
});
