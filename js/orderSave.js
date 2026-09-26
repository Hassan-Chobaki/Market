

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

const mapOccasion=row2map(await getListOccasion());

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
}; //************************************************************END convertDigits */

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


const screenTypeMobile=window.matchMedia('(max-width:600px)');
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
    panel.style.height = `${panel.scrollHeight}px`;  
    
    });
}

function updateReceiverPanelLayout() {
    accordionItems.forEach(({title, panel}) => {
        if (screenTypeMobile.matches) {
            title.style.display = 'flex';

            if (panel.classList.contains('open')) {
                requestAnimationFrame(() =>
                    requestAnimationFrame(()=>{ setPanelHeight(panel)+20+"px"}));
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





//************************************************************************END EVENTs */




function selectOcc(){
    


const dark=occasionOverlay;
let s=document.getElementById('selectOcc');


dark.innerHTML='';    
dark.style.display='flex';
   





    for(const [occation,year] of mapOccasion){
        for(const [y,md] of year){

            const row=document.createElement('div');
                    row.classList.add('occasionRow');
            if(Number(document.getElementById('selYear').value)===y){
                row.textContent = occation + "\u2003\u2003\u2003\u2003" +y + '/' + md[0] + '/' + md[1];
                    row.dataset.occation=occation;
                    row.dataset.month=md[0];
                    row.dataset.day=md[1];
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
    


    for (let i=1;i<=31;i++)
        day.innerHTML+=`<option value="${i}">${i}</option>`;
    

    for(let i=1405;i<1411;i++)
        year.innerHTML+=`<option value="${i}">${i}</option>`;
let i=1;
    const nameMonth=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

    nameMonth.forEach((m,i)=>{
        i++;
        month.innerHTML+=`<option value="${i}">${m}</option>`;
    })




}




let cart=new Map(JSON.parse(localStorage.getItem('cart')|| '[]' ));   showFactor();



function showFactor(){
    const factor=document.getElementById('listOrder');

    
let total=0;
let index=1;

    for(let p of cart.values()){
    const div=document.createElement('div');
      div.innerHTML=`
                    <span>${index++ } - ${p.name}</span>
                    <span>${p.quantity}</span>
                    <span>${p.price}</span>
                    <span>${p.price * p.quantity}</span>
                    <img src="${p.src}" style="border:3px solid white">

                    `;

                    
        div.classList.add('listOrder');
        factor.appendChild(div);
    total+=(p.price * p.quantity)


                                                                          /*zoom*/
        const imgZoom = div.querySelector('img');
        imgZoom.addEventListener('click', () => {
            const over = document.createElement('div');
            over.innerHTML = `<img src=${imgZoom.src} class="imgBig">`;
            over.classList.add('zoom');
            document.body.appendChild(over);
            over.addEventListener('click', () => { over.remove(); })
        });                                                             /*zoom*/


    };

   let div=document.createElement('div');
    div.style.margin='5px';
    div.innerHTML=`
                    
                    <span class="totalPrice"> ${total}قیمت کل </span>
    
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

    year.value =tempY;    
    month.value = m;
    day.value =Number(convertDigits(d,'en'))+1;         // F O R  TOMMO RROW
    let tommorrowWeekDay=new Date();
    tommorrowWeekDay.setDate(tommorrowWeekDay.getDate() + 1);
    document.getElementById('occationDay').innerHTML=new Intl.DateTimeFormat(localStorage.getItem('lang')==='fa'?'fa-IR':'en-US',{weekday:'long'}).format(tommorrowWeekDay);
    



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
async function regexMobile(val){ return /^09\d{9}$/.test(val); }

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

    if (inpNameFamilySen.value === '') {
        inpNameFamilySen.placeholder = '\t*';
        inpNameFamilySen.classList.add('classError');return;

    } else inpNameFamilySen.classList.add('classCorrect');
    if (inpNameFamilyRec.value === '') {
        inpNameFamilyRec.placeholder = '\t*';
        inpNameFamilyRec.classList.add('classError');return;

    } else inpNameFamilyRec.classList.add('classCorrect');
    if (inpMobileSender.value === '') {
        inpMobileSender.placeholder = '\t*';
        inpMobileSender.classList.add('classError');return;

    }else inpMobileSender.classList.add('classCorrect');


if( ! regexMobile(inpMobileSender.value)){
    inpMobileSender.style.color='red';return;
}else inpMobileSender.style.color='black';
    
let data={
            nameSender:inpNameFamilySen.value,  nameReciver:inpNameFamilyRec.value,   mobileSender:convertDigits(inpMobileSender.value,'en'),
            telSender:convertDigits(inpTelSender.value,'en'),  telReciver:convertDigits(inpTelReciver.value,'en'),  mobileReciver:convertDigits(inpMobileReciver.value,'en'),
            note:inpNote.value,  comment:inpComment.value,  adress:inpAddress.value, city:inpCity.value,
            dateDelivery:selYear.value + '/' + selMonth.value + '/' + selDay.value,
            timeOf:inpTimeOf.value,  timeTo:inpTimeTo.value

}
const res=await saveOrder(data);
console.log('javab omad az server = ',res);

   

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