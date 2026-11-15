import "dotenv/config";
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import multer from 'multer';
import fs from 'fs/promises';
import sharp from 'sharp';
import TAGHVIM from 'jalali-moment';
import crypto from 'crypto';
import session from 'express-session';



import { validateAddress, validateMobile, validateName, validateTel, validateNote, validateComment } from './inputValidator.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { success } from 'zod';
import { late } from 'zod/v3';
import moment from 'jalali-moment';
import rateLimit from 'express-rate-limit'


const limitGeneral = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'تعداددرخواستهای بیش از حد مجاز' }


});

const limitAdmin=rateLimit({
    windowMs:15*60*1000,
    limit:5,
    standardHeaders:'draft-8',
    legacyHeaders:false,
    message:{error:'تعداد درخواست ورود بیش ازحد '}
});


const app = express();
const port = 3000;

app.use(express.json());

const sessionAdmin =
    session({
        //node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"ساخت رمز نشست
        secret: process.env.SESSION_ADMIN_SEC,
        resave: false,
        saveUninitialized: false,
        cookie: {/* maxAge: 1000 * 60 * 60 * 8, */ httpOnly: true, sameSite: 'strict' }
        // TIME LIFE= 8 HOURSE it's comment
    });
app.use(sessionAdmin);

//***********************************       socket.io




import { createServer } from "http";
import { Server } from "socket.io";
import { timerify } from 'perf_hooks';
const httpServer = createServer(app);
const io = new Server(httpServer);

io.engine.use(sessionAdmin);

io.on("connection", (socket) => {
    console.log("ADMIN CONNECT TO SERVER...");
    if (!socket.request.session.isAdmin) {
        socket.disconnect();
        return;
    }
    socket.join("adminRoom");
});

/***************************************            */







const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




//Visit save
function shortAgent(ua = '') {
    const u = ua.toLowerCase();
    if (/bot|spider|crawl|curl|python|postman/.test(u)) return 'bot';


    const os = /android/.test(u) ? 'android'
                    : /iphone|ipad|ipod/.test(u) ? 'ios'
                    : /windows/.test(u) ? 'windows'
                    : /macintosh|mac os x/.test(u) ? 'mac'
                    : /linux/.test(u) ? 'linux' : 'other';

    const br = /edg\//.test(u) ? 'edge'
                        : /opr\/|opera/.test(u) ? 'opera'
                        : /firefox|fxios/.test(u) ? 'firefox'
                        : /chrome|crios/.test(u) ? 'chrome'
                        : /safari/.test(u) ? 'safari' : 'other';

    return os + '.' + br;
}

app.use((req, res, next) => {    
    const ip = req.ip;
    const userAgent = shortAgent(req.get('user-agent'));
    const path = req.path;





    const page = { '/public/html/': 'home', '/public/html/index.html': 'home', '/public/html/album.html': 'album', '/public/html/orderSave.html': 'orderSave' };

    const p = page[path];
    if (!p || req.method !== 'GET') return next();


    res.on('finish', () => {

        const saveInPG = pool.query('INSERT INTO "visit" (step,"userAgent",ip) VALUES($1,$2,$3)', [p, userAgent, ip]).catch(e => console.log('KHATAYE AMARGIRI :', e.message));

    });

    next();

});



app.use('/public',limitGeneral, express.static(path.join(__dirname, '../public')));

function adminGuard(req, res, next) {
    const requestPage = req.path === '/' || req.path.endsWith('.html');
    if (requestPage && (req.path !== '/login.html') && !req.session.isAdmin) {
        return res.redirect('/admin/login.html');
    }

    if (requestPage) res.set('Cathe-Control', 'no-store');
    next();

}

app.use('/admin',limitAdmin, adminGuard, express.static(path.join(__dirname, '../admin')));




const pool = new Pool({
    user: process.env.USER_DB,
    host: 'localhost',
    database: 'market',
    password: '',
    port: 5432

})


































