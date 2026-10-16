

import { currentLang } from "/public/js/main.js"
import { translation } from "/public/js/lang.js";

/*

const mapOccasion=new Map([

                    ["روزپدر",new Map([
                                        [1405,[12,2]],
                                        [1406,[9,21]],
                                        [1407,[9,11]],
                                        [1408,[9,1]],
                                        [1409,[8,21]],
                                        [1410,[8,11]]
                                    ])],
                    ["روزمادر",new Map([
                                        [1405,[9,9]],
                                        [1406,[8,29]],
                                        [1407,[8,19]],
                                        [1408,[8,9]],
                                        [1409,[7,29]],
                                        [1410,[7,19]]
                                    ])],
                    ["ولن تاین",new Map([
                                        [1405, [11, 25]],
                                        [1406, [11, 25]],
                                        [1407, [11, 25]],
                                        [1408, [11, 25]],
                                        [1409, [11, 25]],
                                        [1410,[11,25]]
                                    
                                    ])]

]);
*/

const mapOccasion = row2map(await getListOccasion()); 

function row2map(rows){
    const mapOcc=new Map;
rows.forEach(row=>{
    const [year,month,day]=row.date.split('/').map(Number);

    if( ! mapOcc.has(row.name))
        mapOcc.set(row.name,new Map);

    mapOcc.get(row.name).set(year,[month,day]);


});
return mapOcc;

}


function convertDigits(str, to = "en") {
    const fa = "۰۱۲۳۴۵۶۷۸۹";
    const en = "0123456789";

    return str.replace(/\d|[۰-۹]/g, d => {
        if (to === "en") return en[fa.indexOf(d)] ?? d;
        return fa[en.indexOf(d)] ?? d;
    });
}; 

//************************************************************END convertDigits */

    const day=document.getElementById('selDay');
    const month=document.getElementById('selMonth'); 
    const year=document.getElementById('selYear');


document.getElementById('tommorrow').addEventListener('click',tommorrow);
document.getElementById('occasion').addEventListener('click',selectOcc);


const delivery=document.getElementById('delivery');
const occasionOverlay=document.getElementById('dark');

function hideOccasionPicker(){
    occasionOverlay.style.display = 'none';
    occasionOverlay.innerText = '';
}

delivery.addEventListener('click', (e) => {
    if (e.target.closest('#dark')) {
        hideOccasionPicker();
    }
});

document.addEventListener('click', (e) => {
    if (
        occasionOverlay.style.display !== 'none' &&
        !e.target.closest('#dark') &&
        !e.target.closest('#occasion')
    ) {
        hideOccasionPicker();
    }
});


const screenTypeMobile=window.matchMedia('(max-width:728px)');
const accordionItems = [
    {
        title: document.getElementById('titlePanelRec'),
        panel: document.querySelector('.info-panel.divReciver')
    },
    {
        title: document.getElementById('titlePanelNoteComment'),
        panel: document.getElementById('panelNoteComment').querySelector('.info-panel')
    }
];

function setPanelHeight(panel) {
    requestAnimationFrame(()=>{
    panel.style.height = `${panel.scrollHeight+5}px`;  
    
    });
}

function updateReceiverPanelLayout() {
    accordionItems.forEach(({title, panel}) => {
        if (screenTypeMobile.matches) {
            title.style.display = 'flex';

            if (panel.classList.contains('open')) {
                requestAnimationFrame(() =>
                    requestAnimationFrame(()=>{ setPanelHeight(panel)}));
            } else {
                panel.style.height = '0px';
            }
            return;
        }

        title.style.display = 'none';
        panel.classList.add('open');
        panel.style.height = '';
        
    });
}

accordionItems.forEach(({title, panel}) => {
    title.addEventListener('click', () => {
        if (!screenTypeMobile.matches) {
            return;
        }

        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
            requestAnimationFrame(() => setPanelHeight(panel));
        } else {
            panel.style.height = '0px';
        }
    });
});

screenTypeMobile.addEventListener('change', updateReceiverPanelLayout);
window.addEventListener('resize', () => {
    if (screenTypeMobile.matches) {
        accordionItems.forEach(({panel}) => {
            if (panel.classList.contains('open')) {
                requestAnimationFrame(() => setPanelHeight(panel));
            }
        });
    }
});

