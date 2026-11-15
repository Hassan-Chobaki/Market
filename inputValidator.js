const MAX_LENGTH={name:50,mobile:11,tel:15,address:250,note:500}


function sanatizeInput(input){
    if(typeof input !=='string') return '';
    else
        return input.trim().replace(/[<>?*]/g,'').replace(/[\u0000-\u001F-\u007F]/g,'');
}

export function validateName(name){
    name=sanatizeInput(name);
    if(!name ||name.length<2 || name.lenght>MAX_LENGTH.name || !( /^[\u0600-\u06FFa-zA-Z\s]+$/.test(name)) )
        return {valid:false,msg:'inpNameFamily'}
    else
        return{valid:true,input:name}
}

export function validateMobile(mobile,isRequired){
    mobile = sanatizeInput(mobile).replace(/\s|-/g, "");
  if(!isRequired && mobile.length===0)  return {valid:true,input:null};

  if(/^09\d{9}$/.test(mobile)) return{valid:true,input:mobile};  

  return{valid:false,msg:'mobile'};

}

export function validateAddress(address){
    address=sanatizeInput(address);
    if (!address ||  ! /^[\u0600-\u06FFa-zA-Z0-9\s.,\-\/]+$/.test(address) || address.length>MAX_LENGTH.address)
        return { valid: false, msg:'inpAddress'}
    else
        return {valid:true,input:address}


}

export function validateTel(tel){
    tel = sanatizeInput(tel).replace(/\s|-/g, "");
    if(! /^0\d{9,10}$/.test(tel) || tel.length>MAX_LENGTH.tel)
        return {valid:false,msg:'inpTelSender'}

    return {valid:true,input:tel}


}

export function validateComment(comment){
    comment=sanatizeInput(comment);
    if(comment.length>MAX_LENGTH.address)
        return{valid:false,msg:'inpComment'}

    return {valid:true,input:comment}

}


export function validateNote(note){
note=sanatizeInput(note);
if(note.length>MAX_LENGTH.note)
    return {valid:false,msg:'inpNote'}
else
    return {valid:true,input:note}

}



function validateNum(){}


