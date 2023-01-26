describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have connected screen', async () => {
    await expect(element(by.text('Se connecter'))).toBeVisible();
  });
  it('type email address', async() => {
    await element(by.id('emailAddress')).typeText('test@email.com');
  });
  it('type password', async() => {
    await element(by.id('pwdpassword')).typeText('password');
  });
  it('should change page to register page', async () => {
    await element(by.id('inscription-redirect')).tap();
    await expect(element(by.text('Déjà un compte ? '))).toBeVisible();
  });
  // it('should have welcome screen', async () => {
  //   await expect(element(by.id('welcome'))).toBeVisible();
  // });

  // it('should show hello screen after tap', async () => {
  //   await element(by.id('hello_button')).tap();
  //   await expect(element(by.text('Hello!!!'))).toBeVisible();
  // });

  // it('should show world screen after tap', async () => {
  //   await element(by.id('world_button')).tap();
  //   await expect(element(by.text('World!!!'))).toBeVisible();
  // });
});
