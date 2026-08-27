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

//*************************************************************************************************************
//*********************************************************************************************************** */

document.getElementById('btnAdd').addEventListener("click",()=>{AddProduct(document.getElementById("counter").textContent)});



let numRow=0;
let item=0;
const arrProduct= [
                           ['فاخر','1000000','10',0],
                           ['اشراف','200000','20',0],
                           ['کلاسیک','300000','30',0],
                           ['برتر','400000','40',0]];



        //**************************************************MOBILE */
            document.addEventListener("click",e=>{
                const list=document.getElementById('listOrder');
                const btn=document.getElementById('btnListOrder');
                if(list.classList.contains('show')&&(!list.contains(e.target)&&(!btn.contains(e.target)))){
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

    localStorage.removeItem('cart');

}




//************************************************************************************
// ******************************************************************************** */

let cart=new Map(JSON.parse(localStorage.getItem('cart')|| '[]' ));     showCart();
                                                                     

function AddProduct(quantity){   


    const code=arrProduct[item][2];
    let newQuantity=Number(quantity);
    
    if (cart.has(code)){

let oldQuantity=cart.get(code).quantity;
        
        newQuantity+=Number(oldQuantity);
        cart.get(code).quantity=newQuantity;
        const IsRow=document.getElementById(`product-${code}`);



        if(IsRow)
           IsRow.children[3].textContent=cart.get(code).quantity;
    }
    else{
    numRow++;
    arrProduct[item][3]=quantity;
    
        cart.set(code,{
                                        name:arrProduct[item][0],
                                        code:arrProduct[item][2],
                                        price:arrProduct[item][1],
                                        quantity:arrProduct[item][3]
        });
      

            let l=document.getElementById("listOrder");            
            let div=document.createElement('div');


            if(currentLang==='fa')
                div.dir='rtl';
            else
                div.dir="ltr";

div.id=`product-${code}`;
            div.innerHTML=`


                        <span style="flex: 0 500 0;"><button  style="background:black;color:#eb7979;font-size:10px;font-weight:bolder;">✗</button></span>

                            <span>${numRow}</span>
                            <span>${[...cart.values()].at(-1).name} </span>
                            <span>  ${[...cart.values()].at(-1).code}</span>
                            <span>${[...cart.values()].at(-1).quantity}</span>
                            <span>${[...cart.values()].at(-1).price}</span>
        
                        `;
                                
        div.classList.add('titrProductSelect')                ;
        l.appendChild(div);


    }//else 
        
     document.getElementById('counter').textContent='1';   
    
localStorage.setItem("cart",JSON.stringify([...cart]));

    }



















    function showCart() {

    const l = document.getElementById("listOrder");

    for (const product of cart.values()) {

        numRow++;

        const div = document.createElement("div");

        div.classList.add("titrProductSelect");

        div.dataset.code = product.code;

        if (currentLang === 'fa')
            div.dir = 'rtl';
        else
            div.dir = 'ltr';

        div.innerHTML = `
        
            <span style="flex: 0 500 0;"><button  style="background:black;color:#eb7979;font-size:10px;font-weight:bolder;">✗</button></span>
            <span>${numRow}</span>
            <span>${product.name}</span>
            <span>${product.code}</span>
            <span>${product.quantity}</span>
            <span>${product.price}</span>
            
        `;

        l.appendChild(div);
    }


function delRow(code){localStorage.removeItem(code);}

}