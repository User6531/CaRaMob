const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Обмежуємо відстеження тільки до поточної директорії Mobile
config.watchFolders = [__dirname];

// Вказуємо, що node_modules знаходиться в поточній директорії
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

module.exports = config;


