import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development'

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'icons/logo.svg',
    32: 'icons/logo.svg',
    48: 'icons/logo.svg',
    128: 'icons/logo.svg',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'icons/logo.svg',
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://dev.azure.com/*', 'https://*.visualstudio.com/*'],
      js: ['src/contentScript/index.ts'],
      css: ['css/highlight.css'],
      run_at: 'document_end',
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        'img/logo-16.png',
        'img/logo-34.png',
        'img/logo-48.png',
        'img/logo-128.png',
        'assets/*',
      ],
      matches: ['https://dev.azure.com/*', 'https://*.visualstudio.com/*'],
    },
  ],
  permissions: ['storage', 'activeTab'],
})
