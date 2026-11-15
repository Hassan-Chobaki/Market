const btnProduct=document.getElementById('btnProduct');
const btnOrder=document.getElementById('btnOrder');
const btnCustomer=document.getElementById('btnCustomer');
const btnAnaliz=document.getElementById('btnAnaliz');
const btnReport = document.getElementById('btnReport');
const cardProduct=document.getElementById('cardProduct');
const cardNewProduct = document.getElementById('cardNewProduct');
const cardOrder=document.getElementById('cardOrder');
const cardSetup = document.getElementById('cardSetup');
const cardReport = document.getElementById('cardReport');
const cardAnaliz = document.getElementById('cardAnaliz');
const btnNewProduct=document.getElementById('btnNewProduct');
const btnAddPic=document.getElementById('btnAddPic');
const inpAddPic=document.getElementById('inpAddPic');
const btnBackProduct=document.getElementById('btnBackProduct');
const btnAddProduct=document.getElementById('btnAddProduct');
const dialogBox=document.getElementById('dialogBox');
const Msg=document.getElementById('msg');
const tbl=document.getElementById('tbl');
const tbody = document.querySelector('#tbl tbody');
const inpCodeProduct=document.getElementById('inpCodeProduct');
const inpNameProduct=document.getElementById('inpNameProduct');
const inpPriceProduct=document.getElementById('inpPriceProduct');
const inpQuantityProduct=document.getElementById('inpQuantityProduct');
const inpStatusProduct=document.getElementById('inpStatusProduct');
const divAddPic = document.getElementById('divAddPic');
const boxPicZoom = document.getElementById('box');
const btnSetup=document.getElementById('btnSetup');


const divInbox = document.getElementById('divInbox');
const divInboxDetail = document.getElementById('divInboxDetail');
const btnInboxOk = document.getElementById('btnInboxOk');



const selStatus = document.getElementById('selStatus');
const selStatusPay = document.getElementById('selStatusPay');
const selPayMethod = document.getElementById('selPayMethod');
const warnDetail = document.getElementById('warnDetail');
const btnSaveDetail = document.getElementById('btnSaveDetail');
const btnCancelDetail = document.getElementById('btnCancelDetail');

let currentOrder = null;
let ordersCache=[];
let arrInfoPic = Array();
let index = 0;
dialogBox.style.display='none';


const payName = { cash: 'حضوری', card: 'کارت به کارت', gateway: 'درگاه' };
const status = { pending: 'ثبت شد', processing: 'درحال پردازش', ready: 'آماده ارسال', delivery: 'تحویل شد', canceled: 'لغو' };
const statusPay = { paid: 'تسویه', notPaid: 'باز' };





function isValidNum(variable){
    const num=/^(0|[1-9])\d*$/ ;

    if(variable.trim()==='' || !num.test(variable.trim()))
        return false;
    else
        return true;        
}


function isValidPrice(variable){
    const num=/^(0|[1-9]\d*|)$/ ;

    if(!num.test(variable))
        return false;
    else
        return true;

}



document.addEventListener('DOMContentLoaded',async()=>{
    let res=await getDataOfOrder();
    if (res.status===401 && res.success===false && res.unauthorized===true)
    {
        alert('لطفا بانام مدیر لاگین کنید');
        return;
    }
    ordersCache=await res;
    showInbox(res);
       
});




/*********************************************************COMMON PICTURE */

async function commonPic(code){
    let index=0;
    const result=await getPicOfServer(code);
    const img = document.createElement('img');
    const next = document.createElement('div'); next.textContent = 'بعدی';
    const prev = document.createElement('div'); prev.textContent = 'قبلی';

    const span = document.createElement('span');
                                        span.style.background='black';
                                        span.style.color='white';
                                        span.style.fontWeight='bold';
                                        span.textContent = `[ ${result.length}/${index+1} ]`;
    const div = document.createElement('div');




    
   
    if(boxPicZoom.style.display==='flex'){
        boxPicZoom.style.display='none';
        boxPicZoom.innerHTML='';
        return;
    } else {
        boxPicZoom.style.display = 'flex';
        boxPicZoom.classList.add('box');
        div.style.display = 'flex';
    }
      
      
    
   



    img.src=result[index];
    boxPicZoom.innerHTML='';

    next.addEventListener('click',function(){
                                                index=(index+1)%result.length;
                                                img.src=result[index];
                                                span.textContent = `[  ${result.length}/${index + 1} ]`;
                                            });

    prev.addEventListener('click', function () {
                                                index = (index - 1 + result.length) % result.length;
                                                img.src = result[index];
                                                span.textContent = `[  ${result.length}/${index + 1} ]`;
                                            });   
                                            
 

next.classList.add('NPpic');
prev.classList.add('NPpic');
img.style.objectFit='contain';
img.classList.add('imgPic');



div.style.flexDirection='row';
div.appendChild(prev);
div.appendChild(img);
div.appendChild(next);


boxPicZoom.appendChild(div);
boxPicZoom.style.flexDirection='column';
boxPicZoom.appendChild(span);



}





/*************************************************************************/







cardReport.style.display='none';
cardOrder.style.display='none';
cardSetup.style.display='none';
divInbox.style.display='none';

let arrTrCode=new Array;




