const data=JSON.parse(sessionStorage.getItem('dataPayment'));

console.log(data.paymentMethod,"///",data.totalPrice,'///',data.trCode);
/* const dataPayment={
                        trCode:res.trackingCode,
                        totalPrice:res.totalPrice,
                        timeTo:res.timeTo,
                        timeOf:res.timeOf,
                        dateDelivery:res.dateDelivery,
                        
    }

    sessionStorage.setItem('dataPayment',JSON.stringify(dataPayment));*/

const spanPaymentMethod=document.getElementById('paymentMethod');
const spanTotalPrice=document.getElementById('spanTotalPrice');
const spanTrCode=document.getElementById('spanTrCode');
const spanCopy=document.getElementById('copy');



spanTrCode.innerHTML = (data.trCode);
spanTotalPrice.innerHTML=data.totalPrice.toLocaleString('fa-IR')+'\u2003<span style="font-size: 10px;">تومان</span>';




const btnCash=document.getElementById('btnCash');
const btnCard=document.getElementById('btnCard');
const btnGateway=document.getElementById('btnGateway');

const divCashPayment=document.getElementById('divCashPayment');
const divCardPayment=document.getElementById('divCardPayment');
const divGatewayPayment=document.getElementById('divGatewayPayment');

btnCash.addEventListener('click', funcCashPayment);
btnCard.addEventListener('click', funcCardPayment);
btnGateway.addEventListener('click', funcGatewayPayment);



                                                                    ///COPY
async function copyText(idElement){
    const text=document.getElementById(idElement).textContent.trim();

    if(navigator.clipboard && window.isSecureContext)
     await navigator.clipboard.writeText(text); 
    else{
        const ta=document.createElement('textarea');
        document.body.appendChild(ta);
        ta.style.position='fixed';
        ta.style.opacity='0';
        ta.value=text;
        ta.focus();
        ta.select();        
        document.execCommand('copy');
        ta.remove();
    }
    document.getElementById(idElement+'Copy').textContent='کپی شد';
    setTimeout(() => {
        document.getElementById(idElement+'Copy').textContent = 'کپی';
       
    }, 4000);
    
}


                                                                /////





        // C A SH

                    //Event

const btnCashPay = document.getElementById('btnCashPay');
btnCashPay.addEventListener('click', async () => {

    btnCashPay.disabled = true;
    btnCashPay.classList.add('wait');
try{
    const res = await payCash('cash', data.trCode);

    if (res.ok){ 
        document.getElementById('btnToMethod').display='block';
        const congraBox=document.getElementById('congratulations');             //Cong Cash
        congraBox.showModal();
        }
    else alert('no');

}catch(e){alert('خطای ارتباطی');

}finally{

    btnCashPay.disabled=false;
    btnCashPay.classList.remove('wait');
}
})

function funcCashPayment() {

    document.getElementById('time').textContent=data.timeOf+' تا '+data.timeTo;
    document.getElementById('date').textContent=data.dateDelivery + ' ('+data.dayOfweek+')';
    document.getElementById('address').textContent=data.address.replace(/,/g,' ، ').replace(/:/g,'');
    btnCash.classList.add('btnActive');
    btnCard.classList.remove('btnActive');
    btnGateway.classList.remove('btnActive');
    divCashPayment.style.display='flex';
    divCardPayment.style.display='none';
    divGatewayPayment.style.display='none'; 
    btnCash.style.borderBottom='4px solid #f5f5f5';
    btnCard.style.borderBottom='none';
    btnGateway.style.borderBottom='none';


    document.getElementById('spanDetailMethod').textContent='مبلغ سفارش را هنگام تحویل به پیک پرداخت کنید.هیچ پیش پرداختی لازم نیست.';
}


async function payCash(data,trCode){
    const response =await fetch('/order/pay/cash', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({method:data, trCode:trCode}) });

    const result=await response.json();

    return result;
}

/****************** E N D cash  ************************************************* */


 //  C A R D

            //Event

                                //select pic

const divUploadReceipt = document.getElementById('divUploadReceipt');
const inpUploadReceipt = document.getElementById('uploadReceipt');
const fourNum = document.getElementById('fourNum');
divUploadReceipt.addEventListener('click', () => { 
    inpUploadReceipt.click();
});


inpUploadReceipt.addEventListener('change', () => {
    const file = inpUploadReceipt.files[0];
    const picReceipt = document.getElementById('picReceipt');

    if (!file) return;
    
    
    document.getElementById('errorShow').textContent ='';
    document.getElementById('spanSelect').style.display = 'none';
    picReceipt.src = URL.createObjectURL(file);
    picReceipt.style.display = 'flex';
    divUploadReceipt.style.padding=0;
    btnUploadReceipt.classList.remove('wait');

});


                                // button send

