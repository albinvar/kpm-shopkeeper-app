# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Shopkeeper Mobile App** - A React Native mobile application built with Expo specifically for shop owners and restaurant managers to manage their business operations. The app supports iOS, Android, and web platforms using a single codebase.

When Coding, please always follow the instructions in this file.
Double check every action you take.
If you are not sure about something, please ask me.

### Core Features

📱 **SHOPKEEPER APP FUNCTIONALITY**
- **Secure Authentication**: Login system for shop owners/managers
- **Order Management**: View and manage incoming orders in real-time
- **Financial Operations**: Handle refunds and generate invoices
- **Availability Control**: Set shop/restaurant open/closed status and operating hours
- **Customer Management**: Access and view customer details and order history
- **Delivery Management**: Assign delivery partners to orders
- **Future Integration**: Planned integration with Ecoyaan platform

### The Codebase

1. When developing, please always make sure to keep the flow correct for shopkeeper operations.
2. This is a shopkeeper-only application (no customer flow).
3. The flow is defined in the `navigation/RootNavigator.tsx` file.
4. All other navigators are defined in the `navigation/` directory.
5. The `navigation/` directory is organized into the following subdirectories:
   - `auth/` - Authentication screens for shopkeepers
   - `onboarding/` - Onboarding flow for new shop registration
   - `tabs/` - Main app screens (orders, shop management, profile)
   - `root/` - Root navigator
   - `stack/` - Stack navigator

## Tech Stack

- **Framework**: React Native 0.79.2 with Expo SDK ~53.0.9
- **Routing**: Expo Router with file-based routing
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Language**: TypeScript with strict mode
- **Navigation**: React Navigation v7 with bottom tabs

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run android    # Android emulator
npm run ios       # iOS simulator
npm run web       # Web browser

# Code quality
npm run lint      # ESLint checking
```

## Architecture

### Navigation Flow

1. **Splash** → **Shop Onboarding** (first time) → **Authentication** → **Main Dashboard (Tabs)**
2. Entry point: `navigation/RootNavigator.tsx` manages the overall flow
3. Authentication state currently hardcoded as `false` in RootNavigator
4. Main tabs focus on business operations: Orders, Shop Management, Customers, Finance, Delivery, Profile

### File-Based Routing Structure

- `app/(auth)/` - Authentication screens (shopkeeper login, OTP verification, shop registration)
- `app/(onboarding)/` - Shop onboarding flow (business details, documents, verification)
- `app/(tabs)/` - Main app screens:
  - `orders/` - Order management dashboard
  - `shop/` - Shop settings and availability management
  - `customers/` - Customer details and history
  - `finance/` - Refunds, invoices, and financial reports
  - `delivery/` - Delivery partner assignment
  - `profile/` - Shopkeeper profile and settings
- `app/_layout.tsx` - Root layout configuration

### Key Configuration Files

- **Metro Config**: Custom SVG support via `react-native-svg-transformer`
- **Tailwind Config**: Configured for `app` and `components` directories
- **TypeScript**: Path alias `@/*` points to root directory
- **Global Styles**: `app/global.css` for NativeWind/Tailwind styles

### Styling Approach

- Use NativeWind classes for styling (e.g., `className="flex-1 bg-white"`)
- Primary brand color: Orange (`bg-orange-500`, `text-orange-500`)
- Global styles defined in `app/global.css`

### Asset Management

- SVG files can be imported directly as React components
- Icons located in `assets/icons/`
- Images in `assets/images/`
- Onboarding assets in `assets/onboarding/`

## Important Development Notes

### Current State

- Shopkeeper-focused app in UI development phase
- Backend integration pending for order management and delivery systems
- Mock data and timeouts used for simulated async operations
- Future Ecoyaan platform integration planned
- No existing test suite implemented
- Clean git repository on main branch

### When Making Changes

1. Follow existing file-based routing patterns in the `app/` directory
2. Use NativeWind/Tailwind classes for styling consistency
3. Maintain TypeScript strict mode compliance
4. Test on multiple platforms using respective npm run commands
5. Run `npm run lint` before finalizing changes

## When Committing Changes

1. Please always commit each change in a separate commit.
2. Please always include a commit message that describes the changes like "fix: " or "feat: " or "refactor: " or "chore: " or "docs: " or "style: " or "test: " or "perf: " or "build: " or "ci: " or "revert: " or "other: "
3. Please always include a description of the changes in the commit message.

### Common Tasks

- **Adding new screens**: Create files in appropriate `app/` subdirectory
- **Modifying navigation**: Update `navigation/RootNavigator.tsx` or respective navigator files
- **Styling changes**: Use NativeWind classes or update `app/global.css`
- **Adding assets**: Place in appropriate `assets/` subdirectory and configure Metro if needed for new file types
- **Order management features**: Implement in `app/(tabs)/orders/` directory
- **Shop settings**: Add to `app/(tabs)/shop/` directory
- **Financial features**: Develop in `app/(tabs)/finance/` directory
- **Delivery management**: Build in `app/(tabs)/delivery/` directory

### Key Shopkeeper Features to Implement

1. **Order Dashboard**
   - Real-time order notifications
   - Order status management (pending, preparing, ready, delivered)
   - Order details view with customer information

2. **Shop Management**
   - Operating hours configuration
   - Shop availability toggle (open/closed)
   - Menu/inventory management

3. **Financial Operations**
   - Invoice generation
   - Refund processing
   - Sales reports and analytics

4. **Delivery Integration**
   - Delivery partner assignment interface
   - Tracking delivery status
   - Communication with delivery partners

5. **Customer Management**
   - Customer order history
   - Customer contact details
   - Customer preferences and notes
