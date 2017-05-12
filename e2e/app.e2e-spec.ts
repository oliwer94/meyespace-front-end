import { Angular2FrontendProjectPage } from './app.po';

describe('angular2-frontend-project App', () => {
  let page: Angular2FrontendProjectPage;

  beforeEach(() => {
    page = new Angular2FrontendProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
