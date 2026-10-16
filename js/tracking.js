
const divList=document.querySelector('.list');
const btnSearch=document.getElementById('btnSearch');
const inpMobile=document.getElementById('inpMobile');
const inpTrcode = document.getElementById('inpTrcode');
const showError=document.getElementById('showError');



let m, c = '';

document.addEventListener('DOMContentLoaded',()=>{divList.style.display='none'});
inpMobile.addEventListener('input',()=>{if((inpMobile.value).length===11)
        inpTrcode.focus();
});

[inpMobile, inpTrcode].forEach((inp) => {
    inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btnSearch.click();
    });
});

/************************************************************** cancel       */

const btnCancel=document.getElementById('btnCancel');
btnCancel.addEventListener('click',async()=>{
if(confirm('?'))
   try{ 
    const respons=await fetch(`/order/cancel/?mobileSender=${m}&trackingCode=${c}`,{method:'PATCH'});
    const result=await respons.json();
    if(respons.ok && result.ok)
    {
        showError.textContent=('لغوشد');

    }else{
        showError.textContent=('سفارش دیگر قابل تغییر نیست.یا پیدا نشد');
        return;


    }
   }catch(e){showError.textContent=('خطای ارتباطی');}

})



btnSearch.addEventListener('click',async()=>{

    const mobile = toLatinDigits(inpMobile.value).trim();
    const code = toLatinDigits(inpTrcode.value).trim().toUpperCase();
    divList.style.display = 'none';

    if (!/^09\d{9}$/.test(mobile) || !/^[A-Z0-9]{4}$/.test(code)) {
        showError.textContent = 'شماره موبایل یا کد رهگیری معتبر نیست';
        return;
    }



    if (!/^09\d{9}$/.test(mobile) || !code )
    {
        showError.textContent='لطفا مقدار درست وارد کنید';
        return;

    }
showError.textContent='';

divList.style.display='grid';
    const result=await funcShowOrder(mobile,code);

const senderName=document.getElementById('senderName');
const reciverName=document.getElementById('reciverName');
const mobileSender=document.getElementById('mobileSender');
const mobileReciver = document.getElementById('mobileReciver');
const telSender = document.getElementById('telSender');
const telReciver = document.getElementById('telReciver');
const dateDelivery = document.getElementById('DDdateDelivery');
const timeOf = document.getElementById('timeOf');
const timeTo = document.getElementById('timeTo');
const address = document.getElementById('address');
const note = document.getElementById('note');
const methodPayment = document.getElementById('methodPayment');
const statusPayment = document.getElementById('statusPayment');
const statusOrder = document.getElementById('statusOrder');
const totalPrice = document.getElementById('totalPrice');
   

senderName.textContent= result.nameSender??'';
reciverName.textContent=result.nameReciver??'';
address.textContent=result.address??'';
mobileSender.textContent=result.mobileSender??'';
mobileReciver.textContent=result.mobileReciver??'';
telSender.textContent=result.telSender??'';
telReciver.textContent=result.telReciver??'';
dateDelivery.textContent=result.dateDelivery??'';
timeOf.textContent=result.timeOf??'';
timeTo.textContent=result.timeTo??'';
note.textContent=result.note??'';


document.getElementById('dateDelivery').textContent=result.dateDelivery;
document.getElementById('dateCreated').textContent = result.createdAt;



m=mobileSender.textContent;c=result.trackingCode;

    switch (result.paymentMethod){
        case 'card': methodPayment.textContent ='کارت به کارت';
            break;

        case 'cash': methodPayment.textContent ='پرداخت حضوری(درمحل)';
            break;

        case 'gateway': methodPayment.textContent ='درگاه بانکی(آنلاین)';
            break;
    }

    switch (result.statusPayment) {
        case 'paid': statusPayment.textContent = ' پرداخت شد ';
            break;

        case 'notPaid': statusPayment.textContent = 'پرداخت نشد';
            break;           
    }




    switch (result.status){
       case 'pending': statusOrder.textContent='درانتظارتایید';
                        
            break;
       case 'processing':statusOrder.textContent='درحال آماده سازی';
            break;
        case 'ready':statusOrder.textContent='آماده ارسال';
            break;
        case 'delivery':statusOrder.textContent='تحویل شد';
            break; 

       case 'canceled':statusOrder.textContent='لغو شده';
            break;
    }
   
totalPrice.textContent=result.totalPrice;

hideElement();
renderStepper(result.status);
    
console.log(result.status);

})


function toLatinDigits(str) {
    return String(str)
        .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
        .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
}

async function funcShowOrder(mobile,code){
    try{
        const response=await fetch(`/order/tracking/?mobile=${mobile}&code=${code}`,{
            method:'GET',  
        });
        const result = await response.json();
        if(response.ok) return result.data;
        else{
            showError.textContent='اطلاعات پیدا نشد';
            return;
        }
    }catch(e){showError.textContent='خطای ارتباطی';}
}



function hideElement(){
    document.querySelectorAll('.dl dd').forEach(dd=>{
        const isEmpty=dd.textContent.trim() === '';
        dd.style.display=isEmpty?'none':'';
        dd.previousElementSibling.style.display=isEmpty?'none':'';
    })
}










function renderStepper(status){
    const arr=['pending','processing','ready','delivery'];
    const indexCurrent=arr.indexOf(status);
    console.log(indexCurrent);
    

  
    document.querySelectorAll('.stepper label').forEach((element, i=0) => {
        element.classList.remove('currentStepp','col');
        
        const divWithClassLine = element.parentElement.nextElementSibling;

if (i === indexCurrent) {
        document.getElementById(status).classList.add('currentStepp','col');
        /*document.getElementById(status).style.borderRadius = '10px';
        document.getElementById(status).style.border = '2px dotted #4db129';
        document.getElementById(status).style.fontWeight='bold';*/
        
    }



        if (divWithClassLine?.classList.contains('line') && (i < indexCurrent)) {
            divWithClassLine.style.border = '2px solid #4db129';    

        }

        
        else
            divWithClassLine.style.border = '1px dashed #00000040';

        i++; 

    });

    

   
}