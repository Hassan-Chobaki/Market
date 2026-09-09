

async function addProduct(formData){



    const response=await fetch(`/product`,{
        method:'POST',
        
        body:formData
    });



  
    const result= await response.json();
   
     return result;




}