import { expect, test, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
 
export class CartPage extends BasePage {
  readonly emptyCartMessage: Locator;
  readonly url: string = '/cart';
  readonly name: string;

  constructor(page: Page) {
    super(page);
    this.name = 'Cart';
    this.emptyCartMessage = page.getByText('No coffee, go add some.');
  }

  async removeAllButtonLocator(productName: string): Promise<Locator> {   
    return this.page.getByLabel(`Remove all ${productName}`, { exact: true });
  }

  async clickRemoveAllProductItemsButton(productName: string): Promise<void> {    
    await test.step(`Remove ${productName} product from the cart`, async() => {
      const removeButtonLocator = await this.removeAllButtonLocator(productName);
      await removeButtonLocator.click();
    });
  }

  async clickAddOneButton(productName: string): Promise<void> {
    await test.step(`Add 1 unit of ${productName} to the cart`, async() => {
      let addOneButton = this.page.getByRole('button', { name: `Add one ${productName}`, exact: true });
      await addOneButton.click();
    });
  }

  async clickRemoveOneButton(productName: string): Promise<void> {    
    await test.step(`Remove 1 unit of ${productName} to the cart`, async() => {
      let removeOneButton = this.page.getByRole('button', { name: `Remove one ${productName}`, exact: true });
      await removeOneButton.click();
    });
  }
  
  async assertEmptyCartMessageIsVisible(): Promise<void> {
    await test.step(`Assert that the message about empty cart is displayed`, async() => {
      await expect(this.emptyCartMessage).toBeVisible();
    });
  }

  async assertProductPresenceInCart(productName: string): Promise<void> {
    await test.step(`Assert that "${productName}" is present in the cart`, async() => {
      await expect(await this.removeAllButtonLocator(productName)).toBeVisible();
    });
  }
  
  async assertProductAbsenceInCart(productName: string): Promise<void> {
    await test.step(`Assert that "${productName}" is NOT present in the cart`, async() => {
      await expect(await this.removeAllButtonLocator(productName)).toBeHidden();
    });
  }
}