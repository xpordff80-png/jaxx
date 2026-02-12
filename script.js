let currentStep=1;
const wallets={usdt:"0x846e726b8d7c3c59e7fc9fe320647e6a99033eff", btc:"bc1qexamplebtcaddress0000000000000000000"};

// Loading Screen
window.onload = function(){
    setTimeout(()=>{document.getElementById('loadingScreen').style.display='none';},2000);
}

function showToast(message){
    const toast=document.getElementById('toast');
    toast.innerText=message;
    toast.style.display='block';
    setTimeout(()=>{toast.style.display='none';},2500);
}

function nextStep(step){
    const container=document.querySelector('.wizard-container');
    container.classList.add('flash'); container.classList.add('shake');
    setTimeout(()=>{container.classList.remove('flash'); container.classList.remove('shake');},300);

    if(step===1){
        const amount=parseFloat(document.getElementById('amount').value);
        if(isNaN(amount)||amount<50||amount>5000){alert("Please enter a valid amount between 50 and 5000."); return;}
    }
    if(step===2){
        const name=document.getElementById('name').value;
        const email=document.getElementById('email').value;
        const bank=document.getElementById('bank').value;
        if(!name||!email||!bank){alert("Please fill in all fields."); return;}
    }

    document.getElementById(`step${step}`).classList.remove('active');
    currentStep++; document.getElementById(`step${currentStep}`).classList.add('active');

    document.querySelectorAll('.progress-step').forEach((el,i)=>{
        if(i<currentStep) el.classList.add('active'); else el.classList.remove('active');
    });

    if(currentStep===3){
        const currency=document.getElementById('currency').value;
        document.getElementById('walletInfo').innerText=wallets[currency];
        showToast("Wallet address displayed!");
    }
}

function copyWallet(){
    const text=document.getElementById('walletInfo').innerText;
    navigator.clipboard.writeText(text).then(()=>{showToast("Wallet address copied!");});
}

function submitForm(){
    const proof=document.getElementById('proof').files[0];
    if(!proof){alert("Please select a proof image."); return;}
    document.getElementById('timer').innerHTML="Countdown: 10:00";
    document.getElementById('transactionStatus').innerText="Transaction Status: Processing...";
    let time=10*60;
    const timerInterval=setInterval(()=>{
        const minutes=Math.floor(time/60);
        const seconds=time%60;
        document.getElementById('timer').innerHTML=`Countdown: ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        time--;
        if(time<0){clearInterval(timerInterval);document.getElementById('timer').innerHTML="Time's up!"; document.getElementById('transactionStatus').innerText="Transaction Status: Completed";}
    },1000);
    showToast("Your data has been submitted. Request will be processed shortly.");
}

/* ======= 3D Snow ======= */
const canvas=document.getElementById('snowCanvas'); const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth; canvas.height=window.innerHeight;
let snowflakes=[]; const layers=3;
for(let l=1;l<=layers;l++){for(let i=0;i<100;i++){snowflakes.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*3+1,d:Math.random()*l,layer:l});}}
let angle=0;
function drawSnow(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="white";ctx.beginPath();snowflakes.forEach(f=>{ctx.moveTo(f.x,f.y);ctx.arc(f.x,f.y,f.r,0,Math.PI*2,true);});ctx.fill();moveSnow();}
function moveSnow(){angle+=0.01;snowflakes.forEach(f=>{f.y+=Math.pow(f.d,1)+0.5*f.layer; f.x+=Math.sin(angle)*f.layer; if(f.y>canvas.height)f.y=0; if(f.x>canvas.width)f.x=0; if(f.x<0)f.x=canvas.width;}); requestAnimationFrame(drawSnow);}
drawSnow();

