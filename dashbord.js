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





let arrInfoPic = Array();
let index = 0;
dialogBox.style.display='none';


///////////////////////////////////////////////////////////////////////////////
//*********************************       EVENTs      ***************** */
//////////////////////////////////////////////////////////////////////////////


//CLICK IN BUTTON EDIT OR DELETE IN TABLE PRODUCT
tbody.addEventListener('click',(e)=>{

    const icons=e.target.closest('.icon-wrap');

    if(!icons) return;
console.log(icons,'icons.datsset.name=',icons.dataset.name);
    if(icons.dataset.action==='edit'){ 
                                            const oldData={
                                                        name:icons.dataset.name,
                                                        code:icons.dataset.code,
                                                        price:icons.dataset.price,
                                                        quantity:icons.dataset.quantity,
                                                        status:icons.dataset.status

                                            }

                                            editProduct(oldData);
                                    }

    if(icons.dataset.action==='delete') deleteProduct(icons.dataset.code)


  

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
                        <td> <img class='previewInTlb' src='/product/image/${row.code}/thumb.webp' >


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



    })



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


        formData.append('data', JSON.stringify(data));

    for(const arr of arrInfoPic)
        formData.append('images',arr.file);


const editOrAdd=btnAddProduct.value;   
let result;

   if(editOrAdd.normalize(NFC).trim()==='افزودن')
        result=await addProduct(formData);
    else
        result=await editProduct(formData);



  if(result.success){
        showMsg('باموفقیت ذخیره شد',true);
        clearCard(cardNewProduct);
        arrInfoPic=[];
  }
 else
    showMsg('ذخیره ناموفق بود',false);



});
//      **

                                                                    
//CLICK MENU
btnProduct.addEventListener('click',showCardProduct);
btnOrder.addEventListener('click',showCardOrder);
btnNewProduct.addEventListener('click',showCardNewProduct);
//      **


//CLICK BUTTON ADD PICTURE IN CARD NEW PRODUCT (form input product)
btnAddPic.addEventListener('click',()=>{
                                        if(index<3){
                                            btnAddPic.disabled=false;                                             
                                            inpAddPic.click();

                                        }
                                        else btnAddPic.disabled=true;
});
//      **



//CONTROL CLICK ON THE HIDE INPUT
inpAddPic.addEventListener('change',addpic);






//CLICK ON BUTTON BACK
btnBackProduct.addEventListener('click',()=>{
                                            clearCard(cardNewProduct);
                                            arrInfoPic=[];
                                            tbl.style.display='block';
                                            
                                            btnNewProduct.style.display='flex'; 
                                            cardNewProduct.style.display='none';                                           
                                        
});
//      **


//////////////////////////////////////////////////////////////////////////////
//************************************************************************* */
//////////////////////////////////////////////////////////////////////////////



function addpic(){
    
    if(arrInfoPic.length>=3){
        btnAddPic.disabled=true;
        return;
    }
    else btnAddPic.disabled=false;

const file=inpAddPic.files[0];
  let nextImg=document.createElement('img');
                                                
  let divBoxPic=document.createElement('div');
  const spanNamePic = document.createElement('span');
  const btnDelPic=document.createElement('button'); btnDelPic.type='button'; btnDelPic.dataset.index=index;
  spanNamePic.textContent=file.name;
  btnDelPic.classList.add('btnDelPic');
    btnDelPic.textContent ='ー';
    


  divBoxPic.appendChild(nextImg);
  divBoxPic.appendChild(spanNamePic);
  divBoxPic.appendChild(btnDelPic);

    nextImg.classList.add('preview');
    divBoxPic.classList.add('divPicAndName');
   
    nextImg.src=URL.createObjectURL(file);
    document.getElementById('divAddPic').appendChild(divBoxPic);    
    arrInfoPic.push({file:file,name:file.name,size:file.size});

    const btnImage=URL.createObjectURL(arrInfoPic[0].file);
    btnAddPic.style.backgroundImage = `url("${btnImage}")`;

    
   btnDelPic.addEventListener('click',()=>{

                                                    const i=Number(btnDelPic.dataset.index);
                                                    arrInfoPic.splice(i,1);
                                                    nextImg.remove();
                                                    btnDelPic.remove();
                                                    spanNamePic.remove();
                                                    index=arrInfoPic.length;
                                                    if(arrInfoPic.length<3) btnAddPic.disabled=false;
                                                    if(i===0){btnAddPic.style.backgroundImage=`url("${arrInfoPic[0].file}")`;}
                                                
                                                        inpAddPic.value='';

   });



   inpAddPic.value='' ;
   index++;
    if (index > 3) btnAddPic.disabled = true;

    
}

function showCardNewProduct(typeUse,oldData){
    tbl.style.display='none';
    cardNewProduct.style.display='flex';
    btnNewProduct.style.display='none';
    if(oldData){
        document.getElementById('spanTitle').textContent=typeUse.spanTitle;
        btnAddProduct.textContent='ویرایش';
        inpCodeProduct.value=oldData.code;
        inpNameProduct.value=oldData.name;
        inpPriceProduct.value=oldData.price;
        inpQuantityProduct.value=oldData.quantity;
        inpStatusProduct.value=oldData.status;

        console.log(oldData);
    }
    else{
        document.getElementById('spanTitle').textContent = 'افزودن محصول جدید';
        btnAddProduct.textContent='افزودن';
    }




}


function showCardProduct(){
    cardProduct.style.display='flex';
    cardOrder.style.display='none';

}

function showCardOrder() {
    cardProduct.style.display = 'none';
    cardOrder.style.display = 'flex';

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

    console.log('omad to confirm');

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




function editProduct(oldData){
    let typeUse={spanTitle:'edit',button:'editNow',msg:'edit shod'};
    
    showCardNewProduct(typeUse,oldData);


    
}


async function deleteProduct(code){
    let msgResult;

    const ok=await confirm('آیا از حذف اطمینان دارید؟');
    if( ! ok)
        return;


       msgResult=await delProduct('product',code);

    if(Number(msgResult.count)>0)
       showMsg('باموفقیت حذف شد',true);
    else
        showMsg('خطای شبکه',false);
}
