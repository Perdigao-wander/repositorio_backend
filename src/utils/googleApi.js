const fs = require('fs');
const { google }= require('googleapis');

const apikeys = require('./googleCredentials.json');
//const apikeys2 = require('./teste.json');
const SCOPE = ['https://www.googleapis.com/auth/drive'];

async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

async function uploadFile(authClient, file){
    let folderId = '1gWVE5mP9hdibJowHSYdAt1eji2uPlXDN';
    if (file.type === 'backup')   folderId = '17HodGho62UNFlO4D16Vp_cCv6a5dqV82';
    const drive = google.drive({version:'v3',auth:authClient});
    var fileMetaData = {
        name: file.fileName,
        parents:[folderId] // A folder ID to which file will get uploaded
    }

    const responseFile = await drive.files.create({
        resource:fileMetaData,
        media:{
            body: fs.createReadStream(file.filePath), // files that will get uploaded
            mimeType: file.mimeType
        },
        fields:'id'
    })
    let fileId = responseFile.data.id;
    let resultData = await generatePublicURL(fileId);
    return resultData;
}

async function generatePublicURL(fileId) {
    let authClient = await authorize();
    const drive = google.drive({version:'v3',auth:authClient});

    drive.permissions.create({
        fileId: fileId,
        requestBody: {
            role: 'reader',
            type: 'anyone'
        }
    });

    const result = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink'
    });

    return {
        webViewLink: result.data.webViewLink,
        webDownloadLink: result.data.webContentLink,
    };
}

async function deleteFile(fileId) {
    let authClient = await authorize();
    const drive = google.drive({version:'v3',auth:authClient});
    const body_value = {
        'trashed': true
    };

    const response = await drive.files.update({
        fileId: fileId,
        requestBody: body_value,
    });
    return response;
}

async function sendFileGoogle (file){
  let dataGoogle = await  authorize().then(
       authCliente => uploadFile(authCliente, file)
    ).catch(
        "error",console.error()
    );

  return dataGoogle;
}

module.exports = {sendFileGoogle,deleteFile};
