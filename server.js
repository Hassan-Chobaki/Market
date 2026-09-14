const express=require ('express');
const {Pool}=require('pg');
const path=require('path');
const multer=require('multer');
const fs=require('fs/promises');
const { file } = require('zod');
const sharp=require('sharp');



const app=express();

const port=3000;

app.use('/public',express.static(path.join(__dirname,'../public')));
app.use('/admin',express.static(path.join(__dirname,'../admin')));




const pool=new Pool({
                            user:'postgres',
                            host:'localhost',
                            database:'market',
                            password:'',
                            port:5432

})

app.use(express.json());



                                          
/*

let newFolder;
                                                    const storage=multer.diskStorage({

                                                        destination:function (req,file,cb) {
                                                                                            
                                                                                             newFolder=JSON.parse(req.body.data);
                                                              fs.mkdir(path.join(__dirname,'../public/image/flower',newFolder.code ) , {recursive:true})
                                                                    .then(()=>cb(null,`../public/image/flower/${newFolder.code}`))
                                                                    .catch(err=>cb(err));
                                                        },

                                                        filename:   function(req,file,cb){
                                                                                        const ext=path.extname(file.originalname) ;

                                                                                        if(! req.fileCount)
                                                                                            req.fileCount=1;
                                                                                        else
                                                                                            req.fileCount++;

                                                                                        const name=req.fileCount + ext;

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
                                                                                        })              */



                            const upload=multer({

                                                    storage:multer.memoryStorage(),
                                                    limits:{files:3,fileSize:5*1024*1024},
                                                    fileFilter:function(req,file,cb){                                                  
                                                        

                                                                const allowedFiles=['image/jpeg','image/png','image/webp','image/bmp','image/x-ms-bmp'];

                                                                if(allowedFiles.includes(file.mimetype))
                                                                    cb(null,true);
                                                                else
                                                                    cb(new Error('Error in TYPE file.only[bmp/png/jpg/webp]'));




                                                   
                                                   
                                                                 }



                            });



/************************************************************************************ F U N C T I O N */






app.use((req, res, next) => {
    console.log('REQUEST RECEIVED:', req.method, req.url);
    next();
});













app.post('/product', upload.array('images',3),async(req,res)=>{           
    
    const {code,name,price,quantity,status}=JSON.parse(req.body.data);
    const folderAddress=path.join(__dirname,'../','/public','/image','/flower',code);
    await fs.mkdir(folderAddress,{recursive:true});

    const images=[];
    for(let index=0; index<req.files.length; index++){

        let nameFile=(index+1).toString()+'.webp';
        await sharp(req.files[index].buffer).webp({quality:80}).toFile(path.join(folderAddress,nameFile));
        images.push(`../public/image/flower/${code}/${nameFile}`);

    }


    if(req.files[0]){
        const thumbFile='thumb.webp';
        sharp(req.files[0].buffer).resize(150,150,{fit:'cover'}).webp({quality:70}).toFile(path.join(folderAddress,thumbFile));
    }



    const result=await pool.query(`INSERT INTO product (code,name,price,quantity,status)VALUES($1,$2,$3,$4,$5) RETURNING *`,[code,name,price,quantity,status]);
    
    
    return res.json({success:true});
    

});





app.get('/product/show',async(req,res)=>{

    const data = await pool.query('SELECT * FROM product ORDER BY code Asc');   

    res.json(data.rows);

    console.log(data);

});



app.get("/product/image/:code/:filename",async(req,res)=>{

   const p=path.join(__dirname,'../public/image/flower',req.params.code,req.params.filename);
    res.sendFile(p);

console.log('________________p= ',p);

});

app.delete('/delete/:table/:key',async(req,res)=>{


    const permittedTabel=['product','order','customer'];    
    const {table,key}=req.params;

                                if( ! permittedTabel.includes(table)){
                                    res.send({error:false});
                                    return;
                                }

     let removeTo='';
                                if(table==='product')
                                    removeTo='code';
                                else
                                    removeTo='id';

                            try{  
    const row=await pool.query(`DELETE FROM ${table} WHERE ${removeTo}=$1`,[key]);
                                res.send({count:row.rowCount});
                                if(row.rowCount>0)
                                {

    const folderAddress=path.join(__dirname,'../','public','image','flower',key);
                                    try{
                                        await fs.rm(folderAddress,{force:true,recursive:true});
                                    }catch(error){
                                        console.log("KHATA DAR HAZF POSHE AKS MAHSOL",error);
                                    }
                                }
                            }catch(error){
                                res.send({count:0});
                                console.log("KHATAYE HENGEME HAZF AZ DB:",error);
                            }
})




app.put('/product/edit',async(req,res)=>{
    const {name,code,price,quantity,status}=req.body;
   
    const result= await pool.query(`UPDATE product SET name=$1,price=$2,quntity=$3,status=$4) WHERE code=$5`,[name,price,quantity,status,code])

    if(result.rowCount>0)
        res.send({success:true});

    console.log('RES::::::::::::',result);

})







app.use((error, req, res, next) => {

    console.log('ERROR:', error);

    res.status(400).json({
        success: false,
        error: error.message
    });

});












app.listen(port,()=>{console.log(`server runing...at port ${port}`)});




