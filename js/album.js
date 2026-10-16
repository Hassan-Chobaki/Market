import {currentLang} from "/public/js/main.js"
import {translation} from "/public/js/lang.js";



let numRow = 0;
let item = 0;
let arrProduct;







function loadCart(){

try{
        const crt = JSON.parse(localStorage.getItem('cart') || []);
        return new Map(Array.isArray(crt)?crt:[]);
}catch{
        localStorage.removeItem('cart');
        return new Map;
}

}
let cart=loadCart();
renderCart();







document.getElementById("showFlower").addEventListener("click",showFlower);
document.getElementById("showAccessories").addEventListener("click",showAccessories);
document.getElementById("next").addEventListener("click",next);
document.getElementById("prev").addEventListener("click",prev);
document.getElementById("imgRight").addEventListener("click",next);
document.getElementById("imgLeft").addEventListener("click",prev)
//document.addEventListener("DOMContentLoaded", arrange);
document.getElementById('inc').addEventListener("click",inc);
document.getElementById('dec').addEventListener("click",dec);
document.getElementById('btnListOrder').addEventListener("click",showListOrder);

document.getElementById('listOrder').addEventListener("click", event => {
    const deleteButton = event.target.closest("button[data-delete-code]");
    if (deleteButton)
        delRow(deleteButton.dataset.deleteCode);
});

//*************************************************************************************************************
//*********************************************************************************************************** */

document.getElementById('btnAdd').addEventListener("click",()=>{AddProduct(document.getElementById("counter").textContent)});

const orderSave=document.getElementById('orderSave');
const orderThis=document.getElementById('orderThis');






                            orderThis.addEventListener('click',()=>{
                                cart.clear();
                                localStorage.removeItem('cart');



                                cart.set(
                                         arrProduct[item][2], {
                                                                name: arrProduct[item][0],
                                                                code: arrProduct[item][2],
                                                                price: arrProduct[item][1],
                                                                quantity: 1,
                                                                src: arrProduct[item][4]
                                });




                                localStorage.setItem('cart',JSON.stringify([...cart]));

                                window.location.href = '/public/html/orderSave.html';

                            });







                            orderSave.addEventListener('click',()=>{
                                if(cart.size<=0)
                                {
                                    const msgError=document.getElementById('messageBox');

                                    if(currentLang==='fa')
                                        document.getElementById('message').innerHTML =`    ⚠&nbspلطفاابتدابادکمه <span style="color:white;font-weight:bold"> 🛒افزودن </span>یک محصول را به سبدخریداضافه بفرمایید`;
                                    else
                                        document.getElementById('message').innerHTML = `Please press the <span style="color:white;font-weight:bold"> 🛒Add </span> button first to add the product to your cart.`;
                                    msgError.classList.remove('show');
                                    void msgError.offsetWidth;
                                    msgError.classList.add('show');
                                    
                                }
                                else
                                    window.location.href='/public/html/orderSave.html';
                            })







                const response=await fetch('/product/show',{method:'GET'});
                const result=await response.json();
                console.log('Arr Product=',result);

                arrProduct=result.map(row=>{return[row.name,row.price,row.code,0,`/public/image/flower/${row.code}/thumb.webp`]});




let arrayOfAddressImage = Array();
for (let row of arrProduct) {
    arrayOfAddressImage.push(`/public/image/flower/${row[2]}/thumb.webp`);
    console.log('row=', row);
}





        //**************************************************MOBILE */
            document.addEventListener("click",e=>{
                const list=document.getElementById('listOrder');
                const btn=document.getElementById('btnListOrder');
                const btnDel=document.getElementById('btnDel');
                if(list.classList.contains('show')&&(!list.contains(e.target)&&(!btn.contains(e.target)&&(!btnDel.contains(e.target))))){
                    list.classList.remove('show');                
                }
            })
        //******************************************************* */    





function showListOrder(){
    document.getElementById('listOrder').classList.add('show');
}

function inc(){ 
    let counter=document.getElementById('counter').textContent.trim();
    counter=parseInt(counter,10);    
    counter++;
    if(counter>9) return;
    
    document.getElementById('counter').textContent=counter; 
}

