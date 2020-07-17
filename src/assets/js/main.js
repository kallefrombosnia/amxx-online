let files = null;

const checkUrl = () =>{

    const location = window.location.pathname;

    const element = document.getElementById(location);

    element.classList.add("active");

}

const includeCheck = () =>{

    document.getElementById('incFile').onchange = function() {

        $('.incCacheButton').show();

        files = this.files;
   
    };
}

const saveIncCache = () =>{

    document.getElementsByClassName('incCacheButton')[0].onclick = function(){

        if (files.length === 0) {
            console.log('No file is selected');
            return;
        }
    
        var reader = new FileReader();

        reader.onload = function(event) {

            console.log('File content:', event.target.result);

            const fileName = $('#incFile').val().split('\\').pop();

            const cachedInc = [{
                "type": "includeCached",
                "value": event.target.result,
                "active": true
            }];

            localStorage.setItem(fileName, JSON.stringify(cachedInc));

            $('.incCacheButton').hide();

            $("#cachedIncList").append(`<li class="list-group-item">${fileName}</li>`);

        };

        reader.readAsText(files[0]);
    }
}

window.onload = () =>{
    checkUrl();
    includeCheck();
    saveIncCache();
}

$('#incFile').on('change', function() {
    //find all class called posted with child called dn, then hide them all
    //$('.posted .dn').hide();
    //find this clicked div, find a child called dn and show it
    //$(this).find('.dn').show();
    console.log('choosen file')
  });