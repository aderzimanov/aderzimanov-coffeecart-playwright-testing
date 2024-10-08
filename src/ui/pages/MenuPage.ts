import { test, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../constants';
 
export class MenuPage extends BasePage {
  url = ROUTES.menu;
  readonly name: string;
  readonly coffeeItemLocators: Locator;
  readonly addToCartConfirmButton: Locator;
  readonly addToCartRejectButton: Locator;
  readonly promoConfirmButton: Locator;
  readonly promoRejectButton: Locator;
  readonly promoTitleLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.coffeeItemLocators = page.locator(`li:has(h4)`);
    this.addToCartConfirmButton = page.getByRole(
      'button', 
      { name: 'Yes'}
    );
    this.addToCartRejectButton = page.getByRole(
      'button', 
      { name: 'No'}
    );
    this.promoConfirmButton = page.getByRole(
      'button', 
      { name: 'Yes, of course!'}
    );
    this.promoRejectButton = page.getByRole('button', 
      { name: 'Nah, I\'ll skip.'}
    );
    this.promoTitleLocator = page.getByText(
      'It\'s your lucky day! Get an'
    );
  }

  async getPrice(name: string): Promise<number> {
    const result = test.step(`Get the price of ${name} cup`, async() => {
      const headerString = (
        await this
        .coffeeItemLocators
        .locator(`h4:has-text("${name} $")`)
        .textContent() 
        || ''
      );

      return +headerString.split(' $')[1];
    });

    return result;
  }

  async clickableCoffeeItemLocator(name: string): Promise<Locator> {
    const locatorValue = (name === 'Espresso Con Panna') 
      ? 'Espresso_Con Panna' 
      : name.replace(/ /g, '_'); //processing a bug for specific coffee type

    return this.coffeeItemLocators.locator(`div[data-test="${locatorValue}"]`);
  }
  
  async addToCartByClick(name: string): Promise<void> {
    await test.step(`Add ${name} item to cart by left click`, async() => {
      const locator = await this.clickableCoffeeItemLocator(name);
      await locator.click();
    });
  }
  
  async invokeAddToCartConfirmation(name: string): Promise<void> {
    await test.step(`Add ${name} item to cart by left click`, async() => {
      const locator = await this.clickableCoffeeItemLocator(name);
      await locator.click({ button: 'right' });
    });
  }

  async confirmAddToCart(): Promise<void> {
    await test.step(
      `Add item to cart by clicking "Yes" in the confirmation dialog`, 
      async() => {
        await this.addToCartConfirmButton.click();
      }
    );
  }
  
  async rejectAddToCart(): Promise<void> {
    await test.step(
      `Reject addition to cart by clicking "No" in the confirmation dialog`, 
      async() => {
        await this.addToCartRejectButton.click();
      }
    );
  }
    
  async invokeFirstPromoDialog(): Promise<void> {
    await test.step(
      `Invoke promo dialog 1st time by adding any 3 products to the cart`, 
      async() => {
        await this.addToCartByClick('Espresso');
        await this.addToCartByClick('Mocha');
        await this.addToCartByClick('Cafe Latte');
      }
    );
  }
  
  async confirmPromoProduct(): Promise<void> {
    await test.step(
      `Confirm promo item addition to cart by click "Yes, of course!" button`, 
      async() => {
        await this.promoConfirmButton.click();
      }
    );
  }
    
  async rejectPromoProduct(): Promise<void> {
    await test.step(
      `Reject promo item addition to cart by click "Nah, I'll skip." button`, 
      async() => {
        await this.promoConfirmButton.click();
      }
    );
  }

  async getPromoProductPrice(): Promise<number> {
    const result = test.step(
      'Extract product price from the promo text', 
      async() => {
        const title = await this.promoTitleLocator.textContent() || '';
        const priceStart = title.indexOf('$') + 1;
        const priceEnd = title.indexOf('.', priceStart);
        const price = title.slice(priceStart, priceEnd); 
        return +price; //price is located between '$' and dot 
      }
    );
    
    return result;
  }

  async getPromoProductName(): Promise<string> {
    const result = test.step(
      'Extract product name from the promo text', 
      async() => {
        const title = await this.promoTitleLocator.textContent() || '';
        const nameStart = title.indexOf('of') + 2;
        const nameEnd = title.indexOf('for');
        const name = title.slice(nameStart, nameEnd).trim(); 
        return name; //located between 'of' and 'for' words
      }
    );
    
    return result;
  };
}