async function showInbox(ordersNotSeen){ 
    


if(await ordersNotSeen){
let i=0;
divInboxDetail.innerHTML='';
    divInbox.style.display='flex';





    ordersNotSeen.forEach((row)=>{


    if(row.isSeen===false){
        arrTrCode.push(row.trackingCode); i++;
        let lbl=document.createElement('label');
        lbl.innerHTML = ` ${i}| ${Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
        }).format(new Date(row.createdAt))} | <span class="inboxTrcode">${row.trackingCode}</span>  |  ${row.nameSender}`+'\n';
        if(row.statusPayment==='paid')
            lbl.style.borderRight='5px solid green';
        else
            lbl.style.borderRight = '5px solid red';

        divInboxDetail.appendChild(lbl);

        lbl.addEventListener('click',async()=>{
                                                divInbox.style.display='none';
                                                console.log(row.trackingCode); 
                                                await patchSeenOrder([row.trackingCode]);
                                                
                                                await openOrderDetail(row.trackingCode);});
       
        
    }//if


document.getElementById('spnTotalNotSeen').textContent=`تعداد سفارش های خوانده نشده: ${i}`;


    });



}//if



}








///////////////////////////////////////////////////////////////////////////////
//*********************************       EVENTs      ***************** */
//////////////////////////////////////////////////////////////////////////////



btnReport.addEventListener('click',()=>{showCardReport()});


btnInboxOk.addEventListener('click',async()=>{
    divInbox.style.display='none';
    if(arrTrCode.length>0)
     await patchSeenOrder(arrTrCode);
    
});



inpPriceProduct.addEventListener('input', () => {

    inpPriceProduct.value = inpPriceProduct.value
        .replace(/\D/g, '')                       // پاک کردن هر چیز غیر از رقم
        .replace(/\B(?=(\d{3})+(?!\d))/g, '٬');   // جدا کردن سه‌رقم‌سه‌رقم از آخر

})



const btnOccasionSave = document.getElementById('btnOccasionSave');
btnOccasionSave.addEventListener('click', async (e) => {

    e.preventDefault();
    let data = {
        name: document.getElementById('inpNameOccasion').value,
        date: document.getElementById('yearOccasion').value + '/' + document.getElementById('monthOccasion').value + '/' + document.getElementById('dayOccasion').value

    };

    const result = await saveOccasion(data);

    if (result.success === 'ok'){
        renderListDateOccasion(data);
        showMsg('ذخیره شد', true);
    }
    else if (result.success === 'fail')
        showMsg('خطای شبکه', false);
    else
        showMsg("تاریخ تکراری است  ⚠  برای این تاریخ مناسبتی ذخیره شده است", false);

});


const tbodyOccasion = document.querySelector('#tblOccasion tbody');

tbodyOccasion.addEventListener('click',async (e) => {

    const pressBtnDel = e.target.closest('.delete');
    let tr;
    let result;
    if (  pressBtnDel){
        tr=e.target.closest('tr');
        const YN =await confirm('آیا مناسبت حذف شود؟');
        if(YN)
           result=await deleteOccasion(pressBtnDel.dataset.date);
        else return;
    }
    else return;

    if(await result.success==='ok'){
        showMsg('مناسبت حذف شد',true);
       tr.innerHTML='';
    }
    else
        showMsg('خطای شبکه',false);

})




document.addEventListener('click',(e)=>{
            
                if ( ! e.target.closest('.NPpic') && boxPicZoom.style.display === 'flex')
                {
                  boxPicZoom.style.display = 'none';
                  //document.body.removeChild(boxPicZoom);
                }
});



//CLICK IN BUTTON EDIT OR DELETE IN TABLE PRODUCT
tbody.addEventListener('click',(e)=>{

    if(e.target.closest('.previewInTlb')){
        
        commonPic(e.target.dataset.code);
    }

    const icons=e.target.closest('.icon-wrap');
 
    if(!icons) return;

   const tr=e.target.closest('tr');

    if(icons.dataset.action==='edit'){ 
       
                                            const oldData={
                                                        name:icons.dataset.name,
                                                        code:icons.dataset.code,
                                                        price:icons.dataset.price,
                                                        quantity:icons.dataset.quantity,
                                                        status:icons.dataset.status

                                            }

                                            openFormEditProduct(oldData);
                                    }

    if(icons.dataset.action==='delete'){ 
                                        
                                        
                                        deleteProduct(icons.dataset.code,tr);
                                        
                                    }



       


    


  

})


//      **



//LOAD FIRST TIME FILL TABLE PRODUCT

