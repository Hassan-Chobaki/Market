//**********************************************************************  A P I  */



async function addProduct(formData) {

try{
    const response = await fetch(`/product`, {
        method: 'POST',

        body: formData
    });


    const result = await response.json();

    return result;
}catch(error){return {rep:'repeate'}}



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