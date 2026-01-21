/**
 * Language configuration for syntax highlighting
 * Maps file extensions to highlight.js language identifiers
 *
 * To add a new language:
 * 1. Add the file extension(s) and highlight.js language name to this map
 * 2. Import and register the language in index.ts if it's not a common language
 */

export interface LanguageConfig {
  name: string // Display name
  hljs: string // highlight.js language identifier
  extensions: string[] // File extensions (without dot)
}

export const languages: LanguageConfig[] = [
  {
    name: 'JavaScript',
    hljs: 'javascript',
    extensions: ['js', 'mjs', 'cjs'],
  },
  {
    name: 'TypeScript',
    hljs: 'typescript',
    extensions: ['ts', 'mts', 'cts'],
  },
  {
    name: 'JSON',
    hljs: 'json',
    extensions: ['json', 'jsonc'],
  },
  {
    name: 'Vue',
    hljs: 'typescript', // Vue SFC - TypeScript handles the script parts better
    extensions: ['vue'],
  },
  // Add more languages below as needed
  // {
  //   name: 'Python',
  //   hljs: 'python',
  //   extensions: ['py', 'pyw'],
  // },
  {
    name: 'CSS',
    hljs: 'css',
    extensions: ['css'],
  },
  {
    name: 'SCSS',
    hljs: 'scss',
    extensions: ['scss'],
  },
  {
    name: 'HTML',
    hljs: 'xml',
    extensions: ['html', 'htm'],
  },
]

/**
 * Get the highlight.js language identifier for a file extension
 */
export function getLanguageForExtension(extension: string): string | null {
  const ext = extension.toLowerCase().replace(/^\./, '')

  for (const lang of languages) {
    if (lang.extensions.includes(ext)) {
      return lang.hljs
    }
  }

  return null
}

/**
 * Get all supported file extensions
 */
export function getSupportedExtensions(): string[] {
  return languages.flatMap((lang) => lang.extensions)
}

/**
 * Check if a file extension is supported
 */
export function isExtensionSupported(extension: string): boolean {
  return getLanguageForExtension(extension) !== null
}

/**
 * Extract file extension from a filename or path
 */
export function getExtensionFromPath(path: string): string {
  const regex = /\.([^.]+)$/
  const match = regex.exec(path)
  return match ? match[1].toLowerCase() : ''
}