document.addEventListener('DOMContentLoaded',async()=>{
   
    const Rows=await showTableProduct();

    

    let rowStatus='فعال';

    Rows.forEach(row => {
        const TR = document.createElement('tr');
        TR.style.color='black';
        let statusColor = '';

         switch (row.status) {

            case 'active': 
                            rowStatus = 'فعال';
                            statusColor='active'
                            break;
            case 'inactive': rowStatus = 'غیرفعال';
                            statusColor='inactive'
                break;
            case 'out_of_stock': rowStatus = 'ناموجود';
                            statusColor='outOfStock'
                break;
            case 'comin_soon': rowStatus = 'به زودی';
                break;
            case 'discontinue': rowStatus = 'متوقف شده';
                break;

        }
        
        TR.innerHTML = `<td> ${row.code} </td>
                        <td> ${row.name}</td>
                        <td> ${row.quantity}</td>
                        <td> ${Number(row.price).toLocaleString('fa-IR')}  تومان </td>
                        <td class='statusProduct ${statusColor}'> ${rowStatus}</td>
                        <td > <img style="cursor:pointer" data-action="zoom" data-code="${row.code}" id="zoom-${row.code}" class='previewInTlb' src="/product/image/${row.code}/thumb.webp"></td>


                        <td id='operation'>
                                <div style="display: flex; gap: 28px; justify-content: center;">
                                        <span class="icon-wrap"
                                                                 data-code="${row.code}" 
                                                                 data-name="${row.name}" 
                                                                 data-price="${row.price}" 
                                                                 data-quantity="${row.quantity}" 
                                                                 data-status="${row.status}"  
                                                                 
                                                                 data-action="edit" style="display: inline-flex; padding: 8px; cursor: pointer;">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        </span>
                                        <span class="icon-wrap delete-wrap" data-code="${row.code}" data-action="delete" style="display: inline-flex; padding: 8px; cursor: pointer;">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="overflow: visible;">
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                                <line x1="10" y1="11" x2="10" y2="17"/>
                                                <line x1="14" y1="11" x2="14" y2="17"/>
                                                <g class="trash-lid">
                                                    <path d="M3 6h18"/>
                                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                </g>
                                            </svg>
                                        </span>
                                    </div>                     
                        
                        </td>






                       
                        `;

        tbody.appendChild(TR);

        
    })//foreach



});
//      **



//CLICK IN BUTTON ADD NEW PRODUCT
btnAddProduct.addEventListener('click',async(e)=>{

    e.preventDefault();

   
const formData=new FormData();
    const priceClean = inpPriceProduct.value.replace(/[^\d]/g, '');

     data = {
        code:inpCodeProduct.value,
        name:inpNameProduct.value,
        price: Number(priceClean),
        quantity: Number(inpQuantityProduct.value),        
        status:inpStatusProduct.value

    }

if( analizForm(cardNewProduct)) return ;
if( ! isValidNum(inpQuantityProduct.value)){return showMsg('خطا-مقدار ورودی نامعتبر است',false); } ;
if (!isValidPrice(priceClean)) {return showMsg('خطا-مقدار ورودی نامعتبر است', false);  };


    formData.append('data', JSON.stringify(data));

    for(const arr of arrInfoPic)
        formData.append('images',arr.file);


const editOrAdd=btnAddProduct.textContent;   
let result;

   if(editOrAdd==='افزودن')
        result=await addProduct(formData);
    else
        result=await editProduct(formData);



  if(result.success){
        showMsg('باموفقیت ذخیره شد',true);
        clearCard(cardNewProduct);
      arrInfoPic = [];
      index = 0;
      divAddPic.innerHTML = '';
      btnAddPic.disabled = false;
  }
 else
    showMsg('ذخیره ناموفق بود',false);



});
//      **



                                                                    
//CLICK MENU



btnProduct.addEventListener('click',showCardProduct);
btnOrder.addEventListener('click',showCardOrder);
btnNewProduct.addEventListener('click',()=> { showCardNewProduct(false,{})});
btnAnaliz.addEventListener('click', showCardAnaliz);












//      **


//CLICK BUTTON ADD PICTURE IN CARD NEW PRODUCT (form input product)
btnAddPic.addEventListener('click',()=>{
                                        if(index<3){
                                            btnAddPic.disabled=false;                                             
                                            inpAddPic.click();
                                            btnAddPic.style.backgroundImage = ``;
                                            

                                        }
                                        else btnAddPic.disabled=true;
});
//      **



//CONTROL CLICK ON THE HIDE INPUT
inpAddPic.addEventListener('change',addPic);






//CLICK ON BUTTON BACK
btnBackProduct.addEventListener('click',()=>{
                                            clearCard(cardNewProduct);
                                            arrInfoPic = [];
                                            index = 0;
                                            divAddPic.innerHTML = '';
                                            btnAddPic.disabled = false;
                                            tbl.style.display='block';
                                            
                                            btnNewProduct.style.display='flex'; 
                                            cardNewProduct.style.display='none';                                           
                                        
});
//      **





//ANY TYPE IN INPUT SEARCH(ANY KEY DOWN orderPage)

document.getElementById('inpSearchOrder').addEventListener('input',(e)=>{

    const s=e.target.value.trim().toUpperCase();
    document.querySelectorAll('#tblOrders tbody tr').forEach(tr=>{
    
    tr.style.display=tr.textContent.includes(s)?'':'none';});
    

});





btnSetup.addEventListener('click',showCardSetup);




//////////////////////////////////////////////////////////////////////////////
//************************************************************************* */
//////////////////////////////////////////////////////////////////////////////









