import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import multer from 'multer';
import fs from 'fs/promises';
import sharp from 'sharp';


import { validateAddress, validateMobile, validateName, validateTel, validateNote, validateComment } from './inputValidator.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { success } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

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
        await sharp(req.files[0].buffer).resize(150,150,{fit:'cover'}).webp({quality:70}).toFile(path.join(folderAddress,thumbFile));
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




app.put('/product/edit',upload.array('images',3),async(req,res)=>{
    

    
try{   
    
    const {name,code,price,quantity,status}=JSON.parse(req.body.data);
    const result= await pool.query(`UPDATE product SET name=$1,price=$2,quantity=$3,status=$4 WHERE code=$5`,[name,price,quantity,status,code])

    if(result.rowCount>0)
        res.send({success:true});



    if(req.files && req.files.length>0){
        const folderAddress=path.join(__dirname,'../public/image/flower',code);

        await fs.rm(folderAddress,{recursive:true,force:true});

        await fs.mkdir(folderAddress,{recursive:true});

        for(let i=0;i<req.files.length;i++)
        {
            let nameFile=`${i+1}.webp`;
            sharp(req.files[i].buffer).webp({quality:80}).toFile(path.join(folderAddress,nameFile))
        }
        


        const nameThumb='thumb.webp';

        await sharp(req.files[0].buffer).resize(150,150,{fit:'cover'}).webp({quantity:70}).toFile(path.join(folderAddress,nameThumb));




    }//if


       
} catch (error) { console.log('KHATAYE EDIT PRODUCT...', error); res.send({ success: false }); console.log('RES::::::::::::',result); };

   

});




app.get('/product/getPic/:code',async(req,res)=>{
    const code=req.params.code;
    const pathFolder = path.join(__dirname, '../public/image/flower/', code); 

    const files=await fs.readdir(pathFolder);

      

            res.json(files.filter(f=>!f.includes('thumb')).map(f=>`../public/image/flower/${code}/${f}`));
    
})


    //.map(f => `/image/flower/${code}/${f}`)





//************************************************************************************** O R D E R  */

app.get('/order/list',async(req,res)=>{

    const rows=await pool.query('SELECT * FROM "order"');

     res.json(rows.rows);

console.log(rows.rows);
});








app.post('/occasion/save',async(req,res)=>{

    const {name,date}=req.body;

  try{  
            const isSave=await pool.query('INSERT INTO occasion (name,date) VALUES($1,$2)',[name,date]);
             
            res.send({success:'ok'});
            


  }
  catch(error){if(error.code==='23505')return res.send({success:'duplicated'})};

  res.json({success:'fail'});

});


app.get('/occasion/list',async(req,res)=>{
    try{
            const result=await pool.query('SELECT * FROM occasion');
            res.json(result.rows);
    }catch(error){if(error.code==='08000')res.json({success:disconnected})}


});


app.delete('/occasion/del/:date',async (req,res) =>{
    const date=req.params.date;

        try{        
            const row = await pool.query('DELETE FROM occasion WHERE date=$1',[date]);

                if(row.rowCount>0){
                    res.send({success:'ok'});
                    return;
                }
                else
                    res.send({success:'no'});



            }catch(error){console.log('khataye hazf MONASEBAT : ',error);}
})


async function generatedTrackingCode(){
function generate(){ return Math.random().toString(36).slice(2,6).toUpperCase();}
                                    let code,notRepeat;
                                    do{
                                        code=generate();
                                        notRepeat=await pool.query('SELECT 1 FROM "order" WHERE "trackingCode"=$1',[code]);
                                    }
                                    while(notRepeat.rowCount>0)

                                return code;
                                }
app.post('/order/save',async(req,res)=>{

    let {nameSender, nameReciver, mobileSender,
        telSender, telReciver, mobileReciver,
        note, comment, adress, city,dateDelivery,
        timeOf, timeTo}=req.body;

  //روش اول      nameSender=validateName(nameSender).valid?validateInput(nameSender).input :null ;

  //روش دوم     
              let  result=validateName(nameSender);
                if(result.valid===false) return res.json({success:false,msg:result.msg+" Sen"});
                else nameSender=result.input;

                result=validateName(nameReciver);
                if( ! result.valid) return res.json({success:false,msg:result.msg+" Rec"});
                else nameReciver=result.input;

                result=validateMobile(mobileSender);
                if( ! result.valid) return res.json({success:false,msg:result.msg+" Sen"});
                else mobileSender=result.input;

                result=validateMobile(mobileReciver);
                if(! result.valid ) return res.json({success:false,msg:result.msg+" Rec"});
                else mobileReciver=result.input;

               /* result=validateTel(telSender);
                if(!result.valid) return res.json({success:false,msg:result.msg});
                else telSender=result.input;

                result=validateTel(telReciver);
                if(! result.valid) return res.json({success:false,msg:result.msg});
                else telReciver=result.input;*/

                result=validateAddress(adress);
                if(! result.valid) return res.json({success:false,msg:result.msg});
                else adress=result.input;

                result=validateComment(comment);
                if(! result.valid)return res.json({success:false,msg:result.msg});
                else comment=result.input;

                result=validateNote(note);
                if(! result.valid) return res.json({success:false,msg:result.msg});
                else note=result.input;

                result=validateName(city);
                if(! result.valid) return res.json({success:false,msg:result.msg+" city"});
                else city=result.input;

                const trackingCode=await generatedTrackingCode();


try{
    const saveInDB = await pool.query('INSERT INTO "order" ("nameSender","mobileSender","telSender","nameReciver","mobileReciver","telReciver","dateDelivery","timeOf","timeTo","note","comment","trackingCode","address","city") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)RETURNING *',
                                                                        [nameSender,mobileSender ,telSender ,nameReciver
                                                                        , mobileReciver,telReciver,dateDelivery,                                                                        
                                                                        timeOf, timeTo, note, comment,trackingCode, adress, city]);


    if(saveInDB){
        res.json({success:true,save:'ok'});
        return;
    }
}catch(error){
    if(error.code==='23505'){
        res.json({success:false,error:'repeated'});
        return ;
    }
    else{res.json({error:error})}

}




res.json({error:'khataye server'});

});












app.use((error, req, res, next) => {

    console.log('ERROR:', error);

    res.status(400).json({
        success: false,
        error: error.message
    });

});












app.listen(port,()=>{console.log(`server runing...at port ${port}`)});




