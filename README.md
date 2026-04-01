# Puzzle Game - React Native

A sliding puzzle game built with React Native, TypeScript, and Expo. Features both number and photo puzzle modes with multiple grid sizes.

## Features

- **Multiple Grid Sizes**: 3×3, 4×4, and 5×5 puzzles
- **Two Game Modes**:
  - Number Mode: Classic numbered tiles
  - Photo Mode: Use custom images from gallery or camera
- **Intuitive Controls**: Tap tiles or swipe to move pieces
- **Game Statistics**: Move counter and timer
- **Smooth Animations**: LayoutAnimation for seamless tile movements
- **Solvable Puzzles**: Ensures all generated puzzles are solvable

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd puzzle-RN
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
```bash
# For Android
npm run android

# For iOS
npm run ios
```

## How to Play

1. **Choose Grid Size**: Select 3×3, 4×4, or 5×5 from the controls
2. **Select Game Mode**: Switch between Numbers and Photo modes
3. **Add Photo** (Photo mode only): Tap "Pick Image" to select from gallery or take a photo
4. **Move Tiles**: 
   - Tap a tile adjacent to the empty space to move it
   - Swipe a tile toward the empty space
5. **Solve the Puzzle**: Arrange tiles in order (1-8 for 3×3, 1-15 for 4×4, etc.)
6. **Track Progress**: Monitor your moves and time in the stats panel

## Technical Implementation

### Core Architecture

- **State Management**: Custom hook with useReducer for game state
- **Game Logic**: Solvable puzzle generation using inversion counting
- **UI Components**: Modular TypeScript components with ShadCN-inspired design
- **Animations**: React Native LayoutAnimation for smooth transitions
- **Gestures**: react-native-gesture-handler for swipe detection

### Key Components

- `PuzzleBoard`: Main game board with tile rendering and gesture handling
- `Tile`: Individual puzzle piece with number/photo display
- `GameControls`: Size selection, mode toggle, and game statistics
- `usePuzzleGame`: Custom hook managing game state and logic

### File Structure

```
src/
├── components/
│   ├── PuzzleBoard.tsx    # Main game board
│   ├── Tile.tsx           # Individual puzzle tile
│   └── GameControls.tsx   # Game controls and stats
├── hooks/
│   └── usePuzzleGame.ts   # Game state management
├── utils/
│   ├── puzzleLogic.ts     # Core game logic
│   └── imageUtils.ts      # Image picker utilities
types/
└── index.ts               # TypeScript interfaces
```

## Dependencies

- **expo**: ~53.0.22
- **react-native**: 0.79.6
- **react-native-gesture-handler**: For swipe gestures
- **react-native-reanimated**: Animation support
- **expo-image-picker**: Camera and gallery access
- **expo-image-manipulator**: Image processing

## Development

The project follows TypeScript best practices with:
- Interface definitions with 'I' prefix
- Comprehensive type safety
- Modular component architecture
- Clean separation of concerns

## Future Enhancements

- Undo/Redo functionality
- Difficulty levels with time constraints
- Hint system showing optimal moves
- Leaderboard and achievements
- Custom puzzle creation tools
- Haptic feedback for moves

---

## EAS (Expo Application Services)

This project uses **EAS Build** for cloud builds and **EAS Update** for over-the-air (OTA) JS updates.

### Setup

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Link this project to EAS (first time only)
eas init
```

### Build

```bash
# Build for production (Android AAB + iOS IPA)
eas build --platform android --profile production
eas build --platform ios --profile production

# Build both platforms at once
eas build --platform all --profile production

# Build for internal testing
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

> Builds run on Expo's cloud servers. When complete, a download link for the `.aab` / `.ipa` is provided.

### OTA Update (JS-only changes)

Use this instead of a full store release when only JavaScript/assets changed.

```bash
# Push an OTA update to production
eas update --channel production --message "Fix bug / update description"

# Push to preview channel for testing
eas update --channel preview --message "Test update"
```

> OTA updates are only delivered to devices whose `runtimeVersion` matches. A new binary build is required when native code changes.

### Channels

| Profile | Channel | Purpose |
|---|---|---|
| `development` | `development` | Dev client builds |
| `preview` | `preview` | Internal QA / testers |
| `production` | `production` | App Store / Play Store |