function addPic() {
    const file = inpAddPic.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const wrapper = document.createElement('div');
    wrapper.className = 'divPicAndName';

    const img = document.createElement('img');
    img.className = 'preview';
    img.src = url;

    const btnDel = document.createElement('button');
    btnDel.type = 'button';
    btnDel.className = 'btnDelPic';
    btnDel.textContent = 'ー';

    const info=document.createElement('span');
    info.textContent=(file.size > (1024 *1024)) ? ((file.size/(1024*1024)).toFixed(1)+'MB') : ((file.size/1024).toFixed(1)+'KB');
    

    btnDel.addEventListener('click', () => {
        wrapper.remove();
        arrInfoPic = arrInfoPic.filter(item => item.file !== file);
        index--;
        btnAddPic.disabled = false;
        
        btnAddPic.style.backgroundImage = `url(${URL.createObjectURL(arrInfoPic[0].file)})`;
        
    });

    wrapper.appendChild(info);
    wrapper.appendChild(img);
    wrapper.appendChild(btnDel);
    divAddPic.appendChild(wrapper);
   

    arrInfoPic.push({ file });divAddPic.style.width=(arrInfoPic.length*120)+'px';
    index++;

    if (index >= 3)
        btnAddPic.disabled = true;

    inpAddPic.value = '';
    btnAddPic.style.backgroundImage=`url(${URL.createObjectURL(arrInfoPic[0].file)})`;
}










/***************************************************************/
/***************************************************************/
/***************************************************************/






function showCardNewProduct(isEdit,oldData){
    tbl.style.display='none';
    cardNewProduct.style.display='flex';
    btnNewProduct.style.display='none';
    
    if(isEdit){
        document.getElementById('spanTitle').textContent='ویرایش اطلاعات محصول';
        btnAddProduct.textContent='ویرایش';
        inpCodeProduct.value=oldData.code;
        inpNameProduct.value=oldData.name;
        inpPriceProduct.value=oldData.price;
        inpQuantityProduct.value=oldData.quantity;
        inpStatusProduct.value=oldData.status;

        
    }
    else{
        document.getElementById('spanTitle').textContent = 'افزودن محصول جدید';
        btnAddProduct.textContent='افزودن';

    }



}


function showCardProduct(){
    
    cardProduct.style.display='flex';
    cardOrder.style.display='none';
    cardSetup.style.display='none';
    cardAnaliz.style.display='none';
    cardReport.style.display='none';


}

function showCardOrder() {    
    cardProduct.style.display = 'none';
    cardOrder.style.display = 'flex';
    cardSetup.style.display='none';
    cardAnaliz.style.display = 'none';
    cardReport.style.display='none';

    
showTableOrders();

}


const tblOccasion = document.getElementById('tblOccasion');
function renderListDateOccasion(row) {



    const tr = document.createElement('tr');
    const numRow=tblOccasion.rows.length+1;



    let dOld, d = row.date.split('/')[0];
    if (d !== dOld) {
        tr.style.backgroundColor = `hsl(${(d * 3) * 70}, 70%, 90%)`;
        dOld = d;
    }


    tr.innerHTML = `<td>${numRow-1 }</td> 
                                          <td> ${row.name}</td> 
                                          <td> ${row.date}</td>
                                          <td>
                                    <div>      
                                                <span class="delete" data-date="${row.date}" data-action="delete" style="display: inline-flex; padding: 8px; cursor: pointer;">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="overflow: visible;">
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                                <line x1="10" y1="11" x2="10" y2="17"/>
                                                <line x1="14" y1="11" x2="14" y2="17"/>
                                                <g class="trash-lid">
                                                    <path d="M3 6h18"/>
                                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                          
                                          </td>
                                          ` ;

    tbodyOccasion.appendChild(tr);


}


async function showCardSetup() {
   




    cardSetup.style.display = 'flex';
    cardOrder.style.display = 'none';
    cardProduct.style.display = 'none';
    cardAnaliz.style.display = 'none';
    cardReport.style.display='none';

    const year=document.getElementById('yearOccasion');
    const month = document.getElementById('monthOccasion');
    const day = document.getElementById('dayOccasion');


year.innerHTML='';
month.innerHTML='';
day.innerHTML='';



    for(let i=1;i<=31;i++)
    {
        let optionDay=document.createElement('option');
        
        if(i<10)optionDay.textContent='0'+i;
        else    optionDay.textContent=i;
       day.appendChild(optionDay) ;

       optionDay.value=optionDay.textContent;

    }

    for(let i=1;i<=12;i++)
    {

        let optionMonth = document.createElement('option');
        if(i<10) optionMonth.textContent='0'+i;
        else optionMonth.textContent=i;
       month.appendChild(optionMonth);

       optionMonth.value=optionMonth.textContent;
    }
    
    

    for(let i=1;i<=21;i++)
    {       
     let optionYear = document.createElement('option');     
       optionYear.textContent=(i)+1404;
       year.appendChild(optionYear);

    }

    
    const data=await getListOccasion();

    if(data.success==='disconnected')
    {
        showMsg(' خطای اتصال.⚠اتصال شما بشکل غیرمنتظره ای قطع شد',false);
        return 0;
    }
    else if(!data){
        showMsg('اطلاعات برای نمایش یافت نشد⚠',false);
        return 0;
    }
   

    tbodyOccasion.innerHTML='';
    
    data.forEach((row) => {        
        
    renderListDateOccasion(row);                       
                    
     })
    

    

}

function showCardAnaliz(){
    cardAnaliz.style.display = 'flex';
    cardSetup.style.display = 'none';
    cardOrder.style.display = 'none';
    cardProduct.style.display = 'none';  
    cardReport.style.display='none' ;
}
const btnShowPicReceipt=document.getElementById('btnShowReceipt');
btnShowPicReceipt.addEventListener('click', (e) => {
   
    e.preventDefault();
    analiz();
})