app.post('/bale/webhook', async (req, res) => {
    try {
        const response = await fetch('http://127.0.0.1:3001/bale/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        res.sendStatus(response.status);

    } catch (err) {
        console.log('WEBHOOK PROXY ERROR:', err.message);
        res.sendStatus(502);
    }
});























const upload = multer({

    storage: multer.memoryStorage(),
    limits: { files: 3, fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {


        const allowedFiles = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/x-ms-bmp'];

        if (allowedFiles.includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error('Error in TYPE file.only[bmp/png/jpg/webp]'));



    }



});



/************************************************************************************ F U N C T I O N */





app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    res.status(500).json({ ok: false, message: 'خطای سرور' });
});










//Add product
app.post('/product', upload.array('images', 3), async (req, res) => {

    const { code, name, price, quantity, status } = JSON.parse(req.body.data);
    const folderAddress = path.join(__dirname, '../', '/public', '/image', '/flower', code);
    await fs.mkdir(folderAddress, { recursive: true });

    const images = [];
    for (let index = 0; index < req.files.length; index++) {

        let nameFile = (index + 1).toString() + '.webp';
        await sharp(req.files[index].buffer).webp({ quality: 80 }).toFile(path.join(folderAddress, nameFile));
        images.push(`../public/image/flower/${code}/${nameFile}`);

    }


    if (req.files[0]) {
        const thumbFile = 'thumb.webp';
        await sharp(req.files[0].buffer).resize(150, 150, { fit: 'cover' }).webp({ quality: 70 }).toFile(path.join(folderAddress, thumbFile));
    }



    const result = await pool.query(`INSERT INTO product (code,name,price,quantity,status)VALUES($1,$2,$3,$4,$5) RETURNING *`, [code, name, price, quantity, status]);

    if (result.rowCount > 0)
        return res.json({ success: true });


});





app.get('/product/show', async (req, res) => {

    const data = await pool.query('SELECT * FROM product ORDER BY code Asc');

    res.json(data.rows);

    console.log(data);

});



app.get("/product/image/:code/:filename", async (req, res) => {

    const p = path.join(__dirname, '../public/image/flower', req.params.code, req.params.filename);
    res.sendFile(p);



});

app.delete('/delete/:table/:key',limitAdmin, async (req, res) => {


    const permittedTabel = ['product', 'order', 'customer'];
    const { table, key } = req.params;

    if (!(permittedTabel.includes(table))) {
        res.send({ error: false });
        return;
    }

    let removeTo = '';
    if (table === 'product')
        removeTo = 'code';
    else
        removeTo = 'id';

    try {
        const row = await pool.query(`DELETE FROM ${table} WHERE ${removeTo}=$1`, [key]);
        res.send({ count: row.rowCount });
        if (row.rowCount > 0) {

            const folderAddress = path.join(__dirname, '../', 'public', 'image', 'flower', key);
            try {
                await fs.rm(folderAddress, { force: true, recursive: true });
            } catch (error) {
                console.log("KHATA DAR HAZF POSHE AKS MAHSOL", error);
            }
        }
    } catch (error) {
        res.send({ count: 0 });
        console.log("KHATAYE HENGEME HAZF AZ DB:", error);
    }
})




app.put('/product/edit',limitAdmin, upload.array('images', 3), async (req, res) => {



    try {

        const { name, code, price, quantity, status } = JSON.parse(req.body.data);
        const result = await pool.query(`UPDATE product SET name=$1,price=$2,quantity=$3,status=$4 WHERE code=$5`, [name, price, quantity, status, code])

        if (result.rowCount > 0)
            res.send({ success: true });



        if (req.files && req.files.length > 0) {
            const folderAddress = path.join(__dirname, '../public/image/flower', code);

            await fs.rm(folderAddress, { recursive: true, force: true });

            await fs.mkdir(folderAddress, { recursive: true });

            for (let i = 0; i < req.files.length; i++) {
                let nameFile = `${i + 1}.webp`;
                sharp(req.files[i].buffer).webp({ quality: 80 }).toFile(path.join(folderAddress, nameFile))
            }



            const nameThumb = 'thumb.webp';

            await sharp(req.files[0].buffer).resize(150, 150, { fit: 'cover' }).webp({ quantity: 70 }).toFile(path.join(folderAddress, nameThumb));




        }//if



    } catch (error) { console.log('KHATAYE EDIT PRODUCT...', error); res.send({ success: false }); console.log('RES::::::::::::', result); };



});




