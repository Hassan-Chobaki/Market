//**********************************************************************  A P I  */



async function addProduct(formData) {

try{
    const response = await fetch(`/product`, {
        method: 'POST',
        body: formData
    });


    const result = await response.json();

    return result;
}catch(error){console.log(error);return {rep:'repeate'}}


}






async function showTableProduct() {

    const load =await fetch('/product/show', {
        method: 'GET'
     
    });

    const result = await load.json();

   
return result;

}







async function getImageProduct(code){
    const respons=await fetch(`/product/image/${code}`);
    const data=await respons.json(); console.log(data.image);
        return data.image;
}








async function delProduct(table,key){
    const response=await fetch(`/delete/${table}/${key}`,{method:'DELETE'});
    return response.json();
}







async function editProduct(newData) {
    

    const response=await fetch('/product/edit',{
        method:'PUT',
        body:newData
    })
    const result=await response.json();
    return result;
}




async function getPicOfServer(code) {

    const result=await fetch(`/product/getPic/${code}`,{
        method:'GET'
        
    })


    if( ! result.ok){ return {success:false}};
      const response=await result.json();       console.log(result,'API');

    return response;
    
}


async function getDataOfOrder(page=1,rowCount=20){

    const response=await fetch(`/order/list/${page}/${rowCount}`,{method:'GET'});

    const result=await response.json();

    return result.rows;


}

async function getDetailsOfOrder(trackingCode){
    const response=await fetch('/order/details/'+ encodeURIComponent(trackingCode));
    const result=await response.json();
    return result;
}

async function updateOrder(trackingCode,data) {
    const response=await fetch('/order/update/'+ encodeURIComponent(trackingCode),{
        method:'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(data)
    });

    console.log(data);
    const result=await response.json();
    return result;
    
}

async function saveOccasion(data) {

    try{

            const response=await fetch('/occasion/save',{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body:JSON.stringify(data)
            });


            const result=await response.json();

            return result;




    }catch(error){return {success:'fail'}}
    
}



async function getListOccasion() {

    const response=await fetch('/occasion/list',{method:'GET'});

    const result=await response.json();

    return result;
    
}






async function deleteOccasion(date){
    const response=await fetch(`/occasion/del/${encodeURIComponent(date)}`,{
        method:'DELETE'    
    })

    const result=await response.json();



    return result;

}





async function getReceiptInfo(dateFrom,dateTo,methodPayment) {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    if(methodPayment) params.append('methodPayment',methodPayment);

    const response=await fetch('/order/image/receipt/?'+params.toString(),{ method:'GET',credentials:'same-origin'});
if(response.status===401) return {success:false,unauthorized:true};
if(!response.ok) return {success:false};

    return await response.json();    
}



async function getImageReceipt(trackingCode) {
try{
    const response=await fetch('/show/order/image/receipt/'+encodeURIComponent(trackingCode),{method:'GET',credentials:'same-origin'});
    if(response.ok){
        const blob= await response.blob();
        return {success:true,url:URL.createObjectURL(blob)}

    }

    return await response.json();
}catch(e){
    return { success: false ,e:'faile'};
}
    
}


async function patchSeenOrder(arrTrCode) {
    try{
        const response=await fetch('/order/inbox/seen/',{
            method:'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({ trackingCodes: arrTrCode })
        });
        if(response.ok) return {success:true};
        return {success:false};
    }catch(e){
        return {success:false};
    }
}   



async function getReportOrders(typeReport) {
     try{
            const para=new URLSearchParams;
            if(typeReport) para.append('typeReport',typeReport);            
            const response=await fetch('/order/report/?'+para.toString(),{method:'GET',credentials:'same-origin'});
            res=await response.json();
        return res.result;
     }catch(e){return {success:false}};
}





async function getDataOfVisit() {

    const response=await fetch('/visit',{
        method:'GET',
        headers:{'Content-Type':'application/json'}        
    });

    const result=(await response).json();

    return result;
    
}