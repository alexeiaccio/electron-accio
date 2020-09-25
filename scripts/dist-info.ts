import * as Path from 'path'
import * as Fs from 'fs'

import { getProductName, getVersion } from '../app/package-info'

const productName = getProductName()
const version = getVersion()

const projectRoot = Path.join(__dirname, '..')

export function getDistRoot() {
  return Path.join(projectRoot, 'dist')
}

export function getDistPath() {
  return Path.join(
    getDistRoot(),
    `${getExecutableName()}-${process.platform}-x64`
  )
}

export function getExecutableName() {
  const suffix = process.env.NODE_ENV === 'development' ? '-dev' : ''

  if (process.platform === 'win32') {
    return `${getWindowsIdentifierName()}${suffix}`
  } else if (process.platform === 'linux') {
    return 'desktop'
  } else {
    return productName
  }
}

export function getOSXZipName() {
  return `${productName}.zip`
}

export function getOSXZipPath() {
  return Path.join(getDistPath(), '..', getOSXZipName())
}

export function getWindowsInstallerName() {
  const productName = getExecutableName()
  return `${productName}Setup.msi`
}

export function getWindowsInstallerPath() {
  return Path.join(getDistPath(), '..', 'installer', getWindowsInstallerName())
}

export function getWindowsStandaloneName() {
  const productName = getExecutableName()
  return `${productName}Setup.exe`
}

export function getWindowsStandalonePath() {
  return Path.join(getDistPath(), '..', 'installer', getWindowsStandaloneName())
}

export function getWindowsFullNugetPackageName() {
  return `${getWindowsIdentifierName()}-${version}-full.nupkg`
}

export function getWindowsFullNugetPackagePath() {
  return Path.join(
    getDistPath(),
    '..',
    'installer',
    getWindowsFullNugetPackageName()
  )
}

export function getWindowsDeltaNugetPackageName() {
  return `${getWindowsIdentifierName()}-${version}-delta.nupkg`
}

export function getWindowsDeltaNugetPackagePath() {
  return Path.join(
    getDistPath(),
    '..',
    'installer',
    getWindowsDeltaNugetPackageName()
  )
}

export function getWindowsIdentifierName() {
  return 'GitHubDesktop'
}

export function getBundleSizes() {
  // eslint-disable-next-line no-sync
  const rendererStats = Fs.statSync(
    Path.join(projectRoot, 'out', 'renderer.js')
  )
  // eslint-disable-next-line no-sync
  const mainStats = Fs.statSync(Path.join(projectRoot, 'out', 'main.js'))
  return { rendererSize: rendererStats.size, mainSize: mainStats.size }
}
