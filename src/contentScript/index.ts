/**
 * Azure DevOps Syntax Highlighter - Content Script
 *
 * Detects code diffs in Azure DevOps pull request pages and applies
 * syntax highlighting using highlight.js
 */

// Immediate log to verify script is running - BEFORE any imports
console.log('[Azure Syntax Highlighter] Content script file starting to load...')

try {
  console.log('[Azure Syntax Highlighter] About to import highlight.js...')
} catch (e) {
  console.error('[Azure Syntax Highlighter] Early error:', e)
}

import hljs from 'highlight.js/lib/core'

console.log('[Azure Syntax Highlighter] highlight.js imported successfully')

// Import languages we support
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'

import { getLanguageForExtension, getExtensionFromPath } from './languages'
import { getSettings, onSettingsChange, type UserSettings } from './storage'

// Register languages with highlight.js
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)

// Track current settings
let currentSettings: UserSettings = {
  enabled: true,
  theme: 'auto',
}

// Track highlighted elements to avoid re-processing
const highlightedElements = new WeakSet<Element>()

/**
 * Detect if Azure DevOps is in dark mode
 */
function isAzureDevOpsDarkMode(): boolean {
  // Azure DevOps adds data-theme attribute or specific classes for dark mode
  const body = document.body
  return (
    body.dataset.theme?.includes('dark') ||
    body.classList.contains('dark-theme') ||
    document.documentElement.dataset.theme?.includes('dark') ||
    // Fallback: check computed background color
    getComputedStyle(body).backgroundColor.includes('rgb(30') ||
    getComputedStyle(body).backgroundColor.includes('rgb(31') ||
    getComputedStyle(body).backgroundColor.includes('rgb(32')
  )
}

/**
 * Get the current theme class based on settings
 */
function getThemeClass(): string {
  if (currentSettings.theme === 'auto') {
    return isAzureDevOpsDarkMode() ? 'hljs-github-dark' : 'hljs-github-light'
  }
  return `hljs-${currentSettings.theme}`
}

const THEME_CLASSES = [
  'hljs-github-light',
  'hljs-github-dark',
  'hljs-monokai',
  'hljs-dracula',
  'hljs-one-dark',
]

// Theme background colors
const THEME_BACKGROUNDS: Record<string, string> = {
  'hljs-github-light': '#f6f8fa',
  'hljs-github-dark': '#0d1117',
  'hljs-monokai': '#272822',
  'hljs-dracula': '#282a36',
  'hljs-one-dark': '#282c34',
}

// Theme line number colors
const THEME_LINE_COLORS: Record<string, string> = {
  'hljs-github-light': '#1f2328',
  'hljs-github-dark': '#6e7681',
  'hljs-monokai': '#90908a',
  'hljs-dracula': '#6272a4',
  'hljs-one-dark': '#495162',
}

/**
 * Apply background color directly to Monaco editor elements using inline styles
 */
function applyMonacoBackground(
  editor: Element,
  backgroundColor: string | null,
  lineColor: string | null,
): void {
  console.log(
    `[Azure Syntax Highlighter] Applying background: ${backgroundColor}, lineColor: ${lineColor}`,
  )

  const backgroundSelectors = [
    '.monaco-editor-background',
    '.lines-content',
    '.margin',
    '.overflow-guard',
  ]

  backgroundSelectors.forEach((selector) => {
    const elements = editor.querySelectorAll(selector)
    console.log(
      `[Azure Syntax Highlighter] Found ${elements.length} elements for selector: ${selector}`,
    )
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        if (backgroundColor) {
          el.style.setProperty('background-color', backgroundColor, 'important')
        } else {
          el.style.removeProperty('background-color')
        }
      }
    })
  })

  // Also style line numbers
  const lineNumbers = editor.querySelectorAll('.line-numbers')
  lineNumbers.forEach((el) => {
    if (el instanceof HTMLElement) {
      if (lineColor) {
        el.style.setProperty('color', lineColor, 'important')
      } else {
        el.style.removeProperty('color')
      }
    }
  })

  // Style current line
  const currentLines = editor.querySelectorAll('.view-overlays .current-line')
  currentLines.forEach((el) => {
    if (el instanceof HTMLElement) {
      if (backgroundColor) {
        el.style.setProperty('background-color', backgroundColor, 'important')
      } else {
        el.style.removeProperty('background-color')
      }
    }
  })
}

/**
 * Update theme classes on all already-highlighted elements and Monaco editors
 */
