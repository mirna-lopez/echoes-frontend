# Echoes of the Estate - Frontend

An atmospheric, AI-powered ghost story game built with React. Explore a haunted mansion, communicate with Eleanor Ashford's melancholic spirit, and uncover the mysteries of the estate.

## 🎮 Live Demo

**➡️ [Play Now](https://echoes-estate-game.netlify.app) ⬅️**
**Password:** `echoes2025`

## 🎮 Features

- **Interactive Story**: Navigate through 6 atmospheric rooms in a haunted mansion
- **Multi-Language AI**: Eleanor speaks 6 languages (English, Spanish, Portuguese, French, Hindi, Japanese) with full personality localization
- **AI-Powered Ghost**: Chat with Eleanor using Claude AI for dynamic, contextual responses
- **Trust System**: Build relationship with the ghost through your interactions
- **Atmospheric Audio**: Room-specific music with smooth transitions and fade effects
- **Save System**: 
  - Auto-save to browser localStorage
  - Generate portable save codes to continue on any device
- **Responsive Design**: Optimized for desktop and mobile devices
- **Typewriter Effect**: Immersive text reveal for ghost messages

## 🌍 Multi-Language Support

**Eleanor speaks 6 languages fluently while maintaining her Victorian ghost personality:**

- 🇺🇸 English
- 🇪🇸 Spanish  
- 🇵🇹 Portuguese
- 🇫🇷 French
- 🇮🇳 Hindi
- 🇯🇵 Japanese

**Technical Implementation:**
- Not just translation - full personality localization
- AI maintains Victorian speech patterns in all languages
- Culturally appropriate responses for each language
- Seamless language switching without losing conversation context
 
## 🏗️ Architecture

### Project Structure

```
src/
├── App.js                          # Main application entry point
├── index.js                        # React root
├── contexts/
│   └── GameStateContext.js         # Global state management with React Context
├── components/
│   ├── WelcomeScreen.js            # Initial landing page
│   ├── PasswordModal.js            # Authentication component
│   └── GameInterface.js            # Main game UI with all features
└── data/
    └── rooms.js                    # Room configurations and API settings
```

### Key Design Patterns

- **Context API**: Centralized state management without prop drilling
- **Component Composition**: Modular, reusable components
- **Separation of Concerns**: Logic (context), UI (components), Data (rooms)
- **Custom Hooks**: useGameState hook for easy state access

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:3001`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mirna-lopez/echoes-frontend.git
   cd echoes-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Environment Setup

The app expects a backend server at `http://localhost:3001`. Update `src/data/rooms.js` if your backend runs on a different port:

```javascript
export const API_CONFIG = {
  DEMO_SERVER: 'http://localhost:3001'  // Change this if needed
};
```

## 🎨 Game Flow

1. **Welcome Screen**: Atmospheric landing page with pulsing animation
2. **Password Authentication**: Enter password (`echoes2025`) to unlock the game
3. **Main Game Interface**:
   - Navigate between interconnected rooms
   - Chat with Eleanor's ghost using natural language
   - Build trust through empathetic interactions
   - Save/load progress
   - Control music

## 🔧 Technologies Used

- **React** (18.x): UI framework
- **React Context API**: State management
- **CSS-in-JS**: Inline styling for component encapsulation
- **Fetch API**: Backend communication
- **Web Audio API**: Music playback with fade effects
- **localStorage**: Browser-based save system
- **Base64 encoding**: Portable save codes

## 🎵 Audio System

The game features an immersive audio system with:
- Room-specific background music
- Smooth fade in/out transitions between rooms
- Welcome screen music
- Mute toggle
- Volume control (0.3 default)

Music credits: Kevin MacLeod

## 💾 Save System

### Auto-Save
Game progress is automatically saved to browser localStorage on:
- Room changes
- Trust level changes
- Conversation updates

### Save Codes
Generate a portable save code to:
- Continue on another device
- Share progress with others
- Backup your game state

Save codes encode:
- Current room
- Last 20 conversation messages
- Ghost trust level
- Timestamp

## 🎭 Game Mechanics

### Ghost Trust System
- Starts at 0%
- Increases through empathetic dialogue
- Keywords like "sorry", "help", "comfort" increase trust by 5%
- Affects Eleanor's responses (higher trust = more revealing)
 
 ### Multi-Language AI Conversations
- Switch between 6 languages at any time
- Eleanor maintains consistent Victorian personality across all languages
- Trust system works identically in all languages
- Cultural adaptation for appropriate ghost responses 

### Room Navigation
- 6 interconnected rooms
- Each room has unique:
  - Description
  - Background image
  - Ambient music
  - Connected rooms

## 🔐 Authentication

Default password: `echoes2025`

Password format: `echoes` + current year

## 📱 Responsive Design

Breakpoints:
- **Desktop**: Full layout with absolute positioned controls
- **Mobile** (≤768px): 
  - Stacked layout
  - Larger touch targets
  - Simplified navigation
  - Adjusted font sizes

## 🐛 Troubleshooting

### Common Issues

**Music not playing**
- Browser may block autoplay
- Click anywhere on the page to start audio
- Check console for errors

**Backend connection failed**
- Ensure backend server is running on port 3001
- Check CORS settings on backend
- Verify password is correct

**Save codes not working**
- Ensure code is copied completely
- Check for extra spaces
- Try generating a new code

### Development Issues

**Infinite render loop**
- Check useEffect dependencies
- Ensure functions in dependencies are memoized

**Warning about exhaustive-deps**
- Already handled with eslint comments
- Safe to ignore for mount-only effects

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `build/` folder.

### Environment Variables

For production, update the API endpoint:

1. Create `.env.production`:
   ```
   REACT_APP_API_URL= https://github.com/mirna-lopez/-echoes-backend.git
   ```

2. Update `src/data/rooms.js`:
   ```javascript
   export const API_CONFIG = {
     DEMO_SERVER: process.env.REACT_APP_API_URL || 'http://localhost:3001'
   };
   ```

## 🎯 Future Enhancements

- [ ] Multiple endings based on trust level
- [ ] More rooms to explore
- [ ] Inventory system
- [ ] Achievements/unlockables
- [ ] Multiplayer support
- [ ] Voice synthesis for Eleanor
- [ ] Mobile app version

## 👥 Credits

- **AI**: Claude (Anthropic) for ghost conversations
- **Music**: Kevin MacLeod (incompetech.com)
- **Fonts**: Google Fonts (Creepster, Special Elite)
- **Images**: Custom atmospheric artwork

## 📄 License

All music tracks are by **Kevin MacLeod** (incompetech.com)  
Licensed under Creative Commons: By Attribution 4.0 License  
http://creativecommons.org/licenses/by/4.0/

### Tracks Used:

1. **"Thunder Dreams"** - Entrance Hall
   - Thunder Dreams" Kevin MacLeod (incompetech.com)
     Licensed under Creative Commons: By Attribution 4.0 License
     http://creativecommons.org/licenses/by/4.0/

2. **"The Chamber"** - Forbidden Library
   - "The Chamber" Kevin MacLeod (incompetech.com)
      Licensed under Creative Commons: By Attribution 4.0 License
      http://creativecommons.org/licenses/by/4.0/

3. **"Ghostpocalypse"** - Cursed Dining Room
   -"Ghostpocalypse - 3 Road of Trials" Kevin MacLeod (incompetech.com)
     Licensed under Creative Commons: By Attribution 4.0 License
     http://creativecommons.org/licenses/by/4.0/

4. **"Dreamy Flashback"** - Dead Garden
   - "Dreamy Flashback" Kevin MacLeod (incompetech.com)
     Licensed under Creative Commons: By Attribution 4.0 License
     http://creativecommons.org/licenses/by/4.0/

5. **"Atlantean Twilight"** - Eleanor's Study
   - "Atlantean Twilight" Kevin MacLeod (incompetech.com)
      Licensed under Creative Commons: By Attribution 4.0 License
      http://creativecommons.org/licenses/by/4.0/

6. **"Decay"** - Abandoned Kitchen
   - "Decay" Kevin MacLeod (incompetech.com)
      Licensed under Creative Commons: By Attribution 4.0 License
      http://creativecommons.org/licenses/by/4.0/

7. **"Cryptic Sorrow"** - Welcome Screen
   - "Cryptic Sorrow" Kevin MacLeod (incompetech.com)
      Licensed under Creative Commons: By Attribution 4.0 License
      http://creativecommons.org/licenses/by/4.0/



## 📧 Contact

Email: lopez.mirna2807@gmail.com
Linkedin: https://www.linkedin.com/in/mirna-lopez/
GitHub: https://github.com/mirna-lopez

---

**Built for BUILD Halloween Hacks 2025** 🎃

*"The past never truly dies... it merely waits in the shadows."*