app.get('/product/getPic/:code',limitAdmin, async (req, res) => {
    const code = req.params.code;
    const pathFolder = path.join(__dirname, '../public/image/flower/', code);

    const files = await fs.readdir(pathFolder);



    res.json(files.filter(f => !f.includes('thumb')).map(f => `../public/image/flower/${code}/${f}`));

})


//.map(f => `/image/flower/${code}/${f}`)










//**********************         O R D E R  */







async function generatedTrackingCode() {

    function generate() { return Math.random().toString(36).slice(2, 6).toUpperCase(); }

    let code, notRepeat;
    do {
        code = generate();
        notRepeat = await pool.query('SELECT 1 FROM "order" WHERE "trackingCode"=$1', [code]);
    }
    while (notRepeat.rowCount > 0)

    return code;
}

app.post('/order/save',limitGeneral, async (req, res) => {

    let { nameSender, nameReciver, mobileSender, telSender, telReciver,
        mobileReciver, note, comment, address, city, dateDelivery, timeOf, timeTo, lat, lon,

        items } = req.body;

    dateDelivery = moment(dateDelivery, 'jYYYY/jMM/jDD').format('YYYY/MM/DD');
    console.log('nameSender:', nameSender);

    /*
    
    
                  let  result=validateName(nameSender);
                    if(result.valid===false) return res.json({success:false,msg:result.msg+" Sen"});
                    else nameSender=result.input;
    
                    result=validateName(nameReciver);
                    if( ! result.valid) return res.json({success:false,msg:result.msg+" Rec"});
                    else nameReciver=result.input;
    
                    result=validateMobile(mobileSender,true);
                    if( ! result.valid) return res.json({success:false,msg:result.msg+" Sen"});
                    else mobileSender=result.input;
    
                    result=validateMobile(mobileReciver,false);
                    if(! result.valid ) return res.json({success:false,msg:result.msg+" Rec"});
                    else mobileReciver=result.input;
    
                    result=validateTel(telSender);
                    if(!result.valid) return res.json({success:false,msg:result.msg});
                    else telSender=result.input;
    
                    result=validateTel(telReciver);
                    if(! result.valid) return res.json({success:false,msg:result.msg});
                    else telReciver=result.input;
    
                    result=validateAddress(address);
                    if(! result.valid) return res.json({success:false,msg:result.msg});
                    else address=result.input;
    
                    result=validateComment(comment);
                    if(! result.valid)return res.json({success:false,msg:result.msg});
                    else comment=result.input;
    
                    result=validateNote(note);
                    if(! result.valid) return res.json({success:false,msg:result.msg});
                    else note=result.input;
    
                    result=validateName(city);
                    if(! result.valid) return res.json({success:false,msg:result.msg+" city"});
                    else city=result.input;
    */


    dateDelivery = dateDelivery
        .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
        .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

    const dateNow = TAGHVIM.from(Date.now()).locale('fa', 'YYYY/MM/DD').format('YYYY/MM/DD'); console.log('EMORZ:', dateNow, 'CUSTOMER DATE:', dateDelivery);
    if (dateNow >= dateDelivery) {
        return res.status(400).json({ ok: false, msg: 'Date' })
    }

    const trackingCode = await generatedTrackingCode();




    console.log('address:', address);

    let client = await pool.connect();
    try {


        await client.query('BEGIN');



        const saveOrder = await client.query('INSERT INTO "order" ("nameSender","mobileSender","telSender","nameReciver","mobileReciver","telReciver","dateDelivery","timeOf","timeTo","note","comment","trackingCode","status","totalPrice","address","city","lat","lon") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *',
            [nameSender, mobileSender, telSender, nameReciver,
                mobileReciver, telReciver, dateDelivery,
                timeOf, timeTo, note, comment, trackingCode, 'pending', '0', address, city, lat, lon]);

        const id = await saveOrder.rows[0].id;



        let totalPrice = 0;
        for (const [anyCodeProduct, product] of items) {
            let givePrice = 'SELECT price FROM product WHERE code=$1';
            let priceResult = await client.query(givePrice, [anyCodeProduct]);
            let saveOrderItem = await client.query('INSERT INTO "orderItems" ("trackingCode","quantity","id","codeProduct") VALUES ($1,$2,$3,$4)RETURNING *', [trackingCode, product.quantity, id, anyCodeProduct]);
            totalPrice += Number(product.quantity) * Number(priceResult.rows[0].price);

            await client.query('UPDATE "product" SET "quantity" = "quantity" - $1 WHERE code = $2 AND quantity >= $1', [product.quantity, anyCodeProduct]);
        };



        await client.query('UPDATE "order" SET "totalPrice"=$1 WHERE "trackingCode"=$2', [totalPrice, trackingCode]);


        await client.query('COMMIT');


        let data = { trackingCode, zaman: '', dateDelivery, totalPrice, remain: '' };
        const [hOf, mOf] = timeOf.split(':').map(Number);
        const [hTo, mTo] = timeTo.split(':').map(Number);



        const zamanH = hTo - hOf > 0 ? `${hTo - hOf}` : hOf - hTo > 0 ? `${hOf - hTo}` : '0';
        const zamanM = mTo - mOf > 0 ? `${mTo - mOf}` : mOf - mTo > 0 ? `${mOf - mTo}` : '0';

        const z = TAGHVIM(`${dateDelivery} ${timeOf}`, 'jYYYY/jMM/jDD HH:mm');


        const diff = z.diff(TAGHVIM(), 'minutes');

        data.remain = diff > 0 ?
            `${Math.floor(diff / 1440)} روز و ${Math.floor((diff % 1440) / 60)} ساعت تا تحویل مانده`
            :
            'زمان تحویل رسیده یا گذشته';


        data.zaman = `${zamanH} ساعت و ${zamanM} دقیقه`;



        io.to("adminRoom").emit("adminRoom", data);


        res.json({
            success: 'ok', trackingCode: trackingCode, timeOf: timeOf, timeTo: timeTo, dateDelivery: dateDelivery, totalPrice: totalPrice, address: address
            , dayOfweek: TAGHVIM.from(dateDelivery, 'fa', 'YYYY/MM/DD').locale('fa').format('dddd')
        });

        let namesProduct = '';
        for (const [code, name] of items) { namesProduct += name.name + '-' };
        sendToBale(`${id}
   🔎 کدپیگیری ${trackingCode}
   📱 فرستنده ${mobileSender}
   📆 تحویل ${Intl.DateTimeFormat('fa-IR').format(new Date(dateDelivery))}
    زمان باقیمانده ${data.zaman}
   🎁 محصولات ${namesProduct}
   🔷 قیمت کل ${totalPrice}`);

        console.log('pricetotal', totalPrice);

    } catch (error) {
        console.log('KHATAYE SABTE SEFARESH :', error);

        await client.query('ROLLBACK');
        res.json({ success: false });


    } finally { client.release(); }




});










