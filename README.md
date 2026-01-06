# TypeScript Dessert Shop

A modern, responsive dessert shop application built with TypeScript, featuring a shopping cart system and order confirmation.

## Features

- **Product Display**: Grid layout showcasing 9 different desserts with responsive images
- **Shopping Cart**: Add, remove, and modify quantities of items
- **Order Management**: Confirm orders with detailed summary
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **TypeScript**: Fully typed for better development experience

## Project Structure

```
Project_TS/
├── src/
│   ├── components/          # Reusable components (empty - ready for expansion)
│   ├── data/
│   │   └── products.ts      # Product data with type definitions
│   ├── styles/
│   │   └── main.css         # Application styles
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   └── index.ts             # Main application logic
├── dist/                    # Compiled JavaScript files
├── Project asset/           # Images, fonts, and design assets
├── index.html              # Main HTML file
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies and scripts
└── server.js               # Development server
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the project (currently using manual compilation)
- `npm run dev` - Start development server (same as start)

## Technologies Used

- **TypeScript** - Type-safe JavaScript
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid and Flexbox
- **Node.js** - Development server
- **Red Hat Text Font** - Custom typography

## Key Components

### DessertShop Class
Main application class that handles:
- Product rendering
- Cart management
- Event handling
- Order processing

### Type Definitions
- `Product` - Product structure with images and pricing
- `CartItem` - Cart item with product and quantity
- `Cart` - Shopping cart with items and total
- `Order` - Order structure for completed purchases

## Features in Detail

### Product Grid
- Responsive grid layout
- Multiple image sizes for different screen sizes
- Add to cart functionality
- Category and pricing display

### Shopping Cart
- Real-time cart updates
- Quantity controls
- Item removal
- Order total calculation
- Empty cart state

### Order Confirmation
- Modal dialog with order summary
- Product thumbnails
- Itemized pricing
- Start new order functionality

## Responsive Design

The application is fully responsive with breakpoints for:
- Desktop (1024px+)
- Tablet (768px+)
- Mobile (below 768px)

## Browser Support

Modern browsers supporting:
- ES2020 features
- CSS Grid and Flexbox
- HTML5 semantic elements

## Future Enhancements

- Payment integration
- User authentication
- Order history
- Product search and filtering
- Inventory management
- Admin panel