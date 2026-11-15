/*
import { setGlobalDispatcher, ProxyAgent } from 'undici';
setGlobalDispatcher(new ProxyAgent('http://192.168.1.100:10808'));

*/
import fetchProxy from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';

const baleAgent = new SocksProxyAgent('socks5h://127.0.0.1:10808');





import express from 'express';
import 'dotenv/config';
import { text } from 'node:stream/consumers';
import { ok } from 'node:assert';
import { DAY } from 'express-rate-limit';
const app=express();
const PORT=3001;
const addrBotToken = `https://tapi.bale.ai/bot${process.env.BALE_BOT_TOKEN}`;


app.use(express.json());

 const users = new Map();








app.post('/bale/webhook', async (req, res) => {
    res.sendStatus(200);
    console.log('webhook Recive....');
   const baleData = req.body;
    try {
        
        
        const cq=baleData.callback_query;



        if (baleData.message?.text === '/start') {

            const chatId = baleData.message?.chat?.id;
            users.delete(chatId);
            await sendAllProducts(chatId);
            await sendMessageToBaleBot(chatId,'لطفایک مورد را انتخاب بفرمایید.سپس فرم درخواست ازشما پرسیده میشود.');
            return;
        }

        

        if (cq) {
            
            const cqId=cq.message.chat.id;
            const user=users.get(cqId);
        
        

            if(user && user.step==='dateM' && /^m\d\d$/.test(cq.data)){
                user.data.dateM=cq.data.slice(1);
                user.step='dateD';
                await dayButton(cqId);
                return;

            }
            if(user && user.step==='dateD' && /^d\d\d$/.test(cq.data)){
                user.data.dateD=cq.data.slice(1);
                await saveOrder(cqId,user);
                return;
            }

            //else  SELECT PRODUCT WITH BUTTON BALE

            users.set(cqId,{step:'name',data:{productCode:cq.data}});            
            await sendMessageToBaleBot(cqId,'نام ونام خانوادگی؟');   
            return;
        }

        if(baleData.message?.text){
            const chatId=baleData.message.chat.id;
            const text=baleData.message.text;
            const user=users.get(chatId);
            
            if(!user) return;


            if(user.step==='name'){
                user.data.name=text;
                user.step='mobile';
                await sendMessageToBaleBot(chatId,'شماره مبایل؟');
                return;
            }

            if(user.step==='mobile'){
                user.data.mobile=text;
                user.step='address';
                await sendMessageToBaleBot(chatId,'آدرس دریافت محصول؟');
                return;
            }
            if(user.step==='address'){
                user.data.address=text;
                user.step='dateM';
                await monthButton(chatId);                
                return;
            }
           

    return;


        }        

    } catch (e) { console.log(e); }
});



