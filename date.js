module.exports = getDate;

function getDate(){
    var today = new Date();
    var options = {
        weekday : "long",
        day:"numeric",
        month:"long"
    };
    var day = today.toLocaleDateString("en-US", options);
    return day;
}

 /* var currentday = today.getDay(); */
   /*  var day="";
    switch (currentday) {
        case 0:
            day="sunday"
            break;
        case 1:
            day="monday";
            break;
        case 2:
            day="tuesday";
             break;
        case 3:
            day="wednesday";
            break;
        case 4:
            day="thursday";
            break;
        case 5:
            day="friday";
            break;
        default:
            day="saturday"
            break;
    } */