let timerMsg=null;
function showMsg(msg,col){
    if(col)
        dialogBox.style.backgroundColor='#9aebc4be';
    else
        dialogBox.style.backgroundColor = '#eba19abe';

    dialogBox.style.display='flex';
    Msg.textContent=msg;
    if(timerMsg)
        clearTimeout(timerMsg);
    timerMsg=setTimeout(hideMsg,5000);
    
}


function hideMsg(){
    dialogBox.style.display='none';
    if(timerMsg)
        clearTimeout(timerMsg);
    timerMsg=null;

}

setTimeout(hideMsg, 2000);
document.addEventListener('click',hideMsg);






function clearCard(cardName){
    const element=cardName.querySelectorAll('input , select , textarea ,img,button');

    element.forEach(el => {
            if(el.type==='checkbox' || el.type==='radio')
                el.checked=false;
            else if(el.tagName==='SELECT')
                el.selectedIndex=0;
            else if(el.tagName==='IMG')
                el.remove();
            else if (el.tagName === 'BUTTON' && el.textContent ==='ー')
                el.remove();
            else
                el.value='';
        
    });
}



function confirm(msg){
    

   return new Promise( (resolve)=>{
   
            const overlay=document.getElementById('overlay');
            const confirmCard=document.getElementById('cardConfirm');
            const yes=document.getElementById('yes');
            const no=document.getElementById('no');
            const Msg=document.getElementById('Msg');

            Msg.textContent=msg;

            overlay.style.display='flex';
            confirmCard.style.display='flex';
            
                                                            function closeTow(result){
                                                                overlay.style.display='none';
                                                                confirmCard.style.display='none';
                                                            resolve(result);
                                                            }
                                                        


                no.addEventListener('click',()=>closeTow(false),{once:true});

                yes.addEventListener('click',()=>closeTow(true),{once:true});

           });//return
        
}




function openFormEditProduct(oldData){  
    const isEdit=true;
    showCardNewProduct(isEdit,oldData);


    
}


async function deleteProduct(code,tr){
    let msgResult;

    const ok=await confirm('آیا از حذف اطمینان دارید؟');
    if( ! ok)
        return;


       msgResult=await delProduct('product',code);

    if(Number(msgResult.count)>0){
       showMsg('باموفقیت حذف شد',true);
       tr.innerHTML='';
    }
    else
        showMsg('خطای شبکه',false);
}


function analizForm(inputsOfCard){  /*ارتباطی به منوی آنالیزندارد این تابع وظیفه انالیز فرمهارو دارد.اینپوتها ینی ورودیها فرمهاچک میشن*/

    const elements=inputsOfCard.querySelectorAll('input:not([type="file"]');
    let done=false;

    elements.forEach(input=>{

            if(input.value==='')
            {
                
                input.classList.add('Error');
                
                
                done=true;

            }


            input.addEventListener('input',()=>{
                                                input.classList.remove('Error');
                                                input.classList.add('correct');
                                            })

    });


    return done;


}

//************************************************************************************************ */





async function showTableOrders() {
    ordersCache = await getDataOfOrder();
    renderOrdersFromCache();
}



function renderOrdersFromCache() {
    const table = document.querySelector('#tblOrders table');
    const tbodyOrders = table.querySelector('tbody');
    tbodyOrders.replaceChildren();
    const label = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    
    

    ordersCache.forEach((row, numRow) => {
        const tr = document.createElement('tr');

        [
            numRow + 1,
            row.trackingCode,
            row.nameSender,
            status[row.status],
            payName[row.paymentMethod] ?? '-',
            statusPay[row.statusPayment],
            row.dateDelivery?.slice(0, 10),
            ''
        ].forEach((value, i) => {
            //row.isSeen = row.isSeen === false ? true : row.isSeen;
            const td = document.createElement('td');
            td.setAttribute('data-title', label[i] || '');
            td.textContent = value ?? '';

            if (label[i] === 'کدپیگیری') td.classList.add('latinTrcode');

            if (label[i] === 'جزئیات') {
                const span = document.createElement('span');
                span.className = 'spnDetail';
                span.textContent = 'جزئیات';
                span.dataset.id = row.trackingCode;
                td.replaceChildren(span);
            }

            if (row.status === 'canceled') td.classList.add('classCancel');
            if (row.status === 'delivery') td.classList.add('classDelivered');
            tr.appendChild(td);
        });

        tbodyOrders.appendChild(tr);
    });
}










document.getElementById('tblOrders').addEventListener('click', (e) => {
    const btn = e.target.closest('.spnDetail');
    if (!btn) return;
    openOrderDetail(btn.dataset.id);   // کدپیگیری
});


const overlayDetail = document.getElementById('overlayDetail');
const detailBody = document.getElementById('detailBody');


