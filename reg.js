function f(){
    var a = document.forms["myForm"];
    var u = a.user.value;
    var p = a.pass.value;
    
    if(u == "admin" && p == "123"){
        alert("Successful Login");
    } else {
        alert("Please enter valid Password or Username");
    }
}