updateReceiverPanelLayout();







const btnFindOnMap=document.getElementById('findOnMap');

btnFindOnMap.addEventListener('click',()=>{
    document.getElementById('mapBox').style.display='flex';
})

const btnmapClose=document.getElementById('mapClose');
btnmapClose.addEventListener('click',()=>document.getElementById('mapBox').style.display='none');






//************************************************************************END EVENTs */




function selectOcc(){
    


const dark=occasionOverlay;
let s=document.getElementById('selectOcc');


dark.innerHTML='';    
dark.style.display='flex';
   



let digit=(n)=>String(n).padStart(2,0);

    for(const [occation,year] of mapOccasion){
        for(const [y,md] of year){

            const row=document.createElement('div');
                    row.classList.add('occasionRow');
            if(Number(document.getElementById('selYear').value)===y){
                row.textContent = occation + "\u2003\u2003\u2003\u2003" +y + '/' + digit(md[0]) + '/' + digit(md[1]);
                    row.dataset.occation=occation;
                    row.dataset.month=digit(md[0]);
                    row.dataset.day=digit(md[1]);
                    row.style.cursor='pointer';
                dark.appendChild(row);
            }//if

           

           
        }
        
    }  
   

    
        
        const rowDate = document.querySelectorAll('.occasionRow');
            rowDate.forEach((row) => {          
                row.addEventListener('click', (e) => {

                    const monthOfDIV = e.currentTarget.dataset.month;
                    const dayOfDIV=e.currentTarget.dataset.day;
    

                    document.getElementById('selMonth').value=monthOfDIV;
                    document.getElementById('selDay').value=dayOfDIV;
                    document.getElementById('occationDay').innerHTML= e.currentTarget.dataset.occation;
                
                    
                    
                }                                      
                
            
               );                             


               



            }); 

          






    
    
}






function dateJalali(y,m,d){
    
let digit=(n)=>String(n).padStart(2,0);

    for (let i=1;i<=31;i++)
        day.innerHTML+=`<option value="${digit(i)}">${digit(i)}</option>`;
    

    for(let i=1405;i<1411;i++)
        year.innerHTML+=`<option value="${i}">${i}</option>`;
let i=1;
    const nameMonth=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

    nameMonth.forEach((m,i)=>{
        i++;
        month.innerHTML+=`<option value="${digit(i)}">${m}</option>`;
    })




}

function loadCart() {
    try {
        const data = JSON.parse(localStorage.getItem('cart') || '[]');
        return new Map(Array.isArray(data) ? data : []);
    } catch {
        localStorage.removeItem('cart');
        return new Map();
    }
}

let cart = loadCart(); showFactor();


function showFactor(){
    const factor=document.getElementById('listOrder');

    
let total=0;
let index=1;

    for(let p of cart.values()){
    const div=document.createElement('div');
      div.innerHTML=`
                    <span>${index++ } - ${p.name}</span>
                    <span>${p.quantity}</span>
                    <span>${Number(p.price).toLocaleString('fa-IR')}</span>
                    <span>${Number(p.price * p.quantity).toLocaleString('fa-IR')}</span>
                    <img class="factorImg" src="${p.src}" style="border:3px solid white">

                    `;

                    
        div.classList.add('listOrder');
        factor.appendChild(div);
    total+=(p.price * p.quantity)


                                                                          /*zoom*/
        const imgZoom = div.querySelector('img');
        imgZoom.addEventListener('click', () => {
            const over = document.createElement('div');
            over.innerHTML = `<img src="${imgZoom.src}" class="imgBig">`;
            over.classList.add('zoom');
            document.body.appendChild(over);
            over.addEventListener('click', () => { over.remove(); })
        });                                                             /*zoom*/


    };

   let div=document.createElement('div');
    div.style.margin='5px';
    div.innerHTML=`
                    
                    <span class="totalPrice"> <span style="font-size:10px;display:inline;">تومان</span> &nbsp ${Number(total).toLocaleString('fa-IR')}&nbspمبلغ کل  </span> 
    
    `;
    factor.appendChild(div);

}