async function saveOrder(chatId,user){

    const dateNow=Intl.DateTimeFormat('fa-IR',{year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const yearJalali=dateNow.find(d=>d.type==='year').value;
    const monthJalali=dateNow.find(d=>d.type==='month').value;
    const dayJalali=dateNow.find(d=>d.type==='day').value;
if(user.data.dateM<monthJalali || (user.data.dateM===monthJalali && user.data.dateD>=dayJalali)) return await sendMessageToBaleBot(chatId,'تاریخ انتخابی گذشته است');

const dateDeliveryOfBale=yearJalali+'/'+toLatinDigits(user.data.dateM)+'/'+toLatinDigits(user.data.dateD);

    const baleform = {
        nameSender: user.data.name, nameReciver: user.data.name,
        mobileSender: toLatinDigits(user.data.mobile), mobileReciver: toLatinDigits(user.data.mobile),
        telSender: '', telReciver: '', note: '', comment: 'از ربات بله',
        address: user.data.address, city: '', lat: null, lon: null,
        dateDelivery:dateDeliveryOfBale,
        timeOf: '07:00', timeTo: '19:00',
        items: [[user.data.productCode, { name: user.data.productCode, quantity: 1 }]]
    };



try{

    const response = await fetchProxy('http://localhost:3000/order/save', {
        method: 'POST',        
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baleform)
    })

    const result = await response.json();

    if (result.success === 'ok'){
         console.log('SUCCESSFULLY SAVE ORDER I DB...', result);
        await sendMessageToBaleBot(chatId, '🌹سپاس ازخریدشما🌹 \n به شمااطمینان میدهیم درتاریخ موردنظرتقدیمتان شود');
        users.delete(chatId);

    }
    else{
        console.log('KHATAYE SABTE SEFARESH[DAR SERVERbOT]:',result);
        await sendMessageToBaleBot(chatId, '⛔خطا⛔ \n متاسفانه ثبت سفارش انجام نشد دوباره تلاش بفرمایید');
        
    }



}catch(e){
    console.log('KHATAYE ZAKHIRE AZ TARIGHE PLATFORM [BALE](dar in lahzeh dadaha resideh va dar zamane ersal be server aval khata khorde):',e.message);
    await sendMessageToBaleBot(chatId, '⛔خطا⛔ \n متاسفانه ثبت سفارش انجام نشد دوباره تلاش بفرمایید'+'\n'+'محصول انتخابی'+user.data.productCode);
    }


   

}





async function sendMessageToBaleBot(chatId,text) {

    try{
                const response = await fetchProxy(`${addrBotToken}/sendMessage`,{
                    method:'POST',
                    agent: baleAgent,
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({chat_id:chatId,text:text})
                });

                return await response.json();
    }catch(err){console.log('KHATAYE ERSAL BE BOT BALE(func sendMessageToBaleBot):',err.message);}
    
}








async function sendProduct(chatId,code,name,price) {
    const photo=`${process.env.SITE_URL}/public/image/flower/${code}/thumb.webp`;
    const caption=`${name}\nقیمت ریال ${Number(price).toLocaleString('fa-IR')}`;
    const response =await fetchProxy(`${addrBotToken}/sendPhoto`,{
        method:'POST',
        agent: baleAgent,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({chat_id:chatId,photo:photo,caption:caption,

                            reply_markup:{
                                inline_keyboard:[[{text:'ثبت سفارش',callback_data:`${code}`}]]
                            }
        })
    });

    return await response.json();
}



async function monthButton(chatId) {
    const response = await fetchProxy(`${addrBotToken}/sendMessage`, {
        method: 'POST', agent: baleAgent, headers:{'Content-Type':'application/json'},
        body:JSON.stringify({


                                chat_id:chatId,
                                text:'برای تاریخ تحویل ماه را انتخاب بفرمایید',
                                reply_markup:{
                                    inline_keyboard: [[{ text: 'فروردین', callback_data: 'm01' }, { text: 'اردیبهشت', callback_data: 'm02' }, { text: 'خرداد', callback_data: 'm03' }],
                                        [{ text: 'تیر', callback_data: 'm04' }, { text: 'مرداد', callback_data: 'm05' }, { text: 'شهریور', callback_data: 'm06' }],
                                        [{ text: 'مهر', callback_data: 'm07' }, { text: 'آبان', callback_data: 'm08' }, { text: 'آذر', callback_data: 'm09' }],
                                        [{ text: 'دی', callback_data: 'm10' }, { text: 'بهمن', callback_data: 'm11' }, { text: 'اسفند', callback_data: 'm12' }]]
                                }


        })
    });

return await response.json();

    
}

async function dayButton(chatId){

    const response = await fetchProxy(`${addrBotToken}/sendMessage`, {
        method: 'POST', agent: baleAgent, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({


            chat_id: chatId,
            text: 'روزتحویل را انتخاب بفرمایید',
            reply_markup: {
                inline_keyboard: [[{ text: 'یکم', callback_data: 'd01' }, { text: 'دوم', callback_data: 'd02' }, { text: 'سوم', callback_data: 'd03' }],
                [{ text: 'چهارم', callback_data: 'd04' }, { text: 'پنجم', callback_data: 'd05' }, { text: 'ششم', callback_data: 'd06' }],
                [{ text: 'هفتم', callback_data: 'd07' }, { text: 'هشتم', callback_data: 'd08' }, { text: 'نهم', callback_data: 'd09' }],
                [{ text: 'دهم', callback_data: 'd10' }, { text: 'یازدهم', callback_data: 'd11' }, { text: 'دوازدهم', callback_data: 'd12' }],
                    [{ text: 'سیزدهم', callback_data: 'd13' }, { text: 'چهاردهم', callback_data: 'd14' }, { text: 'پانزدهم', callback_data: 'd15' }],
                    [{ text: 'شانزدهم', callback_data: 'd16' }, { text: 'هفدهم', callback_data: 'd17' }, { text: 'هجدهم', callback_data: 'd18' }],
                    [{ text: 'نوزده هم', callback_data: 'd19' }, { text: 'بیستم', callback_data: 'd20' }, { text: 'بیست ویکم', callback_data: 'd21' }],
                    [{ text: 'بیست ودوم', callback_data: 'd22' }, { text: 'بیست وسوم', callback_data: 'd23' }, { text: 'بیست وچهارم', callback_data: 'd24' }],
                    [{ text: 'بیست وپنجم', callback_data: 'd25' }, { text: 'بیست وششم', callback_data: 'd26' }, { text: 'بیست وهفتم', callback_data: 'd27' }],
                    [{ text: 'بیست وهشتم', callback_data: 'd28' }, { text: 'بیست ونهم', callback_data: 'd29' }, { text: 'سی ام', callback_data: 'd30' }],
                    [{ text: 'سی ویکم', callback_data: 'd31' }]
                    
            
            
            ]
            }


        })
    });

    return await response.json();


}



async function loadOfDb() {
    const response=await fetch('http://localhost:3000/product/show',{method:'GET'});
    return await response.json();
}
async function sendAllProducts(chatId) {
   

    const products=await loadOfDb();

    for(const p of products){
        const result= await sendProduct(chatId,p.code,p.name,p.price);
        if(!result.ok)
            console.log('KHATAYE ERSAL',p.code,result);
    }
    
}



















app.listen(PORT,async()=>{
    console.log(`server BOT starting... in port ${PORT}`);

try{
    const response=await fetchProxy(`${addrBotToken}/setWebhook`,{
        method:'POST',
        agent: baleAgent,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({url:process.env.BALE_BOT_URL+'/bale/webhook'})
        
    });

console.log('webhook register?:',await response.json()) ;
}catch(e){console.log(e.message,e,'SERVER BE BALE MOTASEL NASHOD')}
});



















function toLatinDigits(s) {
    return String(s)
        .replace(/[۰-۹]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
        .replace(/[٠-٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 1584))
        .trim();
}