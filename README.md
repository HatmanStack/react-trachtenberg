<div align="center">

![Trachtenberg App Banner](public/og-image.jpg)

[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-454545?style=for-the-badge&logo=zustand&logoColor=white)](https://github.com/pmndrs/zustand)

A cross-platform mobile and web application to teach the [Trachtenberg method](https://en.wikipedia.org/wiki/Trachtenberg_system) of multiplication, a system of rapid mental calculation. The system was created by Jakow Trachtenberg, a Russian Jew, while in a Nazi concentration camp.

[Try It](https://trachtenberg.hatstack.fun)

---

</div>

## ✨ Features

* **Interactive Tutorial**: 21-step guided tutorial teaching the complete Trachtenberg multiplication method.
* **Practice Mode**: Solve random multiplication problems (4-digit × 3-digit) with a progressive answer-building UI.
* **Hint System**: Get step-by-step calculation guidance for practice problems.
* **Settings**: Customize your experience with options to toggle hints and other preferences.
* **Cross-Platform**: Runs on iOS, Android, and Web from a single TypeScript codebase.

---

## 💻 Tech Stack

* **Framework:** [React Native](https://reactnative.dev/)
* **Platform:** [Expo](https://expo.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **UI Library:** [React Native Paper](https://reactnativepaper.com/) (Material Design 3)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/)
* **Testing:** [Jest](https://jestjs.io/) with [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
* **Build:** EAS Build

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) v24
* [npm](https://www.npmjs.com/) or [Yarn](https://classic.yarnpkg.com/en/docs/install)
* [Expo Go](https://expo.dev/go) app on your iOS or Android device (for development)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd react-trachtenberg
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm start
    ```

4.  **Open the app:**
    * Scan the QR code from the terminal using the **Expo Go** app.
    * Or, press `a` for an Android Emulator / `i` for an iOS Simulator in the terminal.

---

## Available Scripts

```bash
# Start the Expo development server
npm start

# Run on a specific platform
npm run android
npm run ios
npm run web

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Lint the codebase
npm run lint

# Lint and auto-fix
npm run lint:fix
```

## Project Structure

```
app/              # Expo Router file-based routing (screens as routes)
src/
  screens/        # Screen components (LearnScreen, PracticeScreen, SettingsScreen)
  store/          # Zustand state management (appStore.ts)
  utils/          # Pure utility functions (Trachtenberg algorithm, validation, hints)
  components/     # Reusable UI components (AnswerButton, HintDisplay, etc.)
  data/           # Tutorial content and step definitions
  constants/      # Algorithm and timing constants
  hooks/          # Custom React hooks
  theme/          # Colors, spacing, React Native Paper theme
  types/          # TypeScript interfaces
__tests__/        # Jest tests mirroring src/ structure
```

## 📜 License

This project is licensed under the terms of the MIT License.
