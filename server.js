const express=require ('express');
const {Pool}=require('pg');
const path=require('path');
const multer=require('multer');
const fs=require('fs');



const app=express();

const port=3000;
app.use('/public',express.static(path.join(__dirname,'../public')));
app.use('/admin',express.static(path.join(__dirname,'../admin')));

//fs.mkdirSync('/upload/products',true);


const pool=new Pool({
                            user:'postgres',
                            host:'localhost',
                            database:'market',
                            password:'',
                            port:5432

})

app.use(express.json());



                                          


let newFolder;
                                                    const storage=multer.diskStorage({

                                                        destination:function (req,file,cb) {
                                                                                            fs.mkdirSync(path.join(__dirname,'../public/image/flower'),{recursive:true});
                                                                                             newFolder=JSON.parse(req.body.data);
                                                            fs.mkdirSync(path.join('../public/image/flower',String(newFolder.code) ) , {recursive:true});
                                                            
                                                                                            cb(null,`../public/image/flower/${newFolder.code}`)},

                                                        filename:   function(req,file,cb){
                                                                                        const ext=path.extname(file.originalname) ;

                                                                                        const name=Date.now() + '-' + file.originalname ;

                                                                                        cb(null,name);

                                                                                        }                                  

                                                        
                                                    })

                                                    const upload=multer({storage:storage,limits:{files: 3 ,fileSize: 5*1024*1024},
                                                        
                                                        fileFilter:function(req,file,cb){
                                                                                        const allowedFiles=['image/jpeg','image/png','image/webp'];

                                                                                        if(allowedFiles.includes(file.mimetype))
                                                                                            cb(null,true);
                                                                                        else{
                                                                                            cb(new Error('files only Jpg/Png/Webp'));
                                                                                        }

                                                                                    }
                                                                                        })



/************************************************************************************ F U N C T I O N */






app.use((req, res, next) => {
    console.log('REQUEST RECEIVED:', req.method, req.url);
    next();
});













app.post('/product', upload.array('images',3),async(req,res)=>{
    
            const images=req.files.map(file=>{return `../public/image/flower/${newFolder.code}/${file.filename}`;});
            
    
    const {code,name,price,quantity,status}=JSON.parse(req.body.data);
    const result=await pool.query(`INSERT INTO product (code,name,price,quantity,status)VALUES($1,$2,$3,$4,$5) RETURNING *`,[code,name,price,quantity,status]);
    
    
    return res.json({success:true});
    

});











app.use((error, req, res, next) => {

    console.log('ERROR:', error);

    res.status(400).json({
        success: false,
        error: error.message
    });

});












app.listen(port,()=>{console.log(`server runing...at port ${port}`)});




