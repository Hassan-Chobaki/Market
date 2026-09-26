import {currentLang} from "/public/js/main.js"
import {translation} from "/public/js/lang.js";



document.getElementById("showFlower").addEventListener("click",showFlower);
document.getElementById("showAccessories").addEventListener("click",showAccessories);
document.getElementById("next").addEventListener("click",next);
document.getElementById("prev").addEventListener("click",prev);
document.getElementById("imgRight").addEventListener("click",prev);
document.getElementById("imgLeft").addEventListener("click",next)
document.addEventListener("DOMContentLoaded", arrange);
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



let numRow=0;
let item=0;
const arrProduct= [
                           ['فاخر',1000000,'10',0,''],
                           ['اشراف',200000,'20',0,''],
                           ['کلاسیک',300000,'30',0,''],
                           ['برتر',400000,'40',0,'']];



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



    let arrayOfAddressImage=Array(
                            "/public/image/flower/flower0.jpg",
                            "/public/image/flower/flower1.jpg",
                            "/public/image/flower/flower2.jpg",
                            "/public/image/flower/flower3.jpg",

    ); 

for(let j=arrayOfAddressImage.length-1;j>=0;j--){
arrProduct[j][4]=arrayOfAddressImage[j];
}
     


function showItem(array){

    
        if((item>arrayOfAddressImage.length-1))
            item=0;
        else if(item<0)
            item=arrayOfAddressImage.length-1;
        array[0].src=arrayOfAddressImage[item];   

        if((item+1>arrayOfAddressImage.length-1))     
            item=0;
        else item++;        
        array[1].src=arrayOfAddressImage[item];

        if((item+1>arrayOfAddressImage.length-1))
            item=0;
        else item++;
        array[2].src=arrayOfAddressImage[item];

    
document.getElementById('selectImage').src=array[1].src;


        const spanDetailName=document.getElementById('detailName');
        const spanDetailPrice=document.getElementById('detailPrice');
        const spanDetailCode=document.getElementById('detailCode');
    
    
        spanDetailName.innerText=arrProduct[item][0];

      if(localStorage.getItem('lang')==='fa'){
        spanDetailPrice.textContent="تومان "+"\u2003 "+Number(arrProduct[item][1]).toLocaleString("fa-IR");
        spanDetailCode.textContent=" کد"+"\u2003 "+arrProduct[item][2];


      }
      else{
           spanDetailPrice.textContent=arrProduct[item][0]+'$';
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
    
    item++;
    showItem(Array.from(flowerContainer.getElementsByTagName('img')));


}

function prev(){
    item--;
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

let cart=new Map(JSON.parse(localStorage.getItem('cart')|| '[]' ));     renderCart();
                                                                      
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