// cancel order (laghv sefaresh)

app.patch('/order/cancel/',limitGeneral, async (req, res) => {

    const { mobileSender, trackingCode } = req.query;

    try {
        const row = await pool.query(`UPDATE "order" SET "status"='canceled' WHERE "mobileSender"=$1 AND "trackingCode"=$2 AND status IN ('pending','processing')`, [mobileSender, trackingCode]);
        if (row.rowCount > 0) {
            res.json({ ok: true });
            return;
        }
        else {
            res.json({ ok: false });
            return;
        }
    } catch (e) {
        console.log('KHATAYE LAGHV SEFARESH :', e.message);
        return res.status(500).json('fail:false');
    }

});

// Ttracking order(peygiri)

app.get('/order/tracking/', async (req, res) => {
    const { mobile, code } = req.query;

    try {

        const row = await pool.query(`SELECT *,to_char("dateDelivery" , 'YYYY/MM/DD') AS "dateDelivery" FROM "order" WHERE "mobileSender"=$1 AND "trackingCode"=$2`, [mobile, code]);

        row.rows[0].createdAt = TAGHVIM(row.rows[0].createdAt, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD');
        if (row.rowCount > 0) {
            res.status(200).json({ ok: true, data: row.rows[0] });
            return;
        }
        else {
            res.json({ ok: false });
            return;
        }
    } catch (e) {
        res.json({ fail: true });
        console.log('KHATAYE PEYGIRI KARBAR (mobileSender=', mobile, ' trcode=', code, ')');

    }

});

app.patch('/order/inbox/seen/', onlyAdmin, async (req, res) => {

    try {
        const { trackingCodes } = req.body;

        await pool.query(`UPDATE "order" SET "isSeen"=true WHERE "trackingCode"=ANY($1) RETURNING *`, [trackingCodes]);
        res.json({ success: true });

    } catch (err) {
        console.log('KHATAYE UPDATE ISSEEN ORDER LAHZE VOROD MODIR :', err);
        res.status(500).json({ success: false });
    }

});


//order List show all record




app.get('/order/list/:page/:rowCount', onlyAdmin, async (req, res) => {

    const { page, rowCount } = req.params;

    const rows = await pool.query('SELECT * FROM "order"');


    if (rows.rowCount > 0)
        return res.status(200).json({ success: true, rows: rows.rows });
    else
        return res.status(401).json({ success: false });

    console.log(rows.rows);
});



app.get('/order/details/:trackingCode', async (req, res) => {

    const { trackingCode } = req.params;
    const { rows } = await pool.query(`SELECT "orderItems"."codeProduct", "product".name, "orderItems".quantity
                                            FROM "orderItems"
                                            LEFT JOIN "product" ON "product"."code" = "orderItems"."codeProduct"
                                            WHERE "orderItems"."trackingCode" = $1`, [trackingCode]);

    res.json(rows);
});



app.patch('/order/update/:trackingCode', onlyAdmin, async (req, res) => {
    const trackingCode = req.params.trackingCode;
    const { status, paymentMethod, statusPayment } = req.body;

    const row = await pool.query(`UPDATE "order" SET "status"=COALESCE($1,"status"),
                                              "paymentMethod"=COALESCE($2,"paymentMethod"),
                                              "statusPayment"=COALESCE($3,"statusPayment")
                                               WHERE "trackingCode"=$4`,
        [status, paymentMethod, statusPayment, trackingCode]);


    if (row.rowCount > 0)
        res.json({ success: 'ok' });

})








app.post('/occasion/save', async (req, res) => {

    const { name, date } = req.body;

    try {
        const isSave = await pool.query('INSERT INTO occasion (name,date) VALUES($1,$2)', [name, date]);

        res.send({ success: 'ok' });



    }
    catch (error) { if (error.code === '23505') return res.send({ success: 'duplicated' }) };

    res.json({ success: 'fail' });

});




app.get('/occasion/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM occasion ORDER BY "date" ASC');
        res.json(result.rows);
    } catch (error) { if (error.code === '08000') res.json({ success: disconnected }) }


});




