import {Router} from "express";

const path = require("path");

const FileResolveRoute = Router();

FileResolveRoute.use('/fileResolve', function (req, res, next) {
    if (req.method !=="GET" ) return next();

    // language=file-reference
    let pathResolve = path.join(__dirname, '../storage/data',req.path)
    res.sendFile(pathResolve);
});


export default  FileResolveRoute;