import * as tc from '@actions/tool-cache'
import * as path from 'path'
import * as releases from './releases'

export async function download( url: string, version: string ): Promise<string | undefined> {
	let download_path: string | undefined
	let ext_path: string | undefined
	let cache_path: string | undefined

	// Download BlitzMax
	try {
		console.log( `Downloading BlitzMax from ${url}` )
		
		download_path = await tc.downloadTool( url )
		
		console.log( `BlitzMax downloaded to ${download_path}` )
		
	} catch ( error ) {
		throw new Error( `Failed to download BlitzMax from ${url}: ${error}` )
	}

	// Extract BlitzMax
	try {
		console.log( 'Extracting '+  releases.archive_format() + ' BlitzMax...' )
		
		// Do extract!
		switch (releases.archive_format()) {
			case '7z':
				ext_path = await tc.extract7z( download_path, './.bmx_tmp_build' )
				break
			
			case 'zip':
				ext_path = await tc.extractZip( download_path, './.bmx_tmp_build' )
				break
				
			default:
				ext_path = await tc.extractTar( download_path, './.bmx_tmp_build', '-x' )
				break
		}
		
		if ( !ext_path ) throw new Error( 'Failed to extract BlitzMax from ' + download_path )
		console.log( `BlitzMax extracted to ${ext_path}` )
		
		ext_path = path.join( ext_path, 'BlitzMax/' )
		
		console.log( `Add BlitzMax to cache` )
		
		cache_path = await tc.cacheDir( ext_path, 'blitzmax', version )
		
		console.log( `BlitzMax was added to cache using dir: ${cache_path}` )
		
	} catch ( error ) {
		throw new Error( `Failed to extract BlitzMax version ${version}: ${error}` )
	}

	return cache_path
}