const btnUploadReceipt = document.getElementById('btnUploadReceipt');
btnUploadReceipt.addEventListener('click', async () => {
    
    const file = inpUploadReceipt.files[0];
    if (!file) {
        document.getElementById('errorShow').textContent = 'لطفاتصویررسیدپرداختی راانتخاب کنید';
        return;
    }

    btnUploadReceipt.disabled = true;
    btnUploadReceipt.classList.add('wait');
try{
    const result = await payCard(file, data.trCode);
    if (!result || !result.ok) {
        alert('سفارش یافت نشد');
        return;
    }
 const cong=document.getElementById('congratulations');                //CONG CARD
    document.getElementById('btnToMethod').style.display='none';
    cong.showModal();
}catch(e){
    alert('خطادرارتباط با سرور');
    return;
}finally{
    
    btnUploadReceipt.disabled = false;
    btnUploadReceipt.classList.remove('wait');
    

}

   

});

           

function funcCardPayment() {
    btnCard.classList.add('btnActive');
    btnCash.classList.remove('btnActive');
    btnGateway.classList.remove('btnActive');
    divCardPayment.style.display='grid';
    divCashPayment.style.display='none';
    divGatewayPayment.style.display='none';
    btnCard.style.borderBottom='4px solid #f5f5f5';
    btnCash.style.borderBottom='none';
    btnGateway.style.borderBottom='none';
    if( ! inpUploadReceipt.files[0]) btnUploadReceipt.classList.add('wait');

    document.getElementById('spanDetailMethod').textContent = 'مبلغ را به شماره کارت زیر واریز وعکس فیش یا رسید واریزی رابارگزاری کنید.';

}
async function payCard(picReceipt,trCode) {
    const data=new FormData();
    data.append('trCode', trCode);
    data.append('picReceipt',picReceipt);
    
    const response=await fetch('/order/pay/card', { method: 'POST', body: data });             
    return response.json();
}


/********************* E N D CARD ******************************/









//      G A T E W A Y




function funcGatewayPayment() {
    btnGateway.classList.add('btnActive');
    btnCash.classList.remove('btnActive');
    btnCard.classList.remove('btnActive');
   
    divGatewayPayment.style.display='block';
    divCashPayment.style.display='none';
    divCardPayment.style.display='none';
    btnGateway.style.borderBottom='4px solid #f5f5f5';
    btnCash.style.borderBottom='none';
    btnCard.style.borderBottom='none';

    document.getElementById('spanDetailMethod').textContent = 'باکارتهای عضوشتاب امن و آنی واریزکنید.';
}






/***************************************    CONRATULATION       ***********************************************/


function resetPaymentPage() {
    // دکمه‌های انتخاب روش
    btnCash.classList.remove('btnActive');
    btnCard.classList.remove('btnActive');
    btnGateway.classList.remove('btnActive');

    // بخش‌های هر روش
    divCashPayment.style.display = 'none';
    divCardPayment.style.display = 'none';
    divGatewayPayment.style.display = 'none';

    // توضیح زیر روش‌ها
    document.getElementById('spanDetailMethod').textContent = '';

    // نقدی
    btnCashPay.disabled = false;
    btnCashPay.classList.remove('wait');

    // کارتی
    const picReceipt = document.getElementById('picReceipt');
    if (picReceipt.src && picReceipt.src.startsWith('blob:')) {
        URL.revokeObjectURL(picReceipt.src);
    }
    picReceipt.removeAttribute('src');
    picReceipt.style.display = 'none';

    inpUploadReceipt.value = '';                       // مهم: بدون این، انتخاب دوباره همان فایل رویداد تغییر نمی‌دهد
    document.getElementById('spanSelect').style.display = '';
    document.getElementById('errorShow').textContent = '';
    divUploadReceipt.style.padding = '';

    btnUploadReceipt.disabled = false;
    btnUploadReceipt.classList.remove('wait');


    

    // پنجره تبریک
    document.getElementById('btnToMethod').style.display = '';
}




document.getElementById('spnTrcode').textContent = data.trCode;



const btnToMarket=document.getElementById('btnToMarket');
const btnToMethod=document.getElementById('btnToMethod');
const btnToTrack=document.getElementById('btnToTrack');

btnToMethod.addEventListener('click',()=>{
    resetPaymentPage();
        const winCong=document.getElementById('congratulations');
        winCong.close();
});



btnToMarket.addEventListener('click', () => {
    /*const winCong = document.getElementById('congratulations');
    winCong.close();*/
    window.location.replace('/public/html/index.html');
});



btnToTrack.addEventListener('click', () => {
   /* const winCong = document.getElementById('congratulations');
    winCong.close();*/
    window.location.replace('/public/html/tracking.html');
});

document.getElementById('congratulations').addEventListener('keydown', (e) => {
    if (e.key === 'Escape') e.preventDefault();
});

funcCashPayment();