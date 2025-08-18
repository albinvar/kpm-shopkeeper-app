# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KPM is a React Native mobile application built with Expo for delivery/marketplace services. The app supports iOS, Android, and web platforms using a single codebase.

When Coding, please always follow the instructions in this file.
Double check every action you take.
If you are not sure about something, please ask me.

### The Codebase

1. When developing, please always make sure to keep the flow correct.
2. There is a flow for shopowners and customers.
3. The flow is defined in the `navigation/RootNavigator.tsx` file.
4. All other navigators are defined in the `navigation/` directory.
5. The `navigation/` directory is organized into the following subdirectories:
   - `auth/` - Authentication screens
   - `onboarding/` - Onboarding flow screens
   - `tabs/` - Main app screens (index/home, explore, profile)
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

1. **Splash** → **Onboarding** → **Authentication** → **Main App (Tabs)**
2. Entry point: `navigation/RootNavigator.tsx` manages the overall flow
3. Authentication state currently hardcoded as `false` in RootNavigator

### File-Based Routing Structure

- `app/(auth)/` - Authentication screens (login, otp, register, etc.)
- `app/(onboarding)/` - Onboarding flow screens
- `app/(tabs)/` - Main app screens (index/home, explore, profile)
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

- App is in UI development phase without backend integration
- Mock data and timeouts used for simulated async operations
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
