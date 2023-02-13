describe('Area tests', () => {
  /**
   * @brief Launch the application on the connected device.
   */
  beforeAll(async () => {
    await device.launchApp();
  });

  /**
   * @brief Reload the application on the connected device.
   */
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  /**
   * @brief Check the connexion screen.
   */
  it('should have connected screen', async () => {
    await expect(element(by.text('Se connecter'))).toBeVisible();
  });

  /**
   * @brief Fill the email address field.
   */
  it('type email address', async() => {
    await element(by.id('emailAddress')).typeText('test@email.com');
  });

  /**
   * @brief Fill the password field.
   */
  it('type password', async() => {
    await element(by.id('pwdpassword')).typeText('password');
  });

  /**
   * @brief Redirect to inscription page.
   */
  it('should change page to register page', async () => {
    await element(by.id('inscription-redirect')).tap();
    await expect(element(by.text('Déjà un compte ? '))).toBeVisible();
  });
});
