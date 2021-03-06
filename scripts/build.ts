/* eslint-disable no-sync */
/// <reference path="./globals.d.ts" />

import * as path from 'path'
import * as cp from 'child_process'
import * as fs from 'fs-extra'
import * as packager from 'electron-packager'

import {
  getBundleID,
  getCompanyName,
  getProductName,
} from '../app/package-info'

import { externals } from '../app/webpack.common'
import { updateLicenseDump } from './licenses/update-license-dump'
import { getDistRoot, getExecutableName } from './dist-info'

interface IChooseALicense {
  readonly title: string
  readonly nickname?: string
  readonly featured?: boolean
  readonly hidden?: boolean
}

export interface ILicense {
  readonly name: string
  readonly featured: boolean
  readonly body: string
  readonly hidden: boolean
}

interface IFrontMatterResult<T> {
  readonly attributes: T
  readonly body: string
}

const frontMatter: <T>(
  path: string
) => IFrontMatterResult<T> = require('front-matter')

const projectRoot = path.join(__dirname, '..')
const outRoot = path.join(projectRoot, 'out')

console.log('Removing old distribution…')
fs.removeSync(getDistRoot())

console.log('Copying dependencies…')
copyDependencies()

console.log('Copying static resources…')
copyStaticResources()

console.log('Parsing license metadata…')
generateLicenseMetadata(outRoot)

