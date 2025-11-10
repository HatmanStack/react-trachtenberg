# Trachtenberg Multiplication - React Native

A cross-platform mobile and web application teaching the Trachtenberg speed multiplication system. This is a modern React Native implementation migrated from the original Android app.

## Overview

The Trachtenberg system is a system of rapid mental calculation developed by Jakow Trachtenberg. This app provides:

- **Interactive Tutorial**: 18-step guided tutorial teaching the Trachtenberg multiplication method
- **Practice Mode**: Random multiplication problems (4-digit × 3-digit) with progressive answer building
- **Hint System**: Step-by-step calculation guidance (Phase 4)
- **Settings**: Customizable hint options and preferences

## Tech Stack

- **Framework**: Expo SDK 54 with React Native
- **Language**: TypeScript (strict mode)
- **UI Library**: React Native Paper (Material Design 3)
- **State Management**: Zustand with AsyncStorage persistence
- **Navigation**: React Navigation (hybrid: tabs for web, stack for mobile)
- **Testing**: Jest with React Native Testing Library
- **Build**: EAS Build for iOS and Android

## Installation

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Expo CLI (installed globally): `npm install -g expo-cli`
- For iOS development: macOS with Xcode
- For Android development: Android Studio and Android SDK

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd android-trachtenberg/Migration/expo-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Running the App

### Web
```bash
npm run web
```
Open [http://localhost:8081](http://localhost:8081) in your browser.

### iOS
```bash
npm run ios
```
Requires macOS with Xcode installed. Alternatively, use the Expo Go app on your iOS device.

### Android
```bash
npm run android
```
Requires Android Studio and an emulator/device. Alternatively, use the Expo Go app on your Android device.

### Expo Go (Development)
1. Install Expo Go on your mobile device (iOS/Android)
2. Run `npm start`
3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run web` - Start the web version
- `npm run ios` - Start on iOS simulator
- `npm run android` - Start on Android emulator
- `npm test` - Run all tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Project Structure

```
expo-project/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── AnswerButton.tsx
│   │   └── HighlightedText.tsx
│   ├── screens/        # Screen components
│   │   ├── LearnScreen.tsx
│   │   ├── PracticeScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/     # Navigation configuration
│   │   ├── index.tsx
│   │   ├── TabNavigator.tsx
│   │   └── StackNavigator.tsx
│   ├── store/          # Zustand state management
│   │   ├── appStore.ts
│   │   └── middleware/
│   ├── utils/          # Utility functions
│   │   ├── answerChoices.ts
│   │   ├── answerValidator.ts
│   │   ├── problemGenerator.ts
│   │   ├── textHighlighter.ts
│   │   └── tutorialHighlighter.ts
│   ├── data/           # Static data and content
│   │   └── tutorialContent.ts
│   ├── theme/          # Theme configuration
│   │   ├── constants.ts
│   │   └── paperTheme.ts
│   └── types/          # TypeScript type definitions
│       └── index.ts
├── __tests__/          # Test files (mirrors src/ structure)
├── assets/             # Images, fonts, and other assets
├── App.tsx             # Root application component
├── app.json            # Expo configuration
├── tsconfig.json       # TypeScript configuration
├── jest.config.js      # Jest configuration
└── package.json        # Dependencies and scripts
```

## Testing

### Running Tests
```bash
npm test
```

### Running Tests in Watch Mode
```bash
npm run test:watch
```

### Generating Coverage Report
```bash
npm run test:coverage
```

**Note**: Jest tests are currently affected by Expo SDK 54's "winter" runtime compatibility issue. This is documented and will be resolved in Phase 8 testing updates.

## Building for Production

### EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for Android:
```bash
eas build --platform android --profile production
```

4. Build for iOS:
```bash
eas build --platform ios --profile production
```

### Local Development Build

Web:
```bash
npx expo export:web
```

## Features by Phase

### ✅ Phase 1: Infrastructure
- Expo project setup with TypeScript
- React Native Paper theming
- Zustand store with persistence
- Hybrid navigation (tabs/stack)

### ✅ Phase 2: Tutorial System
- 18-step interactive tutorial
- Text highlighting for digit emphasis
- Tutorial navigation (Next/Back)
- Equation display with character highlighting

### ✅ Phase 3: Practice Mode
- Random problem generation (4-digit × 3-digit)
- Multiple choice answers (4 buttons)
- Progressive answer building (right-to-left)
- Answer validation and feedback
- Auto-advance to next problem

### 🚧 Phase 4: Hint System (In Progress)
- Step-by-step calculation guidance
- Digit-by-digit hint display
- Toggle hints on/off

### 🚧 Phase 5-8: Upcoming
- Settings screen implementation
- Platform-specific UX improvements
- Animations and polish
- Comprehensive testing and deployment

## Known Issues

1. **Jest Configuration**: Expo SDK 54's "winter" runtime has compatibility issues with jest-expo. Tests are written but may not run successfully until this is resolved.

2. **AsyncStorage Warnings**: Development mode may show AsyncStorage warnings. These are suppressed in production builds.

## Contributing

This is a migration project from Android to React Native. When contributing:

1. Follow TypeScript strict mode
2. Use conventional commit messages (feat:, fix:, test:, etc.)
3. Write tests for new utilities and components
4. Ensure `npx tsc --noEmit` passes before committing
5. Follow the existing code structure and patterns

## License

[Specify license here]

## Credits

- Original Android app by [Original Author]
- Trachtenberg System: Developed by Jakow Trachtenberg
- React Native migration: [Your Name/Team]
