import * as https from 'https'
import * as path from 'path'
import * as os from 'os'

export const apiUrl = 'https://github.com/bmx-ng/bmx-ng/releases/download/'
const knownArchiveFormats: string[] = ['.tar.xz', '.zip', '.7z']
export let archiveFormat: string = knownArchiveFormats[0]

export async function get( version: string ): Promise<Release | undefined> {
	return new Promise<Release | undefined>( async ( resolve, _reject ) => {

		let json: ReleasePage[] | undefined = await release_pages()
		if ( !json ) return resolve( undefined )
		if ( json == undefined ) return resolve( undefined )
		if ( json.length <= 0 ) return resolve( undefined )

		const match = platform_name()

		for ( let releasePageIndex = 0; releasePageIndex < json.length; releasePageIndex++ ) {
			const release = json[releasePageIndex]

			for ( let releaseIndex = 0; releaseIndex < release.assets.length; releaseIndex++ ) {
				const asset = release.assets[releaseIndex]

				// Is this a match for what we want?
				if ( asset.name.startsWith( match ) ) {

					// Extract archive format
					archiveFormat = knownArchiveFormats[0]
					for ( let formatIndex = 0; formatIndex < knownArchiveFormats.length; formatIndex++ ) {
						const format = knownArchiveFormats[formatIndex]
						if ( asset.name.toLowerCase().endsWith( format ) ) {
							archiveFormat = format
							break
						}
					}

					// Extract version for potential matches
					asset.version = asset.name.substr(
						asset.name.lastIndexOf( '_' ) + 1 ).
						slice( 0, -archiveFormat.length - 1 )

					if ( version == 'latest' ) {
						// Latest is always first, so just return first match
						return resolve( asset )
					} else {
						// Does it match the requested version?
						if ( asset.version == version ) return resolve( asset )
					}
				}

			}
		}

		return resolve( undefined )
	} )
}

async function release_pages(): Promise<ReleasePage[] | undefined> {
	return new Promise<ReleasePage[] | undefined>( ( resolve, _reject ) => {

		var options = {
			host: 'api.github.com',
			path: '/repos/bmx-ng/bmx-ng/releases',
			method: 'GET',
			headers: { 'user-agent': 'node.js' }
		}

		https.get( options, res => {
			let body = ''

			res.on( 'data', chunk => {
				body += chunk
			} )

			res.on( 'end', () => {
				try {
					let json: ReleasePage[] = JSON.parse( body )
					return resolve( json )
				} catch ( error ) {
					console.error( error.message )
					return resolve( undefined )
				}
			} )

		} ).on( "error", ( error ) => {
			console.error( error.message )
			return resolve( undefined )
		} )

	} )
}

export function platform_name(): string {
	let plat: string = os.platform()

	// Wants 'macos', 'linux', 'win32'
	if ( plat === 'darwin' ) plat = 'macos'

	// Append arch to everything but 'win32'
	// This makes sure the Windows version is both x86 and x64
	if ( plat !== 'win32' ) plat += '_' + os.arch()

	return 'BlitzMax_' + plat
}

interface ReleasePage {
	url: string,
	name: string,
	tag_name: string,
	assets: Release[]
}

export interface Release {
	name: string,
	version: string,
	browser_download_url: string
}