const loginForm=document.getElementById('loginForm');




    loginForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const msg=document.getElementById('msg');
        const userName=document.getElementById('inpUserName').value;
        const pass=document.getElementById('inpPass').value;
            
            
           if( userName==='' || pass===''){
                msg.textContent='لطفا فرم را کامل کنید';
                return;
            }

const data={userName:userName,password:pass};

const response=await fetch('/loginAADDMMIINN',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});

          const welcome=await response.json();
           if(welcome.ok)
                window.location.href='/admin/dashbord.html';
            else                
                msg.textContent='اطلااعات وارد شده صحیح نمیباشد';           
            
            

    });