async function openOrderDetail(trackingCode) {
    const data = ordersCache.find(o => o.trackingCode === trackingCode);

    overlayDetail.classList.add('show');
    detailBody.replaceChildren();

    if (!data) {
        detailBody.textContent = 'اطلاعاتی یافت نشد';
        return;
    }

    const fields = [
        ['کدپیگیری', data.trackingCode],
        ['فرستنده', data.nameSender],
        ['موبایل فرستنده', data.mobileSender],
        ['گیرنده', data.nameReciver],
        ['موبایل گیرنده', data.mobileReciver],
        ['شهر', data.city],
        ['آدرس', data.address],
        ['زمان تحویل', `${data.timeOf?.slice(0, 5) ?? ''} - ${data.timeTo?.slice(0, 5) ?? ''}`],
        ['مبلغ کل', Number(data.totalPrice).toLocaleString('fa-IR') + ' تومان'],
        ['یادداشت', data.note],
        ['توضیحات', data.comment],
    ];

    fields.forEach(([title, value]) => {
        const row = document.createElement('div');
        row.className = 'rowDetail';
        const b = document.createElement('b');
        b.textContent = title;
        const s = document.createElement('span');
        s.textContent = value || '-';
        row.append(b, s);
        detailBody.appendChild(row);
        
        if(title==='مبلغ کل')
            s.classList.add('classFontBold');
    });
    currentOrder = data;
    selStatus.value = data.status ?? 'pending';
    selStatusPay.value = data.statusPayment ?? 'notPaid';
    selPayMethod.value = data.paymentMethod ?? 'cash';




    refreshEditState();




    // اقلام سفارش
    let itemsOfOrders = [];
    try {
        itemsOfOrders = await getDetailsOfOrder(trackingCode);
    } catch (e) {
        itemsOfOrders = [];
    }

    // اگر در این فاصله کارت دیگری باز شده، رها کن
    if (!currentOrder || String(currentOrder.trackingCode) !== String(trackingCode)) return;

    const titleRow = document.createElement('div');
    titleRow.className = 'rowDetail';
    const t = document.createElement('b');
    t.textContent = 'اقلام سفارش';
    titleRow.appendChild(t);
    detailBody.appendChild(titleRow);

    if (!Array.isArray(itemsOfOrders) || itemsOfOrders.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'rowDetail';
        empty.textContent = 'قلمی ثبت نشده است';
        detailBody.appendChild(empty);
        return;
    }

    itemsOfOrders.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'rowDetail';

        const nameEl = document.createElement('span');
        nameEl.textContent = item.name ?? item.codeProduct;

        const qtyEl = document.createElement('span');
        qtyEl.textContent = item.quantity + ' عدد';

        itemRow.append(nameEl, qtyEl);
        detailBody.appendChild(itemRow);
    });
}















function closeOrderDetail() {
    overlayDetail.classList.remove('show');
}

document.getElementById('btnCloseDetail').addEventListener('click', closeOrderDetail);
overlayDetail.addEventListener('click', (e) => {
    if (e.target === overlayDetail) closeOrderDetail();   // کلیک روی پس‌زمینه
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOrderDetail();
});





function getChanges() {
    if (!currentOrder) return {};
    const changes = {};
    if (selStatus.value !== (currentOrder.status ?? 'pending')) changes.status = selStatus.value;
    if (selStatusPay.value !== (currentOrder.statusPayment ?? 'notPaid')) changes.statusPayment = selStatusPay.value;
    if (selPayMethod.value !== (currentOrder.paymentMethod ?? 'cash')) changes.paymentMethod = selPayMethod.value;
    return changes;
}

function refreshEditState() {
    const changes = getChanges();

    selStatus.classList.toggle('changed', 'status' in changes);
    selStatusPay.classList.toggle('changed', 'statusPayment' in changes);
    selPayMethod.classList.toggle('changed', 'paymentMethod' in changes);

    btnSaveDetail.disabled = Object.keys(changes).length === 0;

    if (selStatus.value === 'delivery' && selStatusPay.value === 'notPaid') {
        warnDetail.textContent = '⚠ سفارش «تحویل شد» است ولی پرداخت هنوز «باز» است.';
        warnDetail.classList.add('show');
    } else if (selStatus.value === 'canceled') {
        warnDetail.textContent = '⚠ با ذخیره، سفارش لغو می‌شود.';
        warnDetail.classList.add('show');
    } else {
        warnDetail.classList.remove('show');
    }
}

[selStatus, selStatusPay, selPayMethod].forEach(el => el.addEventListener('change', refreshEditState));
btnCancelDetail.addEventListener('click', closeOrderDetail);






btnSaveDetail.addEventListener('click', async () => {
    const changes = getChanges();
    if (Object.keys(changes).length === 0) return;

    if (changes.status === 'canceled') {
        const ok = await confirm('سفارش لغو شود؟');
        if (!ok) return;
    }

    btnSaveDetail.disabled = true;

    try {
        const result = await updateOrder(currentOrder.trackingCode, changes);

        if (result.success !== 'ok') {
            showMsg(result.error || 'ذخیره انجام نشد', false);
            refreshEditState();
            return;
        }

        Object.assign(currentOrder, changes);
        showMsg('ذخیره شد', true);
        closeOrderDetail();
        renderOrdersFromCache();
    } catch (err) {
        console.error(err);
        showMsg('ارتباط با سرور برقرار نشد', false);
        refreshEditState();
    } finally {
        btnSaveDetail.disabled = false;
    }
});

/***********************************************        ANALIZ  *******************************************/
let endDay = 31;
const dayReceiptFrom = document.getElementById('dayReceiptFrom');
const monthReceiptFrom = document.getElementById('monthReceiptFrom');
const yearReceiptFrom = document.getElementById('yearReceiptFrom');