dateJalali(1);

function tommorrow(){
let y,m,d;

if(localStorage.getItem('lang')==='fa'){
    y=new Intl.DateTimeFormat("fa-IR",{year:"numeric"}).format(new Date());
    m=new Intl.DateTimeFormat("fa-IR",{month:"2-digit"}).format(new Date());
    d=new Intl.DateTimeFormat("fa-IR",{day:"2-digit"}).format(new Date());
}
else{
    y=new Intl.DateTimeFormat("en-US",{year:"numeric"}).format(new Date());
    m=new Intl.DateTimeFormat("en-US",{month:"2-digit"}).format(new Date());
    d=new Intl.DateTimeFormat("en-US",{day:"2-digit"}).format(new Date());
    
}




    y = Intl.DateTimeFormat('en-US-u-ca-persian', { year: "numeric" }).format(new Date());
    m = Intl.DateTimeFormat('en-US-u-ca-persian', { month: "numeric" }).format(new Date());
    d = Intl.DateTimeFormat('en-US-u-ca-persian', { day: "numeric" }).format(new Date());
    let tempY=convertDigits(y.match(/\d+/)[0],'en');


let digit=(n)=>String(n).padStart(2,0);


    year.value =tempY;    
    month.value = digit(m);
    day.value =digit(Number(convertDigits(d,'en'))+1);         // F O R  TOMMORROW
    let tommorrowWeekDay=new Date();
    tommorrowWeekDay.setDate(tommorrowWeekDay.getDate() + 1);
    document.getElementById('occationDay').innerHTML=new Intl.DateTimeFormat(currentLang==='fa'?'fa-IR':'en-US',{weekday:'long'}).format(tommorrowWeekDay);
    



}
/***********************************************نقشه */
/*
document.getElementById('findOnMap').addEventListener('click',()=>{
    document.getElementById('map').style.display='block';
    navigator.geolocation.getCurrentPosition((position)=>{
        const lat=position.coords.latitude;
        const lon=position.coords.longitude;
        let map=L.map('map').setView([lat,lon],13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([lat,lon]).addTo(map)
            .bindPopup('موقعیت شما')
            .openPopup();
    },(err)=>{alert(err);}
    );

});*/






const btnSaveOrder=document.getElementById('btnSaveOrder');


/**********************************************   E  V  E  N  T  oreder */

btnSaveOrder.addEventListener('click',(e)=>{


    e.preventDefault();

    isValidForm();

});



