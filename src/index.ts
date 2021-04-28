import * as tc from '@actions/tool-cache'
import * as core from '@actions/core'
import * as path from 'path'
import * as installer from './installer'
import * as releases from './releases'
import {Release} from './releases'

const debug = process.argv.includes( 'debug' )

async function run() {
	try {
		let bmx_ver = core.getInput( 'bmx-version' )
		if ( !bmx_ver ) bmx_ver = 'latest'
		
		// Attempt to find the requested release
		let bmx_release: undefined | Release = await  releases.get( bmx_ver )
		if ( !bmx_release ) throw new Error( `Could not find a version that satisfied version spec: ${bmx_ver}` )
		
		// Update official release version
		bmx_ver = bmx_release.version
		console.log( `Using BlitzMax version ${bmx_ver}` )
		
		// Look for a cached BlitzMax version
		let cache_dir: string | undefined = debug ? undefined : tc.find( 'blitzmax', bmx_ver )
		//let install_dir: string | undefined
		
		if ( !cache_dir ) { // BlitzMax version not installed
			console.log( `BlitzMax ${bmx_ver} can't be found using cache, attempting to download ...` )
			
			cache_dir = await installer.download( bmx_release.browser_download_url, bmx_ver )
			
			console.log( `BlitzMax Installed to ${cache_dir}` )
		}
		if (!cache_dir) throw new Error( `Could not initilize BlitzMax ${bmx_ver}` )
		
		// Add BlitzMax bin folder to env variable
		core.exportVariable( 'BMX_BIN', path.join( cache_dir, 'bin' ) )
		if (!process.env.BMX_BIN) throw new Error( `Could add BlitzMax ${bmx_ver} to PATH` )
		
		// Add BlitzMax bin to PATH
		core.addPath( process.env.BMX_BIN )
		console.log( 'Added BlitzMax to PATH' )
		
		// Set action output
		core.setOutput( 'bmx-root', process.env.BMX_BIN )
		
		// Add problem matchers
		const matchersPath = path.join( __dirname, '..', 'matchers.json' )
		console.log( `##[add-matcher]${matchersPath}` )
		
		// Show PATH
		// console.log( "PATH: " + process.env.PATH )
		
	} catch ( error ) {
		core.setFailed( error.message )
	}
}

run()