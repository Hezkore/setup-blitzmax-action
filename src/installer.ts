import * as tc from '@actions/tool-cache'
import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import * as releases from './releases'

export async function download( url: string, version: string ): Promise<string | undefined> {
	let download_path: string | undefined
	let ext_path: string | undefined
	let cache_path: string | undefined

	// Download BlitzMax
	try {
		console.log( `Downloading BlitzMax from ${url} ...` )

		download_path = await tc.downloadTool( url )

		console.log( `BlitzMax downloaded to ${download_path}` )

	} catch ( error ) {
		throw new Error( `Failed to download BlitzMax from ${url}: ${error}` )
	}

	// Extract BlitzMax
	try {
		console.log( 'Extracting ' + releases.archiveFormat + ' BlitzMax ...' )

		// Do extract!
		const output = './.bmx_tmp_build'
		switch ( releases.archiveFormat ) {
			case '.7z':
				// Windows does NOT have 7zip in PATH!
				ext_path = await tc.extract7z( download_path, output,
					os.platform() === 'win32'
						? path.join( 'C:', 'Program Files', '7-Zip', '7z.exe' )
						: undefined
				)
				break

			case '.zip':
				ext_path = await tc.extractZip( download_path, output )
				break

			default:
				ext_path = await tc.extractTar( download_path, output, '-x' )
				break
		}

		if ( !ext_path ) throw new Error( 'Failed to extract BlitzMax from ' + download_path )
		console.log( `BlitzMax extracted to ${ext_path}` )

		// Make sure to enter the extracted BlitzMax dir
		ext_path = path.join( ext_path, 'BlitzMax' )

		// Run 'run_me_first.command' if it exists
		const runScript = path.join( ext_path, 'run_me_first.command' )
		if ( fs.existsSync( runScript ) ) {
			console.log( `BlitzMax needs to be compiled on this platform` )
			console.log( `Compiling BlitzMax ...` )
			console.log( execSync( runScript ).toString() )
		}

		// Cache the BlitzMax dir
		console.log( `Caching BlitzMax ${version} ...` )
		cache_path = await tc.cacheDir( ext_path, 'blitzmax', version )

		console.log( `BlitzMax was added to cache using dir: ${cache_path}` )

	} catch ( error ) {
		throw new Error( `Failed to extract BlitzMax version ${version}: ${error}` )
	}

	return cache_path
}