app.delete('/occasion/del/:date', async (req, res) => {
    const date = req.params.date;

    try {
        const row = await pool.query('DELETE FROM occasion WHERE date=$1', [date]);

        if (row.rowCount > 0) {
            res.send({ success: 'ok' });
            return;
        }
        else
            res.send({ success: 'no' });



    } catch (error) { console.log('khataye hazf MONASEBAT : ', error); }
})




function onlyAdmin(req, res, next) {
    if (req.session.isAdmin) return next();
    else
        return res.status(401).json({ success: false, unauthorized: true });
}






app.patch('/order/pay/cash', async (req, res) => {

    const { method, trCode } = req.body;
    console.log('method:', method, 'trCode:', trCode);
    if (method === 'cash') {
        const payCash = await pool.query('UPDATE "order" SET "paymentMethod"=$1,"statusPayment"=$2 WHERE "trackingCode"=$3 RETURNING *', ['cash', 'notPaid', trCode]);
        if (payCash.rowCount > 0) res.json({ ok: true });

        sendToBale(`🟠حضوری\n${payCash.rows[0].id}:\nسفارش جدید:${payCash.rows[0].trackingCode}\nقیمت کل :${payCash.rows[0].totalPrice}`);
    }

});



/**************************************** RECEIPT SAVE *****/


const uploadReceipt = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const allowedFiles = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/x-ms-bmp'];
        if (allowedFiles.includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error('Invalid file type'), false);
    }
});




