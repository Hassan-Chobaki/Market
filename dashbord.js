const btnProduct=document.getElementById('btnProduct');
const btnOrder=document.getElementById('btnOrder');
const btnCustomer=document.getElementById('btnCustomer');
const btnAnaliz=document.getElementById('btnAnaliz');
const cardProduct=document.getElementById('cardProduct');
const cardOrder=document.getElementById('cardOrder');
const btnNewProduct=document.getElementById('btnNewProduct');
const btnAddPic=document.getElementById('btnAddPic');
const inpAddPic=document.getElementById('inpAddPic');
const btnBackProduct=document.getElementById('btnBackProduct');
const btnAddProduct=document.getElementById('btnAddProduct');





let arrInfoPic = Array();
let index = 0;






///////////////////////////////////////////////////////////////////////////////
//*********************************       EVENTs      ***************** */
//////////////////////////////////////////////////////////////////////////////


btnAddProduct.addEventListener('click',async()=>{

   
const formData=new FormData();


     data = {
        name: document.getElementById('inpNameProduct').value,
        price: Number(document.getElementById('inpPriceProduct').value),
        quantity: Number(document.getElementById('inpQuantityProduct').value),
        code: Number(document.getElementById('inpCodeProduct').value),
        status:document.getElementById('inpStatusProduct').value

    }


        formData.append('data', JSON.stringify(data));

    for(const arr of arrInfoPic)
        formData.append('images',arr.file);
    
   

const result=await addProduct(formData);


  if(result || result.success)
    alert('موفق شدیم');
 else
    alert('ناااااموفق');


console.log('success==',result.success);
});
                                                                    

btnProduct.addEventListener('click',showCardProduct);
btnOrder.addEventListener('click',showCardOrder);
btnNewProduct.addEventListener('click',showCardNewProduct);
btnAddPic.addEventListener('click',()=>{
                                        if(index<3){
                                            btnAddPic.disabled=false;                                             
                                            inpAddPic.click();

                                        }
                                        else btnAddPic.disabled=true;
                                    });




inpAddPic.addEventListener('change',addpic);


btnBackProduct.addEventListener('click',()=>{
                                            document.getElementById('cardNewProduct').style.display='none';
                                            btnNewProduct.style.display='flex';
                                        
                                        });


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

function showCardNewProduct(){
    const cardNewProduct=document.getElementById('cardNewProduct');
    cardNewProduct.style.display='flex';
    btnNewProduct.style.display='none';

}


function showCardProduct(){
    cardProduct.style.display='flex';
    cardOrder.style.display='none';

}

function showCardOrder() {
    cardProduct.style.display = 'none';
    cardOrder.style.display = 'flex';

}