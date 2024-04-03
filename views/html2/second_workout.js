const total_language=document.querySelectorAll('.tech')
console.log(total_language);

total_language.forEach((language)=>{
    for(let i=2;i<5;i++){
        document.getElementById(i).style.display="none"
    }
    language.addEventListener('focus',()=>{
        const current_id=language.getAttribute("data-id")
        console.log(current_id);
        for(let i=1;i<5;i++){
            if(current_id==i){
                document.getElementById(current_id).style.display=""
            }else{
                document.getElementById(i).style.display="none"
            }
        }
    })
})

function Left(){
    document.getElementById("scrollRow").scrollLeft-=100;
}
function Right(){
    document.getElementById("scrollRow").scrollLeft+=100;
}