function updateHighlightedThemes(): void {
  const newThemeClass = getThemeClass()
  const highlightedSpans = document.querySelectorAll('.azure-syntax-highlighted')

  console.log(
    `[Azure Syntax Highlighter] Updating ${highlightedSpans.length} elements to theme: ${newThemeClass}`,
  )
  console.log(`[Azure Syntax Highlighter] THEME_BACKGROUNDS keys:`, Object.keys(THEME_BACKGROUNDS))
  console.log(
    `[Azure Syntax Highlighter] Background for ${newThemeClass}:`,
    THEME_BACKGROUNDS[newThemeClass],
  )

  highlightedSpans.forEach((span) => {
    // Remove all theme classes and add new one
    span.classList.remove(...THEME_CLASSES)
    span.classList.add(newThemeClass)
  })

  // Update Monaco editor containers with inline styles
  updateMonacoEditorThemes(newThemeClass)
}

/**
 * Apply theme to Monaco editor containers using inline styles
 */
function updateMonacoEditorThemes(themeClass: string): void {
  const monacoEditors = document.querySelectorAll('.monaco-editor.azure-syntax-editor')
  const backgroundColor = THEME_BACKGROUNDS[themeClass] || null
  const lineColor = THEME_LINE_COLORS[themeClass] || null

  console.log(
    `[Azure Syntax Highlighter] updateMonacoEditorThemes: themeClass=${themeClass}, bg=${backgroundColor}, ${monacoEditors.length} editors`,
  )

  monacoEditors.forEach((editor) => {
    applyMonacoBackground(editor, backgroundColor, lineColor)
  })
}

/**
 * Remove all syntax highlighting from the page
 */
function removeAllHighlighting(): void {
  const highlightedSpans = document.querySelectorAll('.azure-syntax-highlighted')
  console.log(
    `[Azure Syntax Highlighter] Removing highlighting from ${highlightedSpans.length} elements`,
  )

  highlightedSpans.forEach((span) => {
    // Get the text content and replace the span with just text
    const textContent = span.textContent || ''
    const parent = span.parentElement
    if (parent) {
      parent.textContent = textContent
    }
  })

  // Clear the WeakSet by creating a new one (can't clear WeakSet directly)
  // This is handled by the page refresh or navigation
}

/**
 * Toggle highlighting visibility without removing elements
 */
function setHighlightingVisible(visible: boolean): void {
  const highlightedSpans = document.querySelectorAll('.azure-syntax-highlighted')
  const monacoEditors = document.querySelectorAll('.monaco-editor.azure-syntax-editor')
  console.log(
    `[Azure Syntax Highlighter] Setting visibility to ${visible} for ${highlightedSpans.length} elements, ${monacoEditors.length} editors`,
  )

  highlightedSpans.forEach((span) => {
    if (visible) {
      span.classList.remove('azure-syntax-hidden')
    } else {
      span.classList.add('azure-syntax-hidden')
    }
  })

  // Toggle Monaco editor backgrounds using inline styles
  const themeClass = getThemeClass()
  monacoEditors.forEach((editor) => {
    if (visible) {
      // Re-apply theme colors
      const backgroundColor = THEME_BACKGROUNDS[themeClass] || null
      const lineColor = THEME_LINE_COLORS[themeClass] || null
      applyMonacoBackground(editor, backgroundColor, lineColor)
    } else {
      // Remove all our inline styles to restore original
      applyMonacoBackground(editor, null, null)
    }
  })
}

/**
 * Find the current file name from the Azure DevOps UI
 */
function getCurrentFileName(): string | null {
  // Try different selectors for file name in Azure DevOps PR view
  const selectors = [
    '.repos-summary-header .file-name',
    '.file-path',
    '.repos-changes-explorer-item.selected .file-name',
    '[data-focuszone-id] .file-name',
    '.repos-changes-viewer-header .text-ellipsis',
    '.file-header .file-path',
    // Breadcrumb in file viewer
    '.repos-file-header .breadcrumb-item:last-child',
    // Additional Azure DevOps selectors
    '.bolt-header-title',
    '.repos-compare-toolbar .secondary-text',
    '[class*="fileName"]',
    '[class*="file-name"]',
    '.diff-header-file-name',
  ]

  for (const selector of selectors) {
    const el = document.querySelector(selector)
    if (el?.textContent) {
      console.log(
        `[Azure Syntax Highlighter] Found filename with selector "${selector}":`,
        el.textContent.trim(),
      )
      return el.textContent.trim()
    }
  }

  // Try to get from URL - check for path parameter
  const urlMatch = /\/pullrequest\/\d+.*[?&]path=([^&]+)/i.exec(globalThis.location.href)
  if (urlMatch) {
    const path = decodeURIComponent(urlMatch[1])
    console.log('[Azure Syntax Highlighter] Got filename from URL path param:', path)
    return path
  }

  // Try to extract from iteration path in URL
  const iterationMatch = /iteration=\d+&base=\d+&path=([^&]+)/i.exec(globalThis.location.href)
  if (iterationMatch) {
    const path = decodeURIComponent(iterationMatch[1])
    console.log('[Azure Syntax Highlighter] Got filename from iteration path:', path)
    return path
  }

  console.log('[Azure Syntax Highlighter] Could not find filename. URL:', globalThis.location.href)
  return null
}