async function isValidForm(){

function showError(msg){
    const boxError=document.getElementById('msgError');
    const msgError=document.getElementById('msgErrorSpan');

    boxError.style.display='flex';
    msgError.textContent=msg;
    setTimeout(() => {
        boxError.style.display='none';
        
    }, 2000);
    
}

function regexMobile(val){ return /^09\d{9}$/.test(val); }

    const inpNameFamilySen=document.getElementById('inpNameFamilySen');
    const inpNameFamilyRec =document.getElementById('inpNameFamilyRec');
    const inpMobileSender = document.getElementById('inpMobileSender');
    const inpTelReciver = document.getElementById('inpTelReciver');
    const inpTelSender = document.getElementById('inpTelSender');
    const inpMobileReciver = document.getElementById('inpMobileReciver');
    const inpNote = document.getElementById('inpNote');
    const inpComment = document.getElementById('inpComment');
    const selDay = document.getElementById('selDay');
    const selMonth = document.getElementById('selMonth');
    const selYear = document.getElementById('selYear');
    const inpTimeTo = document.getElementById('inpTimeTo');
    const inpTimeOf = document.getElementById('inpTimeOf');
    const inpCity = document.getElementById('inpCity');
    const inpAddress = document.getElementById('inpAddress');
    const inpAddressComment=document.getElementById('inpAddressComment');
   
    const cart = localStorage.getItem('cart');

    const items = cart ? JSON.parse(cart) : [];
    

    
    

    if (inpNameFamilySen.value === '') {currentLang==='fa'?showError('ورودی نام فرستنده خالی است'):showError('please input Name Sender');
        inpNameFamilySen.placeholder = '\t⚠';
        inpNameFamilySen.classList.add('classError');return;
    } else inpNameFamilySen.classList.add('classCorrect');

    if (inpNameFamilyRec.value === '') {
        currentLang === 'fa' ? showError('ورودی نام گیرنده خالی است') : showError('please input Name Reciver');
        inpNameFamilyRec.placeholder = '\t⚠';
        inpNameFamilyRec.classList.add('classError');return;
    } else inpNameFamilyRec.classList.add('classCorrect');

    if (inpMobileSender.value === '') {
        currentLang === 'fa' ? showError('ورودی مبایل فرستنده خالی است') : showError('please input Mobile Sender');
        inpMobileSender.placeholder = '\t⚠';
        inpMobileSender.classList.add('classError');return;
    }else inpMobileSender.classList.add('classCorrect');


    if (!regexMobile(inpMobileSender.value)) {
        currentLang === 'fa' ? showError('شماره مبایل فرستنده اشتباه است') : showError('incurrect number Mobile Sender');
    inpMobileSender.style.color='red';return;
}else inpMobileSender.style.color='black';

if(inpMobileReciver.value.length>0)
    if (!regexMobile(inpMobileReciver.value)) {
        currentLang === 'fa' ? showError('مبایل گیرنده اشتباه است') : showError('  incurrect Mobile Reciver ');
        inpMobileReciver.style.color='red';return;
    }else inpMobileReciver.style.color='black';

    if (inpAddress.value.length < 5) {
        currentLang === 'fa' ? showError('ورودی آدرس خالی است') : showError('please input Address');
        inpAddress.value ='\t⚠'; inpAddress.style.color='red';return;
}else inpAddress.style.color='black';
    
let data={
            nameSender:inpNameFamilySen.value,  nameReciver:inpNameFamilyRec.value,   mobileSender:convertDigits(inpMobileSender.value,'en'),
            telSender:convertDigits(inpTelSender.value,'en'),  telReciver:convertDigits(inpTelReciver.value,'en'),  mobileReciver:convertDigits(inpMobileReciver.value,'en'),
            note:inpNote.value,  comment:inpComment.value,  address:inpAddress.value +':' + inpAddressComment.value, city:inpCity.value,
            dateDelivery:selYear.value + '/' + selMonth.value + '/' + selDay.value,
            timeOf:inpTimeOf.value,  timeTo:inpTimeTo.value,

            lat: pickedPoint ? pickedPoint[0] : null,
            lon: pickedPoint ? pickedPoint[1] : null,
            

            items



        }

    


const res=await saveOrder(data);/*************************************************ذخیره سازی */

if(res.success==='ok'){

    const dataPayment={
                        trCode:res.trackingCode,
                        totalPrice:res.totalPrice,
                        timeTo:res.timeTo,
                        timeOf:res.timeOf,
                        dateDelivery:res.dateDelivery,
                        address:res.address,
                        dayOfweek:res.dayOfweek
                        
    }

    sessionStorage.setItem('dataPayment',JSON.stringify(dataPayment));

    window.location.href='/public/html/peymentPage.html';




   /*
    localStorage.removeItem('cart');
    const tagsInput=document.querySelectorAll('.order-form input');
    for(let input of tagsInput) input.value='';
    // alert(res.trackingCode+'\t'+'این کد را نزد خود حفظ کنید');

     const modal=document.createElement('div');
     const centerBox=document.createElement('div');
     const span=document.createElement('span');
     const tip=document.createElement('span');
     modal.classList.add('zoom');
     span.classList.add('back');
     centerBox.classList.add('centerBox');

     span.textContent=translation[currentLang].copy;
     tip.textContent=translation[currentLang].toltipCopy;
     centerBox.innerHTML=` 
                            <span style="font-weight:lighter;"> ${translation[currentLang].codeTracking} </span>
                             <br><br>
                            
                             <span style="border:1px dashed black;padding:5px;font-weight:normal;letter-spacing:5px;box-shadow:var(--shadowL)"> ${res.trackingCode} </span> `;



            span.style.position='absolute';
            span.style.bottom='10px';
            span.style.left='50%';
            span.style.transform='translateX(-50%)';
            centerBox.style.position='relative';
            
     centerBox.appendChild(span); 
     


     document.body.appendChild(modal);
     modal.appendChild(centerBox);
modal.style.display='flex';

                                            span.addEventListener('click',(e)=>{
                                                span.appendChild(tip);
                                                tip.classList.add('toltip');
                                                setTimeout(() => {
                                                                    tip.classList.remove('toltip');
                                                                    span.removeChild(tip);
                                                                    window.location.href='/public/html/index.html';
                                                                }, 2000);
                                                
                                                
                                            });
*/
 
}//if res



}

