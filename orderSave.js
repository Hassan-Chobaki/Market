//import { currentLang } from "./main.js";
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


function convertDigits(str, to = "en") {
    const fa = "۰۱۲۳۴۵۶۷۸۹";
    const en = "0123456789";

    return str.replace(/\d|[۰-۹]/g, d => {
        if (to === "en") return en[fa.indexOf(d)] ?? d;
        return fa[en.indexOf(d)] ?? d;
    });
}; //************************************************************END convertDigits */

    const day=document.getElementById('day');
    const month=document.getElementById('month');
    const year=document.getElementById('year');


document.getElementById('tommorrow').addEventListener('click',tommorrow);
document.getElementById('occasion').addEventListener('click',selectOcc);

document.addEventListener('click', (e) => {
    if (document.getElementById('dark').contains(e.target)&& document.getElementById('dark').style.display!=='none')
         document.getElementById('dark').style.display = 'none';


});












//************************************************************************END EVENTs */




function selectOcc(){
    

const dark=document.getElementById('dark');
let s=document.getElementById('selectOcc');


    
    dark.style.display='flex';
    
    
    /*
    s.style.display='flex';
    s.focus();
   
    let i=0;
    for(const key of mapOccasion.keys()){
        i++;       
        s.add(new Option(key,i));        
    }
    
    s.addEventListener('change',(e)=>{
        console.log(s.selectedOptions[0].textContent);

        const yyy=mapOccasion.get(s.selectedOptions[0].textContent).get(Number(document.getElementById('year').value));

console.log('==Occens.has=',mapOccasion.has(s.selectedOptions[0].textContent),'===yyy====',yyy[0]);

document.getElementById('day').value=yyy[1];
document.getElementById('month').value=yyy[0];

        dark.style.display='none';
        s.style.display='none';
s.innerHTML='';
    });
    */

document.querySelector('.classDark').innerHTML=`

            <label class="setDateOccation" data-i18n="setDateOccasion"></label>

`;




    for(const [occation,year] of mapOccasion){
        for(const [y,md] of year){

            const row=document.createElement('div');
                    row.classList.add('classDark');
            if(Number(document.getElementById('year').value)===y){
                row.textContent =  occation + "\u2003\u2003\u2003\u2003" +y + '/' + md[0] + '/' + md[1];

                    row.dataset.month=md[0];
                    row.dataset.day=md[1];
                    row.style.currsor='pointer';
                dark.appendChild(row);
            }//if

           

           
        }
        
    }  

    
        
        const rowDate = document.querySelectorAll('.classDark');
            rowDate.forEach((row) => {
                row.addEventListener('click', (e) => {
                    const monthOfDIV = e.currentTarget.dataset.month;
                    const dayOfDIV=e.currentTarget.dataset.day;

                    e.currentTarget.dataset.month.value=monthOfDIV;
                    e.currentTarget.dataset.day.value=dayOfDIV;

                    document.getElementById('month').value=monthOfDIV;
                    document.getElementById('day').value=dayOfDIV;                                             
                   
                });
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

    for(p of cart.values()){
    const div=document.createElement('div');
      div.innerHTML=`
                    <span>${index++ } - ${p.name}</span>
                    <span>${p.quantity}</span>
                    <span>${p.price}</span>
                    <span>${p.price * p.quantity}</span>
                    <img src="${p.src}">                    
                    
                    `;

      div.classList.add('listOrder');
       factor.appendChild(div);
total+=(p.price * p.quantity)


    };

    div=document.createElement('div');
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
    day.value = d;



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