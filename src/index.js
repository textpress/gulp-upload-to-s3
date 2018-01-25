import exec from "gulp-exec";
import gulp from "gulp";
import isString from "lodash/isString";
import fs from "fs";
import path from "path";
import yargs from "yargs";


export function readPackageJson() {
    return JSON.parse( fs.readFileSync( path.join( process.cwd(), "package.json" ) ) );
}


export function constructS3Path( bucket, name, version ) {
    if ( version.startsWith( "v" ) )
        version = version.substr( 1 );
    const versionParts = version.split( "." );
    return `s3://${bucket}/${name}/${versionParts[ 0 ]}/${versionParts[ 1 ]}/${name}-v${version}.zip`;
}


export function uploadToS3( argv, filePath ) {
    const version = argv.versionTag;
    if ( !isString( version ) )
        throw new Error( "Version is missing, usage: yarn ci-upload-to-s3 v0.0.1" );

    const packageJson = readPackageJson();
    const s3path = constructS3Path( "textpress-builds", packageJson.name, version );

    return gulp.src( "" )
        .pipe( exec( `aws s3 cp "${filePath}" "${s3path}"` ) );
}


export function registerTask( filePath ) {
    gulp.task( "upload-to-s3", () => uploadToS3( yargs.argv, filePath ) );
}

export default uploadToS3;
