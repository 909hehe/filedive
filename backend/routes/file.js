const express = require('express');
const router = express.Router();
const File = require('../modules/File')
let fetchUser = require('../middleware/fetchUser');
const multer = require('multer')

// const upload = multer({ dest: "src/uploads" })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '.pdf');
  },
});

const upload = multer({ storage: storage });

router.post('/fetchfiles',fetchUser ,async (req,res)=>{
  try {
      let files = await File.find({parent : req.body.parent ,user : req.user.id})
      res.json(files)
  } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured")
  }
})

router.post('/upload' ,fetchUser ,upload.single("file") ,async (req,res)=>{
    try {
        
        const fileData = {
            user : req.user.id,
            name : req.file.originalname,
            path: req.file.path,
            originalName: req.file.originalname,
            parent : req.body.parent
        }

        const file = await File.create(fileData)
        let success = true
        res.send(success)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occuredss")
    }
})

//auth token nikal aur file show download nahi

router.get("/getfile/:id" , async (req, res) => {

  const file = await File.findById(req.params.id) 


  const filePath = path.join(__dirname, file.path);

    res.sendFile(filePath, { root: '/' }, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
    });
    
    res.sendFile(file.path, file.originalName)
});

module.exports = router