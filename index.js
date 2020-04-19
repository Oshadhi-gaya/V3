
var express = require('express');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var _ = require('lodash');
var Busboy = require('busboy');
var wavSpectro = require('wav-spectrogram');
var cledio = express();

// enable files upload
cledio.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 2 * 1024 * 1024 },
    
}));



//add other middleware
cledio.use(cors());
cledio.use(bodyParser.json({limit: '5mb'}));
cledio.use(bodyParser.urlencoded({extended: true}));
cledio.use(morgan('dev'));

// upoad single file
cledio.post('/upload-noisy-clip', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
               
            var input_file = req.files.input_file;
            console.log(input_file.size);
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            if (input_file.size<2 * 1024 * 1024) {
            input_file.mv('./uploads/' + input_file.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: input_file.name,
                    mimetype: input_file.mimetype,
                    size: input_file.size
                }
            });
        }else{

            res.send({
                status: false,
                message: 'Maximum size is 2mb',
                data: {
                    name: input_file.name,
                    mimetype: input_file.mimetype,
                    size: input_file.size
                }
            });
        }
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// upload multiple files

//make uploads directory static
cledio.use(express.static('uploads'));

//start app 
const port = process.env.PORT || 3000;

cledio.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

