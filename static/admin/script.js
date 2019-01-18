

function ajaxReq(url, callback){
    var formData = JSON.stringify($("#LoginForm").serializeArray());
    $.ajax({
        url: url,
        type: 'POST',
        contentType:'application/json',
        data: formData,
        dataType:'json'
    }).done(callback);
}
commands=[];
function sendForm () {
    ajaxReq("/EnterAdmin/", function(msg){
            if (msg != 'fake') {
                $('#loginformFull').fadeOut();
                $('#CommandsBox').fadeIn();
            }
            else  $('#errorMessage').html(" Неправильный логин или пароль");
    })

}
function GetNowTAble(){
    ajaxReq("/SendAmdinEventsCurrent/", function(msg){
        if (msg != 'fake') {
            $('#loginformFull').fadeOut();
            $('#CommandsBox').fadeIn();
            vivod(msg);
        }
        else  $('#errorMessage').html(" Неправильный логин или пароль");
    })
}
function GetFullTAble() {
    ajaxReq("/SendAmdinEventsFull/", function(msg){
        if (msg != 'fake') {
            $('#loginformFull').fadeOut();
            $('#CommandsBox').fadeIn();
            vivod(msg);
        }
        else  $('#errorMessage').html(" Неправильный логин или пароль");
    })
}

function vivod(msg){
    $("#table tr").remove();
    var table = document.getElementById("table");
    msg.map(function(command) {
        var row = table.insertRow(0);
        var cell = row.insertCell(0);
        if(command.KGID){
            cell.innerHTML = "роб";
        }else{
            cell.innerHTML = "ЧЕЛ";
        }
        var cell = row.insertCell(1);
        cell.innerHTML = "<button onclick='removethis("+command.EventId+")' >X Убрать</button>";
        var cell = row.insertCell(2);
        cell.innerHTML = command.EventId;

        var cell = row.insertCell(3);
        cell.innerHTML = command.KGID;

        var cell = row.insertCell(4);
        cell.innerHTML = command.CreatorId;

        var cell = row.insertCell(5);
        cell.innerHTML = command.Name;

        var cell = row.insertCell(6);
        cell.innerHTML = command.Category;

        var cell = row.insertCell(7);
        cell.innerHTML = command.DateofAdd;

        var cell = row.insertCell(8);
        cell.innerHTML = command.Sex;

        var cell = row.insertCell(9);
        cell.innerHTML = command.Description;

        var cell = row.insertCell(10);
        cell.innerHTML = command.CoupleDateStart;

        var cell = row.insertCell(11);
        cell.innerHTML = command.CoupleDateEnd;

        var cell = row.insertCell(12);
        cell.innerHTML = command.SoloDate;

        var cell = row.insertCell(13);
        cell.innerHTML = command.CoupleTimeStart;

        var cell = row.insertCell(14);
        cell.innerHTML = command.CoupleTimeEnd;

        var cell = row.insertCell(15);
        cell.innerHTML = command.PeopleCount;

        var cell = row.insertCell(16);
        cell.innerHTML = command.Peoples;

        var cell = row.insertCell(17);
        cell.innerHTML = command.AgeRange;

        var cell = row.insertCell(18);
        cell.innerHTML = "<a href="+command.PhotoURL+" target='_blank'>КЛАЦ</a>";

        var cell = row.insertCell(19);
        cell.innerHTML = command.URLtoEvent;

        var cell = row.insertCell(20);
        cell.innerHTML = command.Location;


		/* var names=Object.keys(command)
		 console.log(names);
		 for (i=0;i<17;i++){
		 var cell = row.insertCell(i);
		 console.log(command[names[i]])
		 cell.innerHTML = command[names[i]];
		 } */
    });
}
function removethis(id) {
    if (confirm("Вы уверены что хотите удалить это событие??????") == true) {

    	var sendData=($("#LoginForm").serializeArray())
		sendData.push({value:id});
	$.ajax({
            url: "/RemoveEventFromList/",
            type: 'POST',
            contentType:'application/json',
            data: JSON.stringify(sendData),
            dataType:'json'
        }).done( function(msg){
            if (msg != 'fake') {
                $('#loginformFull').fadeOut();
                $('#CommandsBox').fadeIn();
                $(".alert").removeClass("in").show().delay(200).addClass("in").fadeOut(5000);

            }
            else  $('#errorMessage').html(" Неправильный логин или пароль");
        })
    }


}

