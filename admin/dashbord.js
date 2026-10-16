const btnProduct=document.getElementById('btnProduct');
const btnOrder=document.getElementById('btnOrder');
const btnCustomer=document.getElementById('btnCustomer');
const btnAnaliz=document.getElementById('btnAnaliz');
const cardProduct=document.getElementById('cardProduct');
const cardNewProduct = document.getElementById('cardNewProduct');
const cardOrder=document.getElementById('cardOrder');
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
const cardSetup=document.getElementById('cardSetup');




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



let arrInfoPic = Array();
let index = 0;
dialogBox.style.display='none';





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








cardOrder.style.display='none';
cardSetup.style.display='none';








///////////////////////////////////////////////////////////////////////////////
//*********************************       EVENTs      ***************** */
//////////////////////////////////////////////////////////////////////////////



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

})










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
                  document.body.removeChild(boxPicZoom);
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
                        <td > <img style="cursor:pointer" data-action="zoom" data-code=${row.code} id='zoom-{row.code}' class='previewInTlb' src='/product/image/${row.code}/thumb.webp'">


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


     data = {
        code:inpCodeProduct.value,
        name:inpNameProduct.value,
        price: Number(inpPriceProduct.value),
        quantity: Number(inpQuantityProduct.value),        
        status:inpStatusProduct.value

    }

if( analizForm(cardNewProduct)) return ;
if( ! isValidNum(inpQuantityProduct.value)){showMsg('خطا-مقدار ورودی نامعتبر است',false); return} ;
if (!isValidPrice(inpPriceProduct.value)) { showMsg('خطا-مقدار ورودی نامعتبر است', false); return };


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

    const s=e.target.value.trim();
    document.querySelectorAll('#tblOrders table > tr').forEach(tr=>{
    
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


}

function showCardOrder() {    
    cardProduct.style.display = 'none';
    cardOrder.style.display = 'flex';
    cardSetup.style.display='none';

    
showTableOrders();

}


const tblOccasion = document.getElementById('tblOccasion');
function renderListDateOccasion(row) {



    const tr = document.createElement('tr');
    const numRow=tblOccasion.rows.length+1;

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
    
    data.forEach((row)=>{renderListDateOccasion(row);                       
                    
     })
    

    

}





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


function analizForm(inputsOfCard){

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

async function showTableOrders(){
    const result=await getDataOfOrder();
    const table=document.querySelector('#tblOrders table');
    const label=Array.from(table.querySelectorAll('thead th')).map(nameTitel=>nameTitel.textContent.trim());
let i=0;
result.forEach((row,numRow)=>{ 


                        let tr=document.createElement('tr');
                        
        [
            numRow + 1,
            row.nameSender,
            row.mobileSender,
            row.telSender,
            row.nameReciver,
            row.mobileReciver,
            row.telReciver,
            row.dateDelivery?.slice(0, 10),
            row.timeOf?.slice(0, 5),
            row.timeTo?.slice(0, 5),
            row.note,
            row.address,
            row.comment].forEach((value,i)=>{
                            const td=document.createElement('td');
                            td.setAttribute('data-title',label[i]||'');
                            td.textContent=value??'';
                            tr.appendChild(td);
                        })



                        


table.appendChild(tr);






});
}





