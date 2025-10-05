const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname
const config = getDefaultConfig(projectRoot)

// Constrain Metro to this app only (avoid walking up to the Next.js workspace)
config.watchFolders = [projectRoot]
config.resolver.disableHierarchicalLookup = true
config.resolver.nodeModulesPaths = [path.join(projectRoot, 'node_modules')]

// Lower worker count; Watchman (if installed) will further optimize watchers
config.maxWorkers = 1

module.exports = config