/**
 * Check if an element is inside the file explorer sidebar (should NOT be highlighted)
 */
function isInSidebar(element: Element): boolean {
  return (
    element.closest(
      '.repos-changes-explorer-tree, .repos-file-explorer-tree, .vss-Splitter--pane-fixed, .bolt-table-container',
    ) !== null
  )
}

/**
 * Apply syntax highlighting to a code line element
 */
function highlightCodeLine(lineElement: Element, language: string): void {
  if (highlightedElements.has(lineElement)) {
    return
  }

  // Skip if this element is in the sidebar
  if (isInSidebar(lineElement)) {
    return
  }

  // Find the actual code content within the line
  const codeContent = lineElement.querySelector(
    '.code-line-content, .repos-line-content, td.content',
  )
  const target = codeContent || lineElement

  // Get the text content
  const code = target.textContent || ''
  if (!code.trim()) {
    return
  }

  try {
    const result = hljs.highlight(code, { language, ignoreIllegals: true })
    const themeClass = getThemeClass()

    // Create a span with highlighted content
    const highlightedSpan = document.createElement('span')
    highlightedSpan.innerHTML = result.value
    highlightedSpan.className = `azure-syntax-highlighted ${themeClass}`

    // Replace content while preserving structure
    target.innerHTML = ''
    target.appendChild(highlightedSpan)

    highlightedElements.add(lineElement)

    // Mark the Monaco editor container and apply inline background styles
    const monacoEditor = lineElement.closest('.monaco-editor')
    if (monacoEditor && !monacoEditor.classList.contains('azure-syntax-editor')) {
      monacoEditor.classList.add('azure-syntax-editor')
      // Apply background color immediately using inline styles
      const backgroundColor = THEME_BACKGROUNDS[themeClass] || null
      const lineColor = THEME_LINE_COLORS[themeClass] || null
      applyMonacoBackground(monacoEditor, backgroundColor, lineColor)
    }
  } catch (err) {
    console.warn('[Azure Syntax Highlighter] Failed to highlight:', err)
  }
}

/**
 * Process all code lines in the current view
 */
function processCodeLines(): void {
  if (!currentSettings.enabled) {
    return
  }

  const fileName = getCurrentFileName()
  if (!fileName) {
    return
  }

  const extension = getExtensionFromPath(fileName)
  const language = getLanguageForExtension(extension)

  if (!language) {
    return
  }

  console.log(`[Azure Syntax Highlighter] Processing ${fileName} as ${language}`)

  // Selectors for actual code diff lines (NOT file tree/sidebar)
  const lineSelectors = [
    // Monaco editor lines (used in Azure DevOps diff view)
    '.monaco-editor .view-line',
    // Specific diff content areas
    '.repos-diff-contents .view-line',
    '.repos-summary-diff .view-line',
    // Legacy selectors
    '.repos-line-content',
    '.code-line-content',
  ]

  let totalFound = 0
  for (const selector of lineSelectors) {
    const lines = document.querySelectorAll(selector)
    if (lines.length > 0) {
      console.log(
        `[Azure Syntax Highlighter] Found ${lines.length} elements with selector "${selector}"`,
      )
      // Filter out sidebar elements and process
      const validLines = Array.from(lines).filter((line) => !isInSidebar(line))
      console.log(
        `[Azure Syntax Highlighter] ${validLines.length} lines after filtering out sidebar`,
      )
      totalFound += validLines.length
      validLines.forEach((line) => highlightCodeLine(line, language))
    }
  }

  if (totalFound === 0) {
    console.log('[Azure Syntax Highlighter] No code lines found. Looking for Monaco editors...')
    const monacoEditors = document.querySelectorAll('.monaco-editor')
    console.log(`[Azure Syntax Highlighter] Found ${monacoEditors.length} Monaco editors`)
    monacoEditors.forEach((editor, i) => {
      const inSidebar = isInSidebar(editor)
      console.log(
        `[Azure Syntax Highlighter] Editor ${i}: inSidebar=${inSidebar}, classes=${editor.className}`,
      )
    })
  }
}

