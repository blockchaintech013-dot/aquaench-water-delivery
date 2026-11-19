# Aquaench Water Delivery

Build a modern, attractive, mobile-responsive water delivery e-commerce website for a brand called **Aquaench Water**.

The website should look professional, trustworthy, clean, and refreshing. Use a blue-and-white visual identity inspired by bottled drinking water brands.

IMPORTANT: This is a frontend-only working prototype. Do not connect any backend, database, authentication provider, or payment gateway. All interactions should work using frontend state and localStorage.

## 1. BRAND IDENTITY AND DESIGN

Brand name: **Aquaench**

Brand slogan:
**Pure. Refreshing. Essential.**

Main marketing slogan:
**Usipanic maji inakam!**

Use the Aquaench logo/label artwork provided as the brand reference. Preserve its recognizable water-drop cartoon mascot and original visual identity.

### Colour palette
- Deep navy blue: #061B59
- Royal blue: #0759CE
- Aqua blue: #08BCEB
- Light blue: #DFF6FF
- White: #FFFFFF
- Dark text: #172B4D

Design style:
- Modern water delivery brand.
- Rounded product cards.
- Smooth transitions and subtle shadows.
- Attractive water-drop illustrations.
- Clean typography.
- Plenty of white space.
- Professional navigation and footer.

Use Lucide icons where appropriate.

## 2. TOP NAVIGATION BAR

Create a sticky navigation bar.

Left side:
- Aquaench logo and brand name.

Right side:
- Home
- Products
- About Us
- Contact
- Moon icon for switching between light and dark themes.
- Shopping cart icon with a live cart item counter.
- Account/profile icon.

### Navigation functionality

**Theme switcher**
- Clicking the moon icon switches between light and dark themes.
- Use smooth transitions.
- Save the selected theme in localStorage.
- Dark mode should use navy and dark blue backgrounds while retaining aqua highlights.

**Shopping cart**
- Clicking the cart opens a cart drawer or cart page.
- Display selected products, quantities, prices, and subtotal.
- Allow users to increase/decrease quantities and remove products.
- Display the total amount.
- Include a prominent Checkout button.

**Account**
- Clicking the account icon opens an account modal.
- Include Sign In and Create Account tabs.
- Sign-in fields: email and password.
- Registration fields: full name, email, phone number and password.
- Since there is no backend, simulate authentication using localStorage.
- Show a basic account dashboard after simulated sign-in.

## 3. LANDING PAGE / HERO SECTION

At the very top of the page, create a slim announcement banner:

**Always free delivery**

Use a blue background with white text and a small delivery truck icon.

Below the announcement banner, create a beautiful hero section.

Main heading:

# Welcome to Aquaench Water

Subtitle:

**Pure. Refreshing. Essential.**

Supporting text:

"Fresh, clean drinking water delivered straight to your doorstep in Kitale."

Include:
- A prominent Shop Now button.
- A secondary Learn More button.
- Attractive water splash graphics.
- A large Aquaench branded water bottle illustration.
- The Aquaench mascot as part of the visual identity.

The hero should feel refreshing and premium without being overcrowded.

## 4. PRODUCTS SECTION

Section heading:

# Choose Your Water

Subtitle:
"Quality drinking water in convenient sizes, delivered free to your doorstep."

Create two large product cards displayed side by side on desktop and stacked on mobile.

### PRODUCT 1 — 20 LITRES

Product image:
https://water.sasakonnect.net/_next/image?url=https%3A%2F%2Fgw.sasakonnect.net%2Fkonnect-water%2Fassets%2Fimages%2FnewBottles%2F650.png&w=3840&q=75

Product information:
- Name: 20L
- Volume: 20 Litres
- Price: Ksh 150
- Delivery: Free delivery
- Button: Tap to Select

### PRODUCT 2 — 10 LITRES

Product image:
https://water.sasakonnect.net/_next/image?url=https%3A%2F%2Fgw.sasakonnect.net%2Fkonnect-water%2Fassets%2Fimages%2FnewBottles%2F50.png&w=3840&q=75

Product information:
- Name: 10L
- Volume: 10 Litres
- Price: Ksh 90
- Delivery: Free delivery
- Button: Tap to Select

### Product card functionality

Each card should have:
- Product image.
- Product name.
- Volume.
- Price in Kenyan Shillings.
- Free delivery indicator.
- Tap to Select button.

When the user clicks Tap to Select:
- Add the selected product to the shopping cart.
- Update the cart counter immediately.
- Show a small success notification.
- Allow multiple quantities of the same product.

Do not automatically redirect to checkout.

## 5. CHECKOUT AND CART SYSTEM

Create a fully functional frontend checkout experience.

The checkout should have the following steps:

### Step 1: Order summary

Display:
- Selected products.
- Product quantities.
- Individual prices.
- Subtotal.
- Delivery fee: Ksh 0.
- Total payable.

