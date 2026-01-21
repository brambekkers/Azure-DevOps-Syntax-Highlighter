# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.13] - 2026-01-21

### Added

- Debug logging for theme and background application
- Monaco editor style observer for persistent backgrounds

### Fixed

- Background color persistence when clicking in the editor

## [1.0.12] - 2026-01-21

### Changed

- Switched from CSS classes to inline styles for Monaco editor backgrounds
- MutationObserver now watches for Monaco style changes

### Fixed

- Background not resetting when disabling syntax highlighting

## [1.0.11] - 2026-01-21

### Fixed

- More specific CSS selectors to override Monaco `.vs` and `.vs-dark` themes
- Added `.overflow-guard` styling for better coverage

## [1.0.10] - 2026-01-21

### Added

- Monaco editor background theming for all themes
- Line number colors matching each theme
- Theme backgrounds: GitHub Light/Dark, Monokai, Dracula, One Dark

## [1.0.9] - 2026-01-21

### Added

- Enable/disable toggle functionality with `setHighlightingVisible()`
- `azure-syntax-hidden` CSS class for toggling visibility
- Background colors for highlighted code spans

## [1.0.8] - 2026-01-21

### Added

- Three new themes: Monokai, Dracula, One Dark
- Theme selector with 6 options (including Auto)

### Changed

- Updated popup and options page with new theme options

## [1.0.7] - 2026-01-21

### Added

- `updateHighlightedThemes()` function for live theme switching
- Theme changes now apply to existing highlighted elements

## [1.0.6] - 2026-01-21

### Changed

- Vue files now use TypeScript highlighting for better script support
- Enhanced color contrast with `!important` overrides

## [1.0.5] - 2026-01-21

### Fixed

- Sidebar file list no longer gets syntax highlighted
- Added `isInSidebar()` check to exclude file tree elements

## [1.0.4] - 2026-01-21

### Fixed

- Content script now runs correctly on Azure DevOps pages
- Fixed `web_accessible_resources` for CRXJS dynamic imports

## [1.0.3] - 2026-01-21

### Fixed

- Build issues with top-level await
- CSS file copying to build output

## [1.0.2] - 2026-01-21

### Added

- Language configuration system
- Support for JavaScript, TypeScript, JSON, Vue, CSS, SCSS, HTML

## [1.0.1] - 2026-01-21

### Added

- Chrome storage for user settings
- Popup UI with toggle and theme selector
- Options page for detailed settings

## [1.0.0] - 2026-01-21

### Added

- Initial release
- Syntax highlighting for Azure DevOps PR diffs
- GitHub Light and Dark themes
- Auto theme detection
- MutationObserver for dynamic content