app.post('/order/pay/card', uploadReceipt.single('picReceipt'), async (req, res) => {

    const data = req.body;
    try {
        const filePicReceipt = req.file;



        const itWasOrder = await pool.query('SELECT * FROM "order" WHERE "trackingCode"=$1', [data.trCode]);

        if (itWasOrder.rowCount === 0 || (itWasOrder.rows[0].statusPayment) === 'paid') {
            res.json({ ok: false });
            return;
        }
        const folderMake = path.join(__dirname, '../private/image/receipt', itWasOrder.rows[0].trackingCode);
        await fs.mkdir(folderMake, { recursive: true });

        const fileNameOld = `${itWasOrder.rows[0].trackingCode}.webp`;
        const fileNameNew = `${crypto.randomUUID()}.webp`;
        await sharp(filePicReceipt.buffer).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(folderMake, fileNameNew));



        const saveMethod = await pool.query('UPDATE "order" SET "paymentMethod"=$1,"statusPayment"=$2,"datePayment"=$3 WHERE "trackingCode"=$4 RETURNING *', ['card', 'paid', new Date(), data.trCode]);
        if (saveMethod.rowCount > 0) {
            res.json({ ok: true });
            sendToBale(`🟢*کارت به کارت*\n${saveMethod.rows[0].id}:\nسفارش جدید:${saveMethod.rows[0].trackingCode}\nتاریخ پرداخت:${new Intl.DateTimeFormat('fa-IR').format(new Date(saveMethod.rows[0].datePayment))}\n
                     \n\n قیمت کل :${saveMethod.rows[0].totalPrice}\n`);
        }

    } catch (e) {
        console.log('KHATAYE SABTE RESID :', e.message);
        res.status(500).json({ ok: false });
    }




    /*
    const folderMake=path.join(__dirname,'../public/image/receipt',itWasOrder.rows[0].trackingCode);
    await fs.mkdir(folderMake,{recursive:true});
    
       const fileName=`${itWasOrder.rows[0].trackingCode}.webp`;
       await sharp(filePicReceipt.buffer).webp({quality:80}).toFile(path.join(folderMake,fileName));
    
    
    const saveMethod=await pool.query('UPDATE "order" SET "paymentMethod"=$1,"statusPayment"=$2,"datePayment"=$3 WHERE "trackingCode"=$4',['card','paid',new Date(),data.trCode]);   
    if(saveMethod.rowCount>0)
        res.json({ok:true});
    */

});

/*
app.get('/image/receipt/:code', onlyAdmin, async (req, res) => {

    const folder = path.join(__dirname, '../private/image/receipt/', path.basename(req.params.code));
    try {
        const files = await fs.readdir(folder);
        res.set('Cache-Control', 'private,no-store');
        res.sendFile(path.join(folder, files[0]));
    } catch { res.sendStatus(404) }
})
*/

app.get('/order/image/receipt/', onlyAdmin, async (req, res) => {

    const allowed = ['cash', 'card', 'gateway'];
    try {


        let { dateFrom, dateTo, methodPayment } = req.query;

        if (!allowed.includes(methodPayment))
            return res.status(400).json({ success: false });

        console.log('JFrom:', dateFrom);
        console.log('JTo:', dateTo);

        console.log('\t\t\t\t Method  : ', methodPayment);


        let from = TAGHVIM(dateFrom, 'jYYYY/jMM/jDD'); dateFrom = from.subtract(1, 'day').format('YYYY/MM/DD');
        dateTo = TAGHVIM(dateTo, 'jYYYY/jMM/jDD').format('YYYY/MM/DD');

        console.log('from:', dateFrom);
        console.log('to:', dateTo);



        const row = await pool.query(`SELECT * FROM "order" WHERE ("paymentMethod"=$1) AND (COALESCE("datePayment","createdAt")::date>=$2) AND (COALESCE("datePayment","createdAt")::date<=$3)`, [methodPayment, dateFrom, dateTo]);

        if (row.rowCount > 0)
            return res.status(200).json({ success: true, rows: row.rows });
        else
            return res.status(200).json({ success: false, rows: [] });// no record found



    } catch (err) {



        console.log('KHATAYE MOSHAKHASTATE MOSHTARIAN [CARD TO CARD].WHEN REVIEW RECEIPT INFO :', err);
        return res.status(500).json({ success: false });

    }
})