function dec(){    
    let counter=Number(document.getElementById('counter').textContent);
    if(counter-1<1) return;
    document.getElementById('counter').textContent=counter-1;

}



function showItem(array){
    const count = arrayOfAddressImage.length;

    if(count===0) return;

    item=( (item%count)+count) % count;
    
    
    array[0].src = arrayOfAddressImage[(item + 1) % count];
    array[1].src = arrayOfAddressImage[item];
    array[2].src = arrayOfAddressImage[(item - 1 + count) % count];

    
document.getElementById('selectImage').src=array[1].src;


        const spanDetailName=document.getElementById('detailName');
        const spanDetailPrice=document.getElementById('detailPrice');
        const spanDetailCode=document.getElementById('detailCode');
    
    
        spanDetailName.innerText=arrProduct[item][0];

      

      if(currentLang==='fa'){
        spanDetailPrice.textContent="تومان "+"\u2003 "+Number(arrProduct[item][1]).toLocaleString("fa-IR");
       // spanDetailCode.textContent= "***";// " کد"+"\u2003 "+arrProduct[item][2];


      }
      else{
           spanDetailPrice.textContent=arrProduct[item][1]+'$';
           spanDetailCode.textContent=arrProduct[item][2]+'\u2003'+ 'code';

      }
      


}


function arrange(){
    
    const flowerContainer = document.getElementById("flowerContainer");
    const accessoriesContainer = document.getElementById("accessoriesContainer");
    flowerContainer.style.display = "flex";
    accessoriesContainer.style.display = "none";

const arrayFrame  = Array.from(flowerContainer.getElementsByTagName("img"));
arrayFrame[1].style.border = "2px solid #FFF";    
showItem(arrayFrame);

   

  
}

function next(){
    
    item--;
    showItem(Array.from(flowerContainer.getElementsByTagName('img')));


}

function prev(){
    item++;
    showItem(Array.from(flowerContainer.getElementsByTagName('img')));
}



function showFlower(){
    document.getElementById('tabAccessories').style.display='none';    
    document.getElementById('tabFlower').classList.add('container');
    document.getElementById('tabFlower').style.display='flex';
    
    
}




function showAccessories(){
    document.getElementById('tabAccessories').style.display='flex';
    document.getElementById('tabFlower').style.display='none';

    cart.clear();
    renderCart();
    localStorage.setItem('cart', JSON.stringify([...cart]));
}




//************************************************************************************
// ******************************************************************************** */


                                                                      
function AddProduct(quantity){
    
    const code=arrProduct[item][2];
    let newQuantity=Number(quantity);
    
    if (cart.has(code)){
        newQuantity += Number(cart.get(code).quantity);
        cart.get(code).quantity = newQuantity;
    }
    else{
        arrProduct[item][3]=quantity;
        cart.set(code,{
            name:arrProduct[item][0],
            code:arrProduct[item][2],
            price:arrProduct[item][1],
            quantity:arrProduct[item][3],
            src:arrProduct[item][4]
        });
    }

    renderCart();
    localStorage.setItem("cart", JSON.stringify([...cart]));
    document.getElementById('counter').textContent='1';
}

function renderCart() {
    const l = document.getElementById("listOrder");
    l.querySelectorAll("[data-code]").forEach(row => row.remove());
    numRow = 0;

    for (const product of cart.values()) {
        numRow++;
        const div = document.createElement("div");
        div.classList.add("titrProductSelect");
        div.dataset.code = product.code;
        div.id = `product-${product.code}`;
        div.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
        
        const currency=currentLang==='fa'?  'تومان':'$';

        div.innerHTML = `
            <span style="flex: 0 0 0;">
                <button id="btnDel" class="X" type="button" data-delete-code="${product.code}">✗</button>
            </span>


            <span>${numRow}</span>
            <span>${product.name}</span>            
            <span>${product.quantity}</span>
            <span>${product.price*product.quantity}\u2003${currency}</span>
            
        `;

       l.appendChild(div);
   }
}

function delRow(code) {
   cart.delete(code);
   renderCart();
   localStorage.setItem("cart", JSON.stringify([...cart]));
}

arrange();