"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _puppeteer = require("puppeteer");

var _puppeteer2 = _interopRequireDefault(_puppeteer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Builder = function () {
    _createClass(Builder, null, [{
        key: "build",
        value: async function build(viewport) {
            var launchOptions = {
                headless: true,
                slowMo: 0,
                args: ["--no-sandbox", "--disable-setup-sandbox", "--disable-web-security"]
            };

            var browser = await _puppeteer2.default.launch(launchOptions);
            var page = await browser.newPage();
            var extendedPage = new Builder(page);
            await page.setDefaultTimeout(10000);

            switch (viewport) {
                case "Mobile":
                    var mobile = _puppeteer2.default.devices["iPhone X"];
                    await page.emulate(mobileViewport);
                    break;
                case "Tablet":
                    var tabletViewport = _puppeteer2.default.devices["iPad landscape"];
                    await page.emulate(tabletViewport);
                    break;
                case "Desktop":
                    await page.setViewport({ width: 800, height: 600 });
                    break;
                default:
                    throw new Error("Supported devices are only Mobile | Tablet | Desktop");
            }

            return new Proxy(extendedPage, {
                get: function get(_target, property) {
                    return extendedPage[property] || browser[property] || page[property];
                }
            });
        }
    }]);

    function Builder(page) {
        _classCallCheck(this, Builder);

        this.page = page;
    }

    _createClass(Builder, [{
        key: "waitAndClick",
        value: async function waitAndClick(selector) {
            await this.page.waitForSelector(selector);
            await this.page.click(selector);
        }
    }, {
        key: "waitAndType",
        value: async function waitAndType(selector, text) {
            await this.page.waitForSelector(selector);
            await this.page.type(selector, text);
        }
    }, {
        key: "getText",
        value: async function getText(selector) {
            await this.page.waitForSelector(selector);
            var text = await this.page.$eval(selector, function (e) {
                return e.innerHTML;
            });
            return text;
        }
    }, {
        key: "getCount",
        value: async function getCount(selector) {
            await this.page.waitForSelector(selector);
            var count = await this.page.$$eval(selector, function (items) {
                return items.length;
            });
            return count;
        }
    }, {
        key: "waitForXPathAndClick",
        value: async function waitForXPathAndClick(xpath) {
            await this.page.waitForXPath(xpath);
            var elements = await this.page.$x(xpath);
            if (elements.length > 1) {
                console.warn("waitForXPathAndClick returned more than one result");
            }
            await elements[0].click();
        }
    }, {
        key: "isElementVisible",
        value: async function isElementVisible(selector) {
            var visible = true;
            await this.page.waitForSelector(selector, { visible: true, timeout: 3000 }).catch(function () {
                visible = false;
            });
            return visible;
        }
    }, {
        key: "isXPathVisible",
        value: async function isXPathVisible(selector) {
            var visible = true;
            await this.page.waitForXPath(selector, { visible: true, timeout: 3000 }).catch(function () {
                visible = false;
            });
            return visible;
        }
    }]);

    return Builder;
}();

exports.default = Builder;