app.get('/show/order/image/receipt/:trackingCode', onlyAdmin, async (req, res) => {

    try {

        const trackingCode = req.params.trackingCode;
        const folder = path.join(__dirname, '../private/image/receipt', path.basename(trackingCode));
        let files;

        try {

            files = await fs.readdir(folder);   // نام تصادفی را همین‌جا پیدا می‌کند
        } catch (err) {
            if (err.code === 'ENOENT')
                return res.status(404).json({ success: false, e: 'none' });

            throw err;

        }



        if (files.length === 0)
            return res.status(404).json({ success: false, e: 'empty' });



        return res.status(200).sendFile(path.join(folder, files[0])); // و خودش می‌فرستد







    } catch (err) {

        console.log('KHATAYE NAMAYESH AKS [CARD TO CARD].WHEN REVIEW RECEIPT AKS :', err);
        return res.status(500).json({ success: false, e: 'faile' });

    }
})


/***************************************    R E P O R T  */




app.get('/order/report/', async (req, res) => {

    const typeReport = req.query.typeReport;

    const report = ['new', 'paid', 'notPaid', 'fast']; console.log("typeReport :", typeReport);
    if (!report.includes(typeReport)) return res.json({ success: false, way: 'bad' });

    const parts = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', {
        timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
    const today = `${p.year}-${p.month}-${p.day}`;


    let sql, par = [];
    switch (typeReport) {
        case 'new': sql = 'SELECT * FROM "order" ORDER BY "createdAt" LIMIT 5'; console.log('sql:', sql);
            break;
        case 'paid': sql = 'SELECT * FROM "order" WHERE "statusPayment"=$1'; par = ['paid'];
            break;
        case 'notPaid': sql = 'SELECT * FROM "order" WHERE "statusPayment"=$1'; par = ['notPaid'];
            break;
        case 'fast': sql = 'SELECT * FROM "order" WHERE "dateDelivery">=$1 ORDER BY "dateDelivery" ASC LIMIT 10'; par = [today];
            break;
    }

    const result = await pool.query(sql, par); console.log('result:', result.rows);

    if (result.rowCount > 0)
        res.json({ success: true, result: result.rows });
    else
        res.json({ success: false });


});




/******************************************************* */














/*****************************************  L O G I N **************************/









function toHash(pass) {

    return

}

async function writeLog(file, text) {
    try {
        await fs.appendFile(file, text + '\n');
    } catch (e) {
        console.log('KHATAYE NEVESHTAN GOZARESH DAR FILE:', e.message);
    }
}


app.post('/loginAADDMMIINN/', async (req, res) => {
    const file = path.join(__dirname, '../private/drowsap.dat');
    const when = TAGHVIM().locale('fa').format('jYYYY/jMM/jDD HH:mm:ss');

    try {
        const nameTry = String(req.body.userName ?? '').trim();
        const passTry = String(req.body.password ?? '').trim();

        const text = await fs.readFile(file, 'utf-8');
        const lines = text.split('\n').filter(l => l.trim() !== '');

        const up = JSON.parse(lines[0]);      // فقط خط اول
        const number = lines.length;          // شماره‌ی این رویداد

        if (String(up.up) === nameTry && String(up.pu) === passTry) {
            req.session.isAdmin = true;
            await writeLog(file, `${number} | ${when} | ورود موفق`);
            return res.status(200).json({ ok: true });
        }

        const safeName = nameTry.replace(/[\r\n|]/g, ' ').slice(0, 30);
        await writeLog(file, `${number} | ${when} | ورود ناموفق | نام واردشده: ${safeName}`);
        return res.status(401).json({ ok: false });

    } catch (err) {
        console.log('KHATAYE LOGIN :', err);

        return res.status(500).json({ ok: false });
    }
});


/**************************************** end  L O G I N  **********************/






// V  I  S  I  T

app.get('/visit', async (req, res) => {


    const save = pool.query('SELECT * FROM "visit" ', [])

})






















app.use((error, req, res, next) => {

    console.log('ERROR:', error);

    res.status(400).json({
        success: false,
        error: error.message
    });

});












//app.listen(port, '0.0.0.0', () => { console.log(`server runing...at port ${port}`) });

httpServer.listen(port, () => { console.log('server http start...') });












async function sendToBale(text) {
    const url = `https://tapi.bale.ai/bot${process.env.BALE_TOKEN_ADMIN}/sendMessage`;
    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.BALE_CHAT_ID_ADMIN, text }),
    });
}