const makeDir = require('make-dir');
const fs = require("fs")
const path = require("path");

async function uploadFile(file, PathRoot, Path) {
    let fileExtension;
    let filenameMD5;
    let filename;
    let fileReference;
    let pathFile;
    let _files;
    let arrayRes = [];
    let size;
    let sizeFile;
    let result = false;
    if ( file !== null ) {
        await makeDir(Path);
        result = true;
        if( Array.isArray( file.attaches) ){

            for (const _f of file.attaches) {
                size =  (_f.size / 1024);
                sizeFile =  parseFloat(size.toFixed(2));
                fileExtension = '.'+_f.name.split('.').pop();
                filenameMD5 = _f.md5;
                filename = _f.name;
                pathFile = Path + filenameMD5 + fileExtension;
                _files = _f;
                await _files.mv(pathFile, function (err) {
                    if (err) {
                        return {
                            error: `${err}`
                        }
                    }
                });

                fileReference = PathRoot + filenameMD5 + fileExtension;

                let pathResolve = path.join(__dirname, '../storage/data',fileReference)
                let obj = {
                    fileName : filename,
                    fileSize : sizeFile.toString(),
                    fileNameMD5 : filenameMD5,
                    fileReference: fileReference,
                    filePath: pathResolve,
                    mimeType: _f.mimetype
                }
                arrayRes.push(obj);
            }

        }else {
            size =  (file.size / 1024);
            sizeFile =  parseFloat(size.toFixed(2));
            fileExtension = '.' + file.name.split('.').pop();
            filenameMD5 = file.md5;
            filename = file.name;
            pathFile = Path + filenameMD5 + fileExtension;
            _files = file
            await _files.mv(pathFile, function (err) {
                if (err) {
                    return {
                        error: `${err}`
                    }
                }
            });

            fileReference = PathRoot + filenameMD5 + fileExtension;
            let pathResolve = path.join(__dirname, '../storage/data',fileReference)
            let obj = {
                fileName : filename,
                fileSize : sizeFile.toString(),
                fileNameMD5 : filenameMD5,
                fileReference: fileReference,
                filePath: pathResolve,
                mimeType: file.mimetype,
            }
           arrayRes.push(obj);
        }
    }

    return {arrayRes,result};
}

/*async function uploadFileGoogle(file, PathRoot, Path) {
    let fileExtension;
    let filenameMD5;
    let filename;
    let fileReference;
    let pathFile;
    let _files;
    let arrayRes = [];
    let size;
    let sizeFile;    let result = false;
    if ( file !== null ) {
        await makeDir(Path);
        result = true;
        if( Array.isArray( file.attaches) ){

            for (const _f of file.attaches) {
                size =  (_f.size / 1024);
                sizeFile =  parseFloat(size.toFixed(2));
                fileExtension = '.'+_f.name.split('.').pop();
                filenameMD5 = _f.md5;
                filename = _f.name;
                pathFile = Path + filenameMD5 + fileExtension;
                _files = _f;
                await _files.mv(pathFile, function (err) {
                    if (err) {
                        return {
                            error: `${err}`
                        }
                    }
                });

                fileReference = PathRoot + filenameMD5 + fileExtension;

                let pathResolve = path.join(__dirname, '../storage/data',fileReference)
                let obj = {
                    fileName : filename,
                    fileSize : sizeFile,
                    fileNameMD5 : filenameMD5,
                    fileReference: fileReference,
                    filePath: pathResolve,
                    mimeType: _f.mimetype
                }
                let resGoogel =  await sendFileGoogle(obj);
                console.log(resGoogel)
                obj.webViewLink = resGoogel.webViewLink;
                obj.webDownloadLink = resGoogel.webDownloadLink;
                arrayRes.push(obj);
                fs.unlinkSync(pathResolve);
            }

        }else {
            size =  (file.attaches.size / 1024);
            sizeFile =  parseFloat(size.toFixed(2));
            fileExtension = '.' + file.attaches.name.split('.').pop();
            filenameMD5 = file.attaches.md5;
            filename = file.attaches.name;
            pathFile = Path + filenameMD5 + fileExtension;
            _files = file.attaches
            await _files.mv(pathFile, function (err) {
                if (err) {
                    return {
                        error: `${err}`
                    }
                }
            });

            fileReference = PathRoot + filenameMD5 + fileExtension;
            let pathResolve = path.join(__dirname, '../storage/data',fileReference)
            let obj = {
                fileName : filename,
                fileSize : sizeFile,
                fileNameMD5 : filenameMD5,
                fileReference: fileReference,
                filePath: pathResolve,
                mimeType: file.attaches.mimetype,
            }
            let resGoogel =  await sendFileGoogle(obj);
            obj.webViewLink = resGoogel.webViewLink;
            obj.webDownloadLink = resGoogel.webDownloadLink;
            arrayRes.push(obj);
            fs.unlinkSync(pathResolve);
        }
    }

    return {arrayRes,result};
}*/

export default uploadFile;
