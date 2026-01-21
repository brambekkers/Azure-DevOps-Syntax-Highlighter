import '../../globals.css'
import { useEffect, useState } from 'kaioken'
import { languages } from '../contentScript/languages'

type Theme = 'github-dark' | 'github-light' | 'monokai' | 'dracula' | 'one-dark' | 'auto'

interface Settings {
  enabled: boolean
  theme: Theme
}

const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  theme: 'auto',
}

function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...result.settings })
      }
    })
  }, [])

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    chrome.storage.sync.set({ settings: updated }, () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    })
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>🎨</span> Azure DevOps Syntax Highlighter
        </h1>
        <p className="text-gray-600 mt-2">
          Configure syntax highlighting for Azure DevOps pull request reviews.
        </p>
      </div>

      {saved && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">Settings saved!</div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>

        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div>
            <label className="font-medium text-gray-700">Enable Syntax Highlighting</label>
            <p className="text-sm text-gray-500">Turn highlighting on or off</p>
          </div>
          <button
            onclick={() => updateSettings({ enabled: !settings.enabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.enabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mb-4">
          <label className="font-medium text-gray-700">Theme</label>
          <p className="text-sm text-gray-500 mb-2">Choose your preferred color scheme</p>
          <select
            value={settings.theme}
            onchange={(e: Event) =>
              updateSettings({ theme: (e.target as HTMLSelectElement).value as Theme })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="auto">Auto (match Azure DevOps)</option>
            <option value="github-light">GitHub Light</option>
            <option value="github-dark">GitHub Dark</option>
            <option value="monokai">Monokai</option>
            <option value="dracula">Dracula</option>
            <option value="one-dark">One Dark</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Supported Languages</h2>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <span
              key={lang.hljs}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {lang.name}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App