/**
 * Set up MutationObserver to watch for dynamically loaded content
 */
/**
 * Check if an element is code-related
 */
function isCodeRelatedElement(element: Element): boolean {
  return (
    element.classList?.contains('repos-line') ||
    element.classList?.contains('code-line') ||
    element.classList?.contains('view-line') ||
    element.classList?.contains('monaco-editor') ||
    element.querySelector?.('.repos-line, .code-line, .diff-line, .view-line') !== null
  )
}

/**
 * Check if mutation contains code-related nodes
 */
function hasCodeRelatedNodes(mutation: MutationRecord): boolean {
  for (const node of mutation.addedNodes) {
    if (node instanceof Element && isCodeRelatedElement(node)) {
      return true
    }
  }
  return false
}

function setupObserver(): void {
  const observer = new MutationObserver((mutations) => {
    const shouldProcess = mutations.some(
      (mutation) => mutation.addedNodes.length > 0 && hasCodeRelatedNodes(mutation),
    )

    if (shouldProcess) {
      // Debounce processing
      requestAnimationFrame(() => processCodeLines())
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  console.log('[Azure Syntax Highlighter] Observer started')

  // Set up a separate observer to watch for Monaco style changes and re-apply our backgrounds
  setupMonacoStyleObserver()
}

/**
 * Watch for Monaco editor style changes and re-apply our background colors
 */
function setupMonacoStyleObserver(): void {
  const monacoObserver = new MutationObserver((mutations) => {
    if (!currentSettings.enabled) return

    // Check if any mutation affected our styled editors
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const target = mutation.target as Element
        const editor = target.closest('.monaco-editor.azure-syntax-editor')
        if (editor) {
          // Re-apply our styles
          const themeClass = getThemeClass()
          const backgroundColor = THEME_BACKGROUNDS[themeClass] || null
          const lineColor = THEME_LINE_COLORS[themeClass] || null
          applyMonacoBackground(editor, backgroundColor, lineColor)
        }
      }
    }
  })

  // Observe the entire document for style attribute changes
  monacoObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['style'],
    subtree: true,
  })

  console.log('[Azure Syntax Highlighter] Monaco style observer started')
}

/**
 * Handle URL changes (SPA navigation)
 */
function setupUrlChangeListener(): void {
  let lastUrl = globalThis.location.href

  const checkUrlChange = (): void => {
    if (globalThis.location.href !== lastUrl) {
      lastUrl = globalThis.location.href
      console.log('[Azure Syntax Highlighter] URL changed, reprocessing...')
      // Reset highlighted elements for new page
      setTimeout(() => processCodeLines(), 500)
    }
  }

  // Listen for popstate (back/forward navigation)
  globalThis.addEventListener('popstate', checkUrlChange)

  // Poll for URL changes (for SPA navigation)
  setInterval(checkUrlChange, 1000)
}

/**
 * Initialize the content script
 */
async function init(): Promise<void> {
  console.log('[Azure Syntax Highlighter] 🚀 Initializing on:', globalThis.location.href)
  console.log('[Azure Syntax Highlighter] Document readyState:', document.readyState)

  // Load settings
  currentSettings = await getSettings()
  console.log('[Azure Syntax Highlighter] Settings loaded:', currentSettings)

  // Listen for settings changes
  onSettingsChange((settings) => {
    console.log('[Azure Syntax Highlighter] Settings changed:', settings)
    const themeChanged = currentSettings.theme !== settings.theme
    const enabledChanged = currentSettings.enabled !== settings.enabled
    currentSettings = settings

    if (enabledChanged) {
      // Toggle visibility of existing highlights
      setHighlightingVisible(settings.enabled)
    }

    if (themeChanged && settings.enabled) {
      // Update theme on all already-highlighted elements
      updateHighlightedThemes()
    }

    // Process new lines if enabled
    if (settings.enabled) {
      processCodeLines()
    }
  })

  // Wait for page to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[Azure Syntax Highlighter] DOMContentLoaded fired')
      setupObserver()
      setupUrlChangeListener()
      // Delay initial processing to let Azure DevOps render
      setTimeout(() => {
        console.log('[Azure Syntax Highlighter] Running initial processCodeLines after delay')
        processCodeLines()
      }, 2000)
    })
  } else {
    console.log('[Azure Syntax Highlighter] Document already loaded, setting up...')
    setupObserver()
    setupUrlChangeListener()
    // Delay initial processing to let Azure DevOps finish rendering
    setTimeout(() => {
      console.log('[Azure Syntax Highlighter] Running initial processCodeLines after delay')
      processCodeLines()
    }, 2000)
  }
}

// Start the extension
init()
