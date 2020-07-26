const checkUrl = () =>{

    const location = window.location.pathname;

    const element = document.getElementById(location);

    element.classList.add("active");

}

window.onload = () =>{
    checkUrl();
}