async function saveOrder(data){

    const response=await fetch('/order/save',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
    });


    const result=await response.json();
    return result;
}




/***********************************************************************************************/ 
/***********************************************************************************************/ 
/*****************************************  M A P  *******************************************/ 
/***********************************************************************************************/ 
/***********************************************************************************************/ 


const mapOverlay = document.getElementById('mapBox');
const fallbackCenter = [35.6892, 51.3890];
let map = null;
let marker = null;
let pickedPoint = null;

function setPoint(lat, lon) {

    pickedPoint = [lat, lon];
    if (marker) {
        marker.setLatLng(pickedPoint);
    } else {
        marker = L.marker(pickedPoint, { draggable: true }).addTo(map);
        marker.on('dragend', () => {
            const p = marker.getLatLng();
            pickedPoint = [p.lat, p.lng];
        });
    }
}

function buildMap(lat, lon, withMarker) {
    
    if (!map) {
        map = L.map('map').setView([lat, lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        map.on('click', e => setPoint(e.latlng.lat, e.latlng.lng));

        // هر وقت اندازه‌ی ظرف عوض شد، لیفلت خودکار دوباره حساب کند
        new ResizeObserver(() => map.invalidateSize()).observe(document.getElementById('map'));
    } else {
        map.setView([lat, lon], 15);
    }
    if (withMarker) setPoint(lat, lon);

    map.invalidateSize();
    requestAnimationFrame(() => map.invalidateSize());
    setTimeout(() => map.invalidateSize(), 300);
    setTimeout(() => map.invalidateSize(), 800);
}
function closeMap() {
    mapOverlay.style.display = 'none';
    document.body.style.overflow = '';
}

document.getElementById('findOnMap').addEventListener('click', () => {
    mapOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
   

    if (!navigator.geolocation) {
        buildMap(...fallbackCenter, false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        pos => buildMap(pos.coords.latitude, pos.coords.longitude, true),
        () => buildMap(...fallbackCenter, false),
        { enableHighAccuracy: true, timeout: 8000 }
    );
});

document.getElementById('mapClose').addEventListener('click', closeMap);
async function fillAddress() {
    if (!pickedPoint) return;
    const [lat, lon] = pickedPoint;
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=fa`
        );
        const data = await res.json();
        if (data.display_name) {
            document.getElementById('inpAddress').value = data.display_name;
            document.getElementById('inpCity').value = data.address.city || data.address.county || data.address.town || data.address.village || data.address.municipality;
        }
    } catch (err) {

    }
}

const btnThisPosition = document.getElementById('thisPosition');

btnThisPosition.addEventListener('click', async () => {
    const oldContentBtn = btnThisPosition.innerHTML;
    const oldBg = btnThisPosition.style.backgroundColor;
    let sec = 0;

    btnThisPosition.disabled = true;
    btnThisPosition.style.backgroundColor = 'lightgray';
    btnThisPosition.style.color='black';
    btnThisPosition.textContent = sec; 

    const timer = setInterval(() => {
        sec++;
        btnThisPosition.textContent = sec;
    }, 1000);

    try {
        await fillAddress();
    } finally {
        clearInterval(timer);
        btnThisPosition.style.backgroundColor = oldBg;
        btnThisPosition.innerHTML = oldContentBtn;
        btnThisPosition.style.color = 'white';
        btnThisPosition.disabled = false;
        closeMap();
    }
});
mapOverlay.addEventListener('click', e => { if (e.target === mapOverlay) closeMap(); });