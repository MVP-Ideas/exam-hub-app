# Quiz Application

## Overview

This is a **React-based quiz application** built with **Next.js**. The app supports both **single-choice and multiple-choice** questions and allows users to review their answers before submitting.

## Features

- 📝 **Single and multiple-choice questions**
- 🎯 **Answer validation** (multiple-answer questions require all correct answers selected)
- 📊 **Progress tracking**
- 🏆 **Score calculation**
- 🔄 **Navigation between questions**
- 📱 **PWA support** (for Android compatibility)

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or later recommended)
- **pnpm** (or npm/yarn)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/quiz-app.git
   cd quiz-app
   ```
2. Install dependencies:
   ```sh
   pnpm install  # or `npm install` / `yarn install`
   ```

## Running the Application

### Development Mode

```sh
pnpm dev  # or `npm run dev` / `yarn dev`
```

This starts the app in development mode, accessible at `http://localhost:3000`.

### Production Mode

1. Build the application:
   ```sh
   pnpm build  # or `npm run build` / `yarn build`
   ```
2. Start the production server:
   ```sh
   pnpm start  # or `npm run start` / `yarn start`
   ```

## PWA Support

To enable **PWA functionality**:

1. Ensure you have added the `next-pwa` plugin in `next.config.js`.
2. The service worker will be generated during the build process.

## Dependencies

### Main Dependencies:

- **Next.js** - React framework for server-side rendering.
- **TypeScript** - Type safety for improved development experience.
- **ShadCN** - UI components for accessibility and customization.
- **Zustand** - State management for React applications.

### Dev Dependencies:

- **ESLint** - Linting for code quality.
- **Prettier** - Code formatting.

## Contribution

Feel free to **fork** the repository and submit a pull request for improvements or bug fixes. 🚀
