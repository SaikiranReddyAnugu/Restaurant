var itemData, tableData;
var currentTarget;
//localStorage.clear();
ready();
function ready() {
    $.getJSON("item.json", function (data) {

        if (localStorage.getItem('items') == null) {
            localStorage.setItem('items', JSON.stringify(data));
            itemsData = data;
        }
        else {
            itemsData = JSON.parse(localStorage.getItem('items'));
        }

        if (localStorage.getItem('tables') == null) {
            tableData = [{ count: 0, bill: 0, items: [] }, { count: 0, bill: 0, items: [] }, { count: 0, bill: 0, items: [] }];
            localStorage.setItem('tables', JSON.stringify(tableData));
        }
        else {

            tableData = JSON.parse(localStorage.getItem('tables'));
        }
        display();
        tableDisplay();
    })
}
function display() {
    document.getElementById("items").innerHTML = "";
    $.each(itemsData.items, function (index, val) {
        $("#items").append("<div class='itemBox' id=" + val.id + " draggable='true' ondragstart='drag(event)' name='" + val.Name + "'><div class='name'>" + val.Name + "</div><div class='cost'>" + val.cost + "</div></div>")
    })
}
function tableDisplay() {
    document.getElementById("tables").innerHTML = "";
    $.each(tableData, function (index, val) {
        var i = Number(index) + 100;
        $("#tables").append("<div class='tableBox ' ondrop='drop(event)' ondragover='allowDrop(event)' name='Table-" + (index + 1) + "' id='" + i + "'onclick='modalDisplay(event)' >Table-" + (index + 1) +
            "<br>Rs." + val.bill + " | Total items:" + val.count + "</div>")
    })
}
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
// obj={
// item:"xyz",
// count:1
// }
// tableData[0].items.push(obj);
// console.log(tableData[0]);

function drop(ev) {
    var data = ev.dataTransfer.getData("text");
    var value;
    value = ev.target.id % 100;
    var tabledata = tableData[value];
    var cost = itemsData.items[data - 1].cost;
    var itemname = itemsData.items[data - 1].Name;
    var inc;
    var amount = tabledata.bill + Number(cost);
    var obj = {};
    var flag;
    if (!tableData[value].items.length == 0) {
        for (x = 0; x < tableData[value].items.length; x++) {
            y = tableData[value].items;
            if (y[x].item == itemname) {
                var i = y[x].count + 1;
                obj = {
                    item: itemname,
                    count: i,
                    cost: cost
                }
                inc = tabledata.count;
                flag = true;
                y[x] = obj;
            }
        }
        if (!flag) {
            obj = {
                item: itemname,
                count: 1,
                cost: cost
            }
            inc = tabledata.count + 1;
            tableData[value].items.push(obj);
        }
    }
    else {
        obj = {
            item: itemname,
            count: 1,
            cost: cost
        }
        inc = tabledata.count + 1;
        tableData[value].items.push(obj);
    }
    tableData[value].count = inc;
    tableData[value].bill = amount;
    localStorage.setItem('tables', JSON.stringify(tableData));
    ready();

}
function modalDisplay(event) {
    currentTarget = event;
    var modalvalue = event.target.id % 100;
    modalDataDisplay(modalvalue);
   
}
function modalDataDisplay(modalindex) {
    var myModal = document.getElementById('modal');
    var backgroundstyle=document.getElementById(modalindex+100);
    backgroundstyle.style.backgroundColor="yellow";
    myModal.style.display = "block";
    document.getElementById("modal-data").innerHTML = "";
    document.getElementById("modal-heading").innerHTML = "";
    document.getElementById("modal-footer").innerHTML = "";
    tableData[modalindex].bill = 0;
    tableData[modalindex].count = 0;
    $("#modal-heading").append("<div class='content'>Table" + (modalindex + 1) + " | Order Details<button class='close-icon' id='modal-close'></button></div>");
    $.each(tableData[modalindex].items, function (index, val) {
        //console.log(val.item);
        tableData[modalindex].bill = tableData[modalindex].bill + val.count * val.cost;
        tableData[modalindex].count += 1;
        $("#modal-data").append("<tr><td>" + (index + 1) + "</td><td>" + val.item + "</td><td>" + val.cost + "</td><td>" +
            "<div class='serving'>Number of servings</div><input type='number'  id='noOfServings' onchange='noOfServings(this.value," + index + ","+modalindex+")' value='" + val.count + "'></td>" +
            "<td class='delete-icon' onclick='deleteItem(" + index + ","+modalindex+")'><img src='images/delete-icon.png'></td></tr>");

    })
    $("#modal-data").append("<tr><td></td><td></td><td>Total Bill</td><td>" + tableData[modalindex].bill + "</td></tr>");
    $("#modal-footer").append("<button class='footer' onclick='closeSession("+modalindex+")'>CLOSE SESSION(GENERATEBILL)</button>");
    localStorage.setItem('tables', JSON.stringify(tableData));
    var btn = document.getElementById('modal-close');
    btn.onclick = function () {
        tableBackground(modalindex);
    }
    var itemDeleteBtn = document.getElementById("delete-item");
    window.onclick = function (event) {
        if (event.target == myModal) {
           tableBackground(modalindex);
        }
    }
}
function tableBackground(index){
    var myModal = document.getElementById('modal');
    var backgroundstyle=document.getElementById(index+100);
    myModal.style.display = "none";
    backgroundstyle.style.backgroundColor="white";
}
function closeSession(index) {
    tableData[index].items.splice(0);
    // localStorage.setItem('tables', JSON.stringify(tableData));
    modalDataDisplay(index);
    tableBackground(index);
    document.getElementById(index + 100).innerHTML = "Table-" + (index + 1) + "<br>Rs." + tableData[index].bill + " | Total items:" + tableData[index].count;
}
function deleteItem(item,index) {
    tableData[index].items.splice(item, 1);
    // localStorage.setItem('tables', JSON.stringify(tableData));
    modalDataDisplay(index);
    document.getElementById(index + 100).innerHTML = "Table-" + (index + 1) + "<br>Rs." + tableData[index].bill + " | Total items:" + tableData[index].count;
}
function noOfServings(val, item,index) {
    if (val < 0 || val=="") {
        alert("invalid input value");
    }
    else {
        tableData[index].items[item].count = val;
        //localStorage.setItem('tables', JSON.stringify(tableData));
        modalDataDisplay(index);
        document.getElementById(index + 100).innerHTML = "Table-" + (index + 1) + "<br>Rs." + tableData[index].bill + " | Total items:" + tableData[index].count;
    }
}
function tablefilter() {
    var data = document.getElementById("tableSearch");
    var filter = data.value.toUpperCase();
    var table = document.getElementById("tables");
    var tables = table.children;
    for (i = 0; i < tables.length; i++) {
        if (tables[i].getAttribute("name").toUpperCase().indexOf(filter) > -1)
            tables[i].style.display = "";
        else
            tables[i].style.display = "none";

    }
}
function itemfilter() {
    var data = document.getElementById("itemSearch");
    var filter = data.value.toUpperCase();
    var table = document.getElementById("items");
    var tables = table.children;
    for (i = 0; i < tables.length; i++) {
        if (tables[i].getAttribute("name").toUpperCase().indexOf(filter) > -1)
            tables[i].style.display = "";
        else
            tables[i].style.display = "none";
    }
}