const dayReceiptTo = document.getElementById('dayReceiptTo');
const monthReceiptTo = document.getElementById('monthReceiptTo');
const yearReceiptTo = document.getElementById('yearReceiptTo');
monthReceiptFrom.addEventListener('change', () => { if ((monthReceiptFrom.value > 6)&&(dayReceiptFrom.options.length>=30)) dayReceiptFrom.remove(dayReceiptFrom.options.length-1); else dayReceiptFrom.options.add(new Option(31)); });
monthReceiptTo.addEventListener('change', () => { if ((monthReceiptTo.value > 6) && (dayReceiptTo.options.length >= 30)) dayReceiptTo.remove(dayReceiptTo.options.length - 1); else dayReceiptTo.options.add(new Option(31)); })
const nameMonth=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
    let temp='';
for (let i = 1; i <= endDay; i++) {
   if(i<10) temp='0'+i;
   else temp=i;
    dayReceiptFrom.innerHTML += `<option value=${temp}>${temp}</option>`;
    dayReceiptTo.innerHTML += `<option value=${temp}>${temp}</option>`;
}
for (i = 1; i <= 12; i++) {
    if(i<10) temp='0'+i;
    else temp=i
    monthReceiptFrom.innerHTML += `<option value=${temp}> ${temp} - ${nameMonth[i-1]}</option>`;
    monthReceiptTo.innerHTML += `<option value=${temp}>${temp} - ${nameMonth[i-1]}</option>`;
}
for (i = 1405; i <= 1420; i++) {
    yearReceiptFrom.innerHTML += `<option value=${i}> ${i}</option>`;
    yearReceiptTo.innerHTML += `<option value=${i}>${i}</option>`;
}


const cardReceipt = document.getElementById('receipt');
const oldInnerHtml=cardReceipt.innerHTML;
const resultShow=document.getElementById('resultShow');
async function analiz(){


const dateFrom=document.getElementById('yearReceiptFrom').value+'/'+
                document.getElementById('monthReceiptFrom').value+'/'+
                document.getElementById('dayReceiptFrom').value;

const dateTo=document.getElementById('yearReceiptTo').value+'/'+
             document.getElementById('monthReceiptTo').value+'/'+
             document.getElementById('dayReceiptTo').value;
    

resultShow.innerHTML ='';
    const radioSelect = document.querySelector('input[name="pay"]:checked');
    const methodPay = radioSelect ? radioSelect.value : 'cash';

    
    const data = await getReceiptInfo(dateFrom, dateTo, methodPay); console.log('unauthorized:', data.unauthorized); console.log('data:', data);
    if (data.unauthorized) {
        let left = 5;
        showMsg(`لطفا دوباره وارد شوید | رفتن به صفحه ورود: ${left.toLocaleString('fa-IR')}`, false);

        const timer = setInterval(() => {
            left--;
            if (left <= -1) {
                clearInterval(timer);
                window.location.href = '/admin/login.html';
                return;
            }
            showMsg(`لطفا دوباره وارد شوید | رفتن به صفحه ورود: ${left.toLocaleString('fa-IR')}`, false);
        }, 1000);

        return;
    }

    if(!data.success && data.rows.length === 0){ return showMsg(' موردی پیدانشد',false);}
   
    cardReceipt.classList.add('CR');

data.rows.forEach((row,i)=>{    
    
    let r=document.createElement('span');
    let n=document.createElement('span');
    let t=document.createElement('span');
    let m=document.createElement('span');
    let p=document.createElement('span');
    let btn=document.createElement('button');
     
     r.textContent=`${i+1}`;
     n.textContent=` نام : ${row.nameSender} |`;
     m.textContent=` مبایل :${row.mobileSender} |`;
     t.textContent=` کدپیگیری :${row.trackingCode} |`;
     p.innerHTML=`مبلغ کل :${Intl.NumberFormat('fa-IR').format(row.totalPrice)}  <span style="font-size=10px">تومان</span>|`;

     let hr=document.createElement('hr'); hr.style.border='1px solid silver'; hr.style.width='90%';

    r.style.border='1px solid black'; r.style.borderRadius='10px';r.style.padding='0px 10px' ;
    btn.textContent='مشاهده';btn.style.padding='0';btn.style.height='fit-content';btn.dataset.data=row.trackingCode;



    btn.addEventListener('click',async function () {
        const trackingCode = this.dataset.data;
        await showCardReceipt(trackingCode);
    });

    if(methodPay!=='card') btn.disabled=true;
    else btn.disabled=false;
    
    resultShow.append(r,n,m,t,p,btn,hr);resultShow.style.fontSize='12px';
    
})
}

async function showCardReceipt(trackingCode){
    
    const filePicOfReceipt=await getImageReceipt(trackingCode);
if(!filePicOfReceipt.success){
    if(filePicOfReceipt.e === 'none')  showMsg('این کاربر رسیدی ندارد',false);
    if (filePicOfReceipt.e === 'empty') return showMsg('پوشه رسید کاربر خالی است', false);
    if (filePicOfReceipt.e === 'faile') return showMsg('خطای ارتباطی ازسمت سرور', false);
}

    const address=filePicOfReceipt.url;


const cardImage=document.getElementById('receiptView');
const imgImage=document.getElementById('receiptPic');

imgImage.onload=()=>URL.revokeObjectURL(address);
imgImage.src=address;

cardImage.classList.add('show');

    cardImage.addEventListener('click', () => {
        cardImage.classList.remove('show');
        URL.revokeObjectURL(imgImage.src);   // آزاد کردن حافظه
        cardImage.removeAttribute('src');
    });
    
}



