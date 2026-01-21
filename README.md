# 🎨 Azure DevOps Syntax Highlighter

A Chrome extension that adds beautiful syntax highlighting to code diffs in Azure DevOps pull request reviews.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Version](https://img.shields.io/badge/Version-1.0.13-blue.svg)

## ✨ Features

- **Syntax Highlighting** - Beautiful, readable code highlighting in PR diffs
- **Multiple Themes** - Choose from 5 popular color schemes:
  - GitHub Light
  - GitHub Dark
  - Monokai
  - Dracula
  - One Dark
- **Auto Theme Detection** - Automatically matches Azure DevOps light/dark mode
- **Supported Languages** - JavaScript, TypeScript, JSON, Vue, CSS, SCSS, HTML
- **Non-intrusive** - Only highlights code in the diff view, not the file tree
- **Easy Toggle** - Quickly enable/disable from the popup

## 📸 Screenshots

| Popup                                 | Highlighted Code                    |
| ------------------------------------- | ----------------------------------- |
| Toggle highlighting and select themes | Beautiful syntax colors in PR diffs |

## 🚀 Installation

### From Chrome Web Store

_Coming soon_

### Manual Installation (Developer Mode)

1. Clone or download this repository
2. Install dependencies and build:
   ```bash
   pnpm install
   pnpm build
   ```
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable **Developer mode** (toggle in top right)
5. Click **Load unpacked**
6. Select the `build` folder from this project

## 🎯 Usage

1. Navigate to any Azure DevOps pull request
2. Click the extension icon in your toolbar
3. Toggle syntax highlighting on/off
4. Select your preferred theme
5. Enjoy beautifully highlighted code diffs!

## 🛠️ Development

### Prerequisites

- Node.js >= 14.18.0
- pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/brambekkers/azure-syntax-highlighting.git
cd azure-syntax-highlighting

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Project Structure

```
src/
├── contentScript/     # Main highlighting logic
│   ├── index.ts       # Content script entry point
│   ├── languages.ts   # Language configurations
│   └── storage.ts     # Chrome storage utilities
├── popup/             # Extension popup UI
│   ├── App.tsx        # Popup component
│   └── index.ts       # Popup entry point
├── options/           # Options page
│   ├── App.tsx        # Options component
│   └── index.ts       # Options entry point
├── background/        # Service worker
│   └── index.ts       # Background script
└── manifest.ts        # Extension manifest

public/
├── css/
│   └── highlight.css  # Theme stylesheets
├── icons/             # Extension icons
└── img/               # Images
```

## 🎨 Themes

| Theme            | Background | Description                        |
| ---------------- | ---------- | ---------------------------------- |
| **GitHub Light** | `#f6f8fa`  | Clean, light theme matching GitHub |
| **GitHub Dark**  | `#0d1117`  | Dark theme matching GitHub         |
| **Monokai**      | `#272822`  | Classic dark theme                 |
| **Dracula**      | `#282a36`  | Popular purple-tinted dark theme   |
| **One Dark**     | `#282c34`  | Atom's iconic dark theme           |

## 🔧 Technologies

- **[Kaioken](https://kaioken.dev/)** - Lightweight React-like UI framework
- **[highlight.js](https://highlightjs.org/)** - Syntax highlighting engine
- **[Vite](https://vitejs.dev/)** - Next-generation build tool
- **[CRXJS](https://crxjs.dev/)** - Chrome extension Vite plugin
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

**Bram Bekkers**

---

Made with ❤️ for better code reviews
