const loginForm=document.getElementById('loginForm');




    loginForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const msg=document.getElementById('msg');
        const userName=document.getElementById('inpUserName').value;
        const pass=document.getElementById('inpPass').value;
            
            
           if( userName==='' || pass===''){
                msg.textContent='لطفا فرم را کامل کنید';
                return;
            }
           
           
           if(userName==='a' && pass==='a')
                window.location.href='/admin/dashbord.html';
            else                
                msg.textContent='اطلااعات وارد شده صحیح نمیباشد';           
            
            

    });

