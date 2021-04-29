import * as tc from '@actions/tool-cache'
import * as core from '@actions/core'
import * as path from 'path'
import * as installer from './installer'
import * as releases from './releases'
import { Release } from './releases'

const debug = process.argv.includes( 'debug' )

async function main() {
	try {
		let bmx_ver = core.getInput( 'bmx-version' )
		if ( !bmx_ver ) bmx_ver = 'latest'

		// Attempt to find the requested release
		let bmx_release = await releases.get( bmx_ver )
		if ( !bmx_release ) throw new Error( `Could not find a release that satisfied version '${bmx_ver}'` )

		// Update official release version
		bmx_ver = bmx_release.version
		console.log( `Will search for release ${bmx_release.name}` )

		// Look for a cached BlitzMax version
		let cache_dir: string | undefined = debug ? undefined : tc.find( 'blitzmax', bmx_ver )

		if ( !cache_dir ) { // BlitzMax version not installed
			console.log( `BlitzMax ${bmx_ver} can't be found using cache, attempting to download ...` )

			cache_dir = await installer.download( bmx_release.browser_download_url, bmx_ver )

			console.log( `BlitzMax Installed to ${cache_dir}` )
		}
		if ( !cache_dir ) throw new Error( `Could not setup BlitzMax ${bmx_ver}` )

		// Add BlitzMax bin folder to env variable
		core.exportVariable( 'BMX_BIN', path.join( cache_dir, 'bin' ) )
		if ( !process.env.BMX_BIN ) throw new Error( `Could add BlitzMax ${bmx_ver} to PATH` )

		// Add BlitzMax bin to PATH
		core.addPath( process.env.BMX_BIN )
		console.log( 'Added BlitzMax to PATH' )

		// Set action output
		core.setOutput( 'bmx-root', cache_dir )

		// Add problem matchers
		const matchersPath = path.join( __dirname, '..', 'matchers.json' )
		console.log( `##[add-matcher]${matchersPath}` )
	} catch ( error ) {
		core.setFailed( error.message )
	}
}

main()