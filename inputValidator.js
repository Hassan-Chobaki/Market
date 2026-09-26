const MAX_LENGHT={name:50,mobile:11,tel:15,address:250,note:500}


function sanatizeInput(input){
    if(typeof input !=='string') return '';
    else
        return input.trim().replace(/[<>?*]/g,'').replace(/[\u0000-\u001F-\u007F]/g,'');
}

export function validateName(name){
    name=sanatizeInput(name);
    if(!name ||name.lenght<2 || name.lenght>MAX_LENGHT.name || !( /^[\u0600-\u06FFa-zA-Z\s]+$/.test(name)) )
        return {valid:false,msg:'not valid name'}
    else
        return{valid:true,input:name}
}

export function validateMobile(mobile){
    mobile = sanatizeInput(mobile).replace(/\s|-/g, "");
    
   if(! /^09\d{9}$/.test(mobile) || mobile.lenght>MAX_LENGHT.mobile)
      return {valid:false,msg:'not valid mobile'}

   return {valid:true,input:mobile}

}

export function validateAddress(address){
    address=sanatizeInput(address);
    if (!address ||  ! /^[\u0600-\u06FFa-zA-Z0-9\s.,\-\/]+$/.test(address) || address.lenght>MAX_LENGHT.address)
        return {valid:false,msg:'not valid address'}
    else
        return {valid:true,input:address}


}

export function validateTel(tel){
    tel = sanatizeInput(tel).replace(/\s|-/g, "");
    if(! /^0\d{9,10}$/.test(tel) || tel.lenght>MAX_LENGHT.tel)
        return {valid:false,msg:'not valid tel'}

    return {valid:true,input:tel}


}

export function validateComment(comment){
    comment=sanatizeInput(comment);
    if(comment.lenght>MAX_LENGHT.address)
        return{valid:false,msg:'not valid comment'}

    return {valid:true,input:comment}

}


export function validateNote(note){
note=sanatizeInput(note);
if(note.lenght>MAX_LENGHT.note)
    return {valid:false,msg:'not valid note'}
else
    return {valid:true,input:note}

}



function validateNum(){}


