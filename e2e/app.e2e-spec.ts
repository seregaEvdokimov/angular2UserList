import { browser, element, by, $$, ExpectedConditions } from 'protractor';

describe('QuickStart E2E Tests', function () {

  const SLEEP_TIME = 3000;

  beforeEach(function () {
    browser.get('');
  });

  it('should display', function () {
    browser.getTitle().then(function (text) {
      expect(text).toEqual('User List');
      browser.sleep(SLEEP_TIME);
    });
  });

  it('search testing', function () {
    let item = element(by.css('.table__tbody tr')).element(by.css('.row__name')),
        searchStr = '';

    item.getText().then(function (text) {
      searchStr = text;

      element(by.css('.search__input')).sendKeys(text);
      element(by.css('.search__button')).click();

      return element(by.css('.table__tbody tr')).element(by.css('.row__name')).getText();
    }).then(function (text) {
      expect(text).toEqual(searchStr);
      browser.sleep(SLEEP_TIME);
    });
  });

  it('change language', function () {

    let lang = '';
    let localizationStrings = {
      en: 'Turn off notifications',
      ru: 'Выключить оповещение'
    };

    let len: number, indx: number, node: any;

    element.all(by.css('.language__link')).then(function (items: any) {
      len  = items.length - 1;
      indx = Math.floor(Math.random() * (len + 1));
      node = items[indx];

      node.click();
      return node.getAttribute('data-language');
    }).then(function (attr: any) {
      lang = attr;
      return element(by.css('.switch-notify__label')).getText();
    }).then(function (text: any) {
      let str = localizationStrings[lang];
      expect(text).toEqual(str);
      browser.sleep(SLEEP_TIME);
    });
  });

  it('add user', function () {
    let user = ['New Client', 'client@hotmail.com', '01/21/2017', '03/20/2017'];

    element(by.css('.option__add-user')).click();
    element.all(by.css('.modal-window_show .modal-window-group__input')).each(function(item, index) {
      browser.wait(ExpectedConditions.elementToBeClickable(item));
      item.sendKeys(user[index]);
    }).then(function () {
      element(by.css('.modal-window_show .add-btn')).click();
      return element(by.css('.table__tbody tr')).element(by.css('.row__name')).getText();
    }).then(function (name) {
      expect(user[0]).toEqual(name);
      browser.sleep(SLEEP_TIME);
    });
  });

  it('delete user', function() {
    let nodes: any = [],
        secondUsername: string = '';

    element.all(by.css('.table__tbody tr')).then(function (items) {
      nodes = items;
      return nodes[1].element(by.css('.row__name')).getText();
    }).then(function (name2) {
      secondUsername = name2;
      nodes[0].element(by.css('.delete-btn')).click();

      return element(by.css('.table__tbody tr')).element(by.css('.row__name')).getText();
    }).then(function (name) {
      expect(name).toEqual(secondUsername);
      browser.sleep(SLEEP_TIME);
    });
  });

});