### Step 2: Bottle selection

IMPORTANT: Customers may already own water bottles, while others may need to purchase one.

Include an optional section:

**Do you need a water bottle?**

Provide:
- Yes, add a bottle.
- No, I already have a bottle.

If the customer selects Yes:
- Display a bottle selection area.
- Allow them to choose the available bottle option.
- Include the bottle price and quantity.
- Add the selected bottle cost to the order total.

If the customer selects No:
- Do not add any bottle charge.

IMPORTANT: The bottle is optional. Do not make it mandatory.

For the bottle product, use a placeholder product and clearly label its price as configurable until the actual bottle price is supplied.

### Step 3: Customer information

Create a delivery information form with:
- Full name.
- Phone number.
- Alternative phone number (optional).
- Estate / Area.
- Specific delivery location.
- Additional delivery instructions (optional).

### Step 4: Order confirmation

Display a final order summary:
- Customer details.
- Ordered water products.
- Optional bottle.
- Subtotal.
- Delivery fee: FREE.
- Total payable.

Include a button:

**Place Order**

Since there is no backend, simulate order placement:
- Generate a unique order number.
- Show a successful order confirmation screen.
- Display the order number.
- Display the order details.
- Provide a button to return to the homepage.

Save demo orders in localStorage so they remain visible after refreshing the page.

Do not implement real payments or pretend that a payment has been received.

## 6. ABOUT US SECTION

Create an attractive About Us section.

Heading:

# About Aquaench

Suggested content:

"Aquaench is committed to making access to clean, refreshing drinking water simple and convenient. We bring quality drinking water closer to homes and businesses through reliable doorstep delivery.

Our goal is to make staying hydrated easier by providing convenient water sizes, dependable service, and free delivery."

Include three visual value propositions:

1. Pure Water — Quality drinking water.
2. Convenient Delivery — Water delivered to your doorstep.
3. Essential Refreshment — Making hydration easier every day.

Add a Read More button that expands additional information or scrolls to a more detailed About section.

## 7. CONTACT US SECTION

Heading:

# Contact Us

Supporting text:
"Need water delivered? Get in touch with Aquaench."

Display the following contact information:

**Welcome, Kitale**

Gatua, Kitale  
Kenya

Phone: +254762206950

WhatsApp: +254762206950

### Contact functionality

Phone:
Make the phone number clickable using a tel: link.

WhatsApp:
Create a functional WhatsApp button using:

https://wa.me/254762206950

Pre-filled message:
"Hello Aquaench, I would like to order drinking water."

Include:
- WhatsApp icon.
- Call Us button.
- Contact information cards.

## 8. FOOTER

Create a professional footer containing:

Aquaench logo and slogan:

"Pure. Refreshing. Essential."

Quick links:
- Home
- Products
- About Us
- Contact Us

Contact:
- Gatua, Kitale, Kenya
- +254762206950
- WhatsApp

Bottom text:
"© 2026 Aquaench Water. All rights reserved."

## 9. MOBILE RESPONSIVENESS

The website must work beautifully on:
- Desktop computers.
- Tablets.
- Android phones.
- iPhones.

On mobile:
- Use a compact navigation bar.
- Keep the cart easily accessible.
- Stack product cards vertically.
- Make checkout forms easy to complete.
- Use appropriately sized buttons.
- Avoid horizontal scrolling.

## 10. TECHNICAL REQUIREMENTS

Use:
- React.
- TypeScript.
- Tailwind CSS.
- Lucide React icons.
- localStorage for demo persistence.

Implement reusable components:
- Navbar
- HeroSection
- ProductCard
- ProductsSection
- CartDrawer
- CheckoutPage
- AccountModal
- AboutSection
- ContactSection
- Footer
- OrderConfirmation

Use React state and localStorage to manage:
- Cart items.
- Cart quantities.
- Theme preferences.
- Simulated account sessions.
- Customer information.
- Demo orders.

Ensure all buttons, navigation links, forms, modals, and cart interactions work.

Do not leave any buttons non-functional.

Do not add unnecessary pages or complicated features.

## 11. FINAL EXPECTED RESULT

Deliver a complete, polished Aquaench Water e-commerce frontend prototype.

The experience should be straightforward:

1. Customer visits the homepage.
2. Customer selects 10L or 20L water.
3. Customer opens the cart.
4. Customer chooses whether they need an additional bottle.
5. Customer enters their delivery information.
6. Customer reviews and places their order.
7. Customer sees an order confirmation.

The most important priorities are:
- Beautiful Aquaench branding.
- Simple shopping experience.
- Working shopping cart.
- Optional bottle selection.
- Functional checkout.
- Free delivery prominently displayed.
- Mobile-friendly design.
- No backend dependencies.

Build the complete working frontend, not just a static visual mockup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/151e47c6-5d26-4f95-b310-5560b87a7276).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
