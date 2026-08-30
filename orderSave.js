






function dateJalali(Date){
    const day=document.getElementById('day');
    const month=document.getElementById('month');
    const year=document.getElementById('year');


    for (let i=1;i<=31;i++)
        day.innerHTML+=`<option value="${i}">${i}</option>`;
    

    for(let i=1405;i<1411;i++)
        year.innerHTML+=`<option value="${i}">${i}</option>`;
let i=0;
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