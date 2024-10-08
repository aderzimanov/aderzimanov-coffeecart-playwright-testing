import { test } from '../fixtures/Fixtures';
import { CartPage } from '../../src/ui/pages/CartPage';
import { MenuPage } from '../../src/ui/pages/MenuPage';

let menuPage: MenuPage;
let cartPage: CartPage;

test.describe('Verify adding to cart via confirmation dialog', () => {
  test.beforeEach(async({ page }) => {
    cartPage = new CartPage(page);
    menuPage = new MenuPage(page);
    await cartPage.open();
  });

  test(
    'Verify adding item to cart after clicking "Yes" in dialog', 
    async () => {
      const coffeeType = 'Espresso';
      await menuPage.goToMenu();
      await menuPage.invokeAddToCartConfirmation(coffeeType);
      await menuPage.confirmAddToCart();
      await menuPage.goToCart();

      await cartPage.assertProductIsPresentInCart(coffeeType);
    }
  );
  
  test(
    'Verify that item is NOT added to cart after clicking "No" in dialog', 
    async () => {
      const coffeeType = 'Mocha';
      await cartPage.goToMenu();
      await menuPage.invokeAddToCartConfirmation(coffeeType);
      await menuPage.rejectAddToCart();
      await menuPage.goToCart();

      await cartPage.assertProductIsAbsentInCart(coffeeType);
    }
  );
})



