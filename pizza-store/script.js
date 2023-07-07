const searcForm = document.querySelector(".search-form");

console.log(searcForm);

const searchBtn = document.querySelector("#search-btn");

searchBtn.addEventListener("click",function(){
    searcForm.classList.toggle("active");
    document.addEventListener("click",function(e){
        if(!e.composedPath().includes(searchBtn) && !e.composedPath().includes(searchForm)){
            searcForm.classList.remove("active");
        }
    })
});

const cartItem = document.querySelector(".cart-item");
const cartBtn = document.querySelector("#search-btn");