async function showCardReport(){
    cardReport.style.display='flex';
    cardProduct.style.display='none';
    cardOrder.style.display='none';
    cardSetup.style.display='none';
    cardAnaliz.style.display='none';
    
    
}

async function renderOrdersReport( rows){
    const tblReport=document.getElementById('tbodyTblReport');
    document.getElementById('tbodyTblReport').innerHTML='';console.log('rows:',rows);

    if( rows.success===false){
        const tr=document.createElement('tr');
        tr.innerHTML=`<td colspan="7" style="text-align:center">موردی یافت نشد</td>`;
        tblReport.appendChild(tr);
        return;
    }
let sp,s;let pm;
   await rows.forEach((row,i)=>{

    switch(row.statusPayment){
        case 'paid': sp='پرداخت شده';  break;
        case 'notPaid':sp='پرداخت نشده';break;
        case null:sp='ناتمام';break;
    }


switch(row.status){
    case 'pending':s='ثبت شد';
    break;

    case 'proccessing':s='درانتظارتایید';
        break;

    case 'ready':s='آماده';
        break;

    case 'delivery':s='تحویل شده';
        break;

    case 'canceled':s='لغوشده';
        break;

    case null:s='ناتمام'    ;
        break;
}

switch(row.paymentMethod){
    case 'cash':pm= 'حضوری';
    break;

    case 'card':pm= 'کارت به کارت';
    break;

    case 'gateway':pm= 'درگاه پرداخت';
    break;

    case null:pm='ناتمام';
    break;
}



        const tr=document.createElement('tr');
        let dt=Intl.DateTimeFormat('fa-IR').format(new Date(row.dateDelivery));
        
        tr.innerHTML =`<td>${i+1}</td> 
                                    <td>${row.trackingCode}</td> 
                                    <td>${row.nameSender}</td> 
                                    <td>${s}</td> 
                                    <td>${sp}</td> 
                                    <td>${pm}</td> 
                                    <td>${dt}</td>`;
        tblReport.appendChild(tr);
    })

}


function removeActiveClass(){
    document.querySelectorAll('#divButton Button').forEach(bt=>bt.classList.remove('classActiveBtn'));
}

const btnReportNewOrder=document.getElementById('btnReportNewOrder');// NEW
btnReportNewOrder.addEventListener('click',async(ev)=>{
    ev.preventDefault();
    btnReportNewOrder.disabled=true;
    removeActiveClass();
    btnReportNewOrder.classList.add('classActiveBtn');

const resultOfFetch=await getReportOrders('new');
if(!resultOfFetch) return alert('not found');

renderOrdersReport(resultOfFetch);
btnReportNewOrder.disabled=false;
document.getElementById('spnReportTitleDetail').textContent=' پنج سفارش دریافتی اخیر ';
})




const btnReportPaidOrder=document.getElementById('btnReportPaid');//Paid
btnReportPaidOrder.addEventListener('click',async(ev)=>{
    ev.preventDefault();
    btnReportPaidOrder.disabled=true;
    removeActiveClass();
    btnReportPaidOrder.classList.add('classActiveBtn');

const resultOfFetch=await getReportOrders('paid');
if(!resultOfFetch)
    return alert('paid');

renderOrdersReport(await resultOfFetch);
btnReportPaidOrder.disabled=false;
    document.getElementById('spnReportTitleDetail').textContent = '(تسویه) سفارشاتی که عملیات پرداخت را تکمیل کرده اند ';

});



const btnReportNotPaid=document.getElementById('btnReportNotPaid');//Not PAID
btnReportNotPaid.addEventListener('click',async(ev)=>{
    ev.preventDefault();
    btnReportNotPaid.disabled=true;
    removeActiveClass();
    btnReportNotPaid.classList.add('classActiveBtn');

const resultToFetch=await getReportOrders('notPaid');


if(!resultToFetch) return alert('not npaid');


renderOrdersReport(resultToFetch);
    btnReportNotPaid.disabled = false;
    document.getElementById('spnReportTitleDetail').style.whiteSpace='pre-line';
    document.getElementById('spnReportTitleDetail').textContent = 'ناتمام=سفارشهایی که فقط ثبت سفارش کرده اند ومرحله پرداخت را انجام نداده اند \n(باز) سفارشاتی که هنوز پرداختی انجام نداده اند ';

});


const btnReportLessDate = document.getElementById('btnReportLessDate');//Less Date
btnReportLessDate.addEventListener('click',async(ev)=>{
    ev.preventDefault();
    btnReportLessDate.disabled=true;
    removeActiveClass();
    btnReportLessDate.classList.add('classActiveBtn');

const resultToFetch=await getReportOrders('fast');
if(!resultToFetch) alert('مذیقه');

renderOrdersReport(resultToFetch);
btnReportLessDate.disabled=false;
    document.getElementById('spnReportTitleDetail').textContent = ' سفارشهایی فوری.سفارشهایی که کمترین زمان تحویل دارند ';
});





/********************************************* V  I  S  I  T  */


function visit(){
    const divVisit=document.getElementById('divVisit');
    const dataOfVisit=getDaraOfVisit();
}