console.log('Updating our licenses dump…')
updateLicenseDump(projectRoot, outRoot)
  .catch(err => {
    console.error(
      'Error updating the license dump. This is fatal for a published build.'
    )
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    console.log('Packaging…')
    return packageApp()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .then(appPaths => {
    console.log(`Built to ${appPaths}`)
  })

function packageApp() {
  // not sure if this is needed anywhere, so I'm just going to inline it here
  // for now and see what the future brings...
  const toPackagePlatform = (platform: NodeJS.Platform) => {
    if (platform === 'win32' || platform === 'darwin' || platform === 'linux') {
      return platform
    }
    throw new Error(
      `Unable to convert to platform for electron-packager: '${process.platform}`
    )
  }

  const toPackageArch = (targetArch: string | undefined): packager.arch => {
    if (targetArch === undefined) {
      return 'x64'
    }

    if (targetArch === 'arm64' || targetArch === 'x64') {
      return targetArch
    }

    throw new Error(
      `Building Desktop for architecture '${targetArch}'  is not supported`
    )
  }

  /**
   * The additional packager options not included in the existing typing.
   *
   * See https://github.com/desktop/desktop/issues/2429 for some history on this.
   */
  interface IPackageAdditionalOptions {
    readonly protocols: ReadonlyArray<{
      readonly name: string
      readonly schemes: ReadonlyArray<string>
    }>
  }

  const options: packager.Options & IPackageAdditionalOptions = {
    name: getExecutableName(),
    platform: toPackagePlatform(process.platform),
    arch: toPackageArch(process.env.TARGET_ARCH),
    asar: false, // TODO: Probably wanna enable this down the road.
    out: getDistRoot(),
    icon: path.join(projectRoot, 'app', 'static', 'logos', 'icon-logo'),
    dir: outRoot,
    overwrite: true,
    tmpdir: false,
    derefSymlinks: false,
    prune: false, // We'll prune them ourselves below.
    ignore: [
      new RegExp('/node_modules/electron($|/)'),
      new RegExp('/node_modules/electron-packager($|/)'),
      new RegExp('/\\.git($|/)'),
      new RegExp('/node_modules/\\.bin($|/)'),
    ],
    appCopyright: 'Copyright © 2019 ACCIO',

    // macOS
    appBundleId: getBundleID(),
    appCategoryType: 'public.app-category.developer-tools',
    darwinDarkModeSupport: true,
    osxSign: false,
    protocols: [
      {
        name: getBundleID(),
        schemes: ['x-accio-client', 'accio-mac'],
      },
    ],
    extendInfo: `${projectRoot}/scripts/info.plist`,

    // Windows
    win32metadata: {
      CompanyName: getCompanyName(),
      FileDescription: '',
      OriginalFilename: '',
      ProductName: getProductName(),
      InternalName: getProductName(),
    },
  }

  return packager(options)
}

function copyStaticResources() {
  const dirName = process.platform
  const platformSpecific = path.join(projectRoot, 'app', 'static', dirName)
  const common = path.join(projectRoot, 'app', 'static', 'common')
  const destination = path.join(outRoot, 'static')
  fs.removeSync(destination)
  if (fs.existsSync(platformSpecific)) {
    fs.copySync(platformSpecific, destination)
  }
  fs.copySync(common, destination, { overwrite: false })
}

function copyDependencies() {
  // eslint-disable-next-line import/no-dynamic-require
  const originalPackage: Package = require(path.join(
    projectRoot,
    'app',
    'package.json'
  ))

  const oldDependencies = originalPackage.dependencies
  const newDependencies: PackageLookup = {}

  for (const name of Object.keys(oldDependencies)) {
    const spec = oldDependencies[name]
    if (externals.indexOf(name) !== -1) {
      newDependencies[name] = spec
    }
  }

  const oldDevDependencies = originalPackage.devDependencies
  const newDevDependencies: PackageLookup = {}

  for (const name of Object.keys(oldDevDependencies)) {
    const spec = oldDevDependencies[name]
    if (externals.indexOf(name) !== -1) {
      newDevDependencies[name] = spec
    }
  }

  // The product name changes depending on whether it's a prod build or dev
  // build, so that we can have them running side by side.
  const updatedPackage = Object.assign({}, originalPackage, {
    productName: getProductName(),
    dependencies: newDependencies,
    devDependencies: newDevDependencies,
  })

  delete updatedPackage.devDependencies

  fs.writeFileSync(
    path.join(outRoot, 'package.json'),
    JSON.stringify(updatedPackage)
  )

  fs.removeSync(path.resolve(outRoot, 'node_modules'))

  if (
    Object.keys(newDependencies).length ||
    Object.keys(newDevDependencies).length
  ) {
    console.log('  Installing dependencies via yarn…')
    cp.execSync('yarn install', { cwd: outRoot, env: process.env })
  }

  console.log('  Installing 7zip (dependency for electron-devtools-installer)')

  const sevenZipSource = path.resolve(projectRoot, 'app/node_modules/7zip')
  const sevenZipDestination = path.resolve(outRoot, 'node_modules/7zip')

  fs.mkdirpSync(sevenZipDestination)
  fs.copySync(sevenZipSource, sevenZipDestination)

  if (process.platform === 'darwin') {
    console.log('  Copying app-path binary…')
    const appPathMain = path.resolve(outRoot, 'main')
    fs.removeSync(appPathMain)
    fs.copySync(
      path.resolve(projectRoot, 'app/node_modules/app-path/main'),
      appPathMain
    )
  }
}

function generateLicenseMetadata(outRoot: string) {
  const chooseALicense = path.join(outRoot, 'static', 'choosealicense.com')
  const licensesDir = path.join(chooseALicense, '_licenses')

  const files = fs.readdirSync(licensesDir)

  const licenses = new Array<ILicense>()
  for (const file of files) {
    const fullPath = path.join(licensesDir, file)
    const contents = fs.readFileSync(fullPath, 'utf8')
    const result = frontMatter<IChooseALicense>(contents)

    const licenseText = result.body.trim()
    // ensure that any license file created in the app does not trigger the
    // "no newline at end of file" warning when viewing diffs
    const licenseTextWithNewLine = `${licenseText}\n`

    const license: ILicense = {
      name: result.attributes.nickname || result.attributes.title,
      featured: result.attributes.featured || false,
      hidden:
        result.attributes.hidden === undefined || result.attributes.hidden,
      body: licenseTextWithNewLine,
    }

    if (!license.hidden) {
      licenses.push(license)
    }
  }

  const licensePayload = path.join(outRoot, 'static', 'available-licenses.json')
  const text = JSON.stringify(licenses)
  fs.writeFileSync(licensePayload, text, 'utf8')

  // embed the license alongside the generated license payload
  const chooseALicenseLicense = path.join(chooseALicense, 'LICENSE.md')
  const licenseDestination = path.join(
    outRoot,
    'static',
    'LICENSE.choosealicense.md'
  )

  const licenseText = fs.readFileSync(chooseALicenseLicense, 'utf8')
  const licenseWithHeader = `Accio Desktop uses licensing information provided by choosealicense.com.

The bundle in available-licenses.json has been generated from a source list provided at https://desktop.accio.pro/choosealicense.com, which is made available under the below license:

------------

${licenseText}`

  fs.writeFileSync(licenseDestination, licenseWithHeader, 'utf8')

  // sweep up the choosealicense directory as the important bits have been bundled in the app
  fs.removeSync(chooseALicense)
}
