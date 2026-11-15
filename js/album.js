import {currentLang} from "/public/js/main.js"
import {translation} from "/public/js/lang.js";
import { changeLanguage } from "./language.js";



let numRow = 0;
let item = 0;
let arrProduct;







function loadCart(){

try{
        const crt = JSON.parse(localStorage.getItem('cart') || '[]');
        return new Map(Array.isArray(crt)?crt:[]);
}catch{
        localStorage.removeItem('cart');
        return new Map;
}

}
let cart=loadCart();
renderCart();//============================>    شروع برنامه



const divBackFast = document.getElementById('backFast');
divBackFast.classList.remove('show');
document.getElementById('btnCloseFast').addEventListener('click',()=>{divBackFast.classList.remove('show');})


document.getElementById("showFlower").addEventListener("click",showFlower);
document.getElementById("showAccessories").addEventListener("click",showAccessories);
document.getElementById("next").addEventListener("click",next);
document.getElementById("prev").addEventListener("click",prev);
document.getElementById("imgRight").addEventListener("click",prev);
document.getElementById("imgLeft").addEventListener("click",next)
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


async function convertDigits(str, to = "en") {
    const fa = "۰۱۲۳۴۵۶۷۸۹";
    const en = "0123456789";

    return str.replace(/\d|[۰-۹]/g, d => {
        if (to === "en") return en[fa.indexOf(d)] ?? d;
        return fa[en.indexOf(d)] ?? d;
    });
}; 




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

                                document.getElementById('nameProductFast').textContent=arrProduct[item][0];
                                document.getElementById('priceProductFast').textContent = Number(arrProduct[item][1]).toLocaleString('fa-IR')+'\u2003'+'تومان';


                                divBackFast.classList.add('show');


/*

                                localStorage.setItem('cart',JSON.stringify([...cart]));

                                window.location.href = '/public/html/orderSave.html';
*/


                            });


const btnMapFast=document.getElementById('mapFast');
btnMapFast.addEventListener('click',()=>{document.getElementById('map').style.display='flex';});
const btnCloseMap=document.getElementById('btnCloseMapFast');
btnCloseMap.addEventListener('click',()=>{document.getElementById('map').style.display='none';});

const btnSaveOrderFast=document.getElementById('btnSaveOrderFast');
btnSaveOrderFast.addEventListener('click',async(e)=>{
    e.preventDefault();
    btnSaveOrderFast.disabled=true;
    btnSaveOrderFast.style.backgroundColor= 'gray';

    const items = [...cart]; console.log(items);
    let data = {
        nameSender: document.getElementById('nameSenderFast').value,
        mobileSender:await convertDigits(document.getElementById('mobileSenderFast').value, 'en'),        
        address:document.getElementById('addressFast').value + ':' + ' ', 
        city: '',
        dateDelivery: getTommorow(1),
        timeOf: '9:0:0', timeTo:'19:0:0',

        lat:null,
        lon:null,


        items



    }

if (data.nameSender!=='' && (data.mobileSender!=='' && /^09\d{9}$/.test(data.mobileSender)) && data.address!==''){
    const res = await fetch('/order/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body:JSON.stringify(data)});

    const r=await res.json();

    if(r.success==='ok') {

        const dataPayment = {
            trCode: r.trackingCode,
            totalPrice: r.totalPrice,
            timeTo: r.timeTo,
            timeOf: r.timeOf,
            dateDelivery: r.dateDelivery,
            address: r.address,
            dayOfweek: r.dayOfweek

        }

        sessionStorage.setItem('dataPayment', JSON.stringify(dataPayment));

     window.location.href='/public/html/peymentPage.html';
    }

}

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
                            });







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

function inc(){ /* افزودن */
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
   let numRow = 0;

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




//****************************************************************  FAST ORDER */
function getTommorow(daysAhead){
    let tom = new Date();
    tom.setDate(tom.getDate() + daysAhead);
    const t = Intl.DateTimeFormat('fa-IR', { year: "numeric", month: "2-digit", day: "2-digit" }).format(tom);

    return t;
}

document.querySelectorAll('input[name="deliv"]').forEach(rad=>{
    rad.addEventListener('change',()=>{
    

            if (rad.value ==='tomorrow'){
                
                document.getElementById('spnDateTomorrow').textContent=getTommorow(1);
                document.getElementById('spnDateTomorrow').style.visibility = 'visible';


            }
            else
                document.getElementById('spnDateTomorrow').style.visibility='hidden';

    });

});







/*/*//*****************************************************
                         M a p
*****************************************************/

var defaultPoint = [35.6892, 51.3890];

var map = L.map('map').setView(defaultPoint, 13);

setTimeout(function () {
    map.invalidateSize(true);
}, 500);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© OpenStreetMap'
}).addTo(map);


var marker = null;
var timer = null;

var addressInput = document.getElementById('addressFast');
var latInput = document.getElementById('lat');
var lngInput = document.getElementById('lng');


// ساخت نشانگر ثابت در مرکز نقشه
marker = L.marker(map.getCenter(), {
    interactive: false
}).addTo(map);


// ثبت مختصات مرکز نقشه
function setPoint(lat, lng, zoom) {

    var point = [lat, lng];

    if (zoom) {
        map.setView(point, zoom);
    } else {
        marker.setLatLng(point);
    }

    latInput.value = lat.toFixed(6);
    lngInput.value = lng.toFixed(6);

    fetchAddress(lat, lng);
}


// دریافت آدرس از روی مختصات
function fetchAddress(lat, lng) {

    clearTimeout(timer);

    timer = setTimeout(function () {

        addressInput.value = 'در حال دریافت آدرس...';

        var url =
            'https://nominatim.openstreetmap.org/reverse?format=jsonv2'
            + '&accept-language=fa'
            + '&lat=' + lat
            + '&lon=' + lng;

        fetch(url)

            .then(function (r) {

                if (!r.ok) {
                    throw new Error('Address request failed');
                }

                return r.json();

            })

            .then(function (d) {

                addressInput.value = d.display_name || '';

            })

            .catch(function () {

                addressInput.value = '';

            });

    }, 1000);

}


// دریافت موقعیت فعلی مشتری
function locateMe(silent) {

    if (!navigator.geolocation) {

        if (!silent) {
            alert('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند');
        }

        return;
    }

    navigator.geolocation.getCurrentPosition(

        function (pos) {

            setPoint(
                pos.coords.latitude,
                pos.coords.longitude,
                17
            );

        },

        function () {

            if (!silent) {

                alert(
                    'دسترسی به موقعیت داده نشد؛ لطفاً اجازه موقعیت‌یابی را در مرورگر فعال کنید'
                );

            }

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

}


// حرکت نقشه و انتخاب موقعیت جدید
map.on('move', function () {

    var center = map.getCenter();

    marker.setLatLng(center);

    latInput.value = center.lat.toFixed(6);
    lngInput.value = center.lng.toFixed(6);

});


// پس از توقف حرکت نقشه، آدرس دریافت شود
map.on('moveend', function () {

    var center = map.getCenter();

    setPoint(center.lat, center.lng);

});


// دکمه بازگشت به موقعیت فعلی
document.getElementById('btnCurrentLocation')
    .addEventListener('click', function () {

        locateMe(false);

    });


// موقعیت اولیه مشتری هنگام باز شدن نقشه
locateMe(true);


// اصلاح ابعاد نقشه پس از نمایش
setTimeout(function () {

    map.invalidateSize();

}, 300);
