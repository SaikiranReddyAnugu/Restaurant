var itemData;
var tableData;
localStorage.clear();
ready();
function ready() {
    $.getJSON("item.json", function (data) {

        if (localStorage.getItem('items') == null) {
            localStorage.setItem('items', JSON.stringify(data));
            itemsData = data;
        }
        if (localStorage.getItem('tables') == null) {
            tableData = [{ count: 0, bill: 0, items: [] }, { count: 0, bill: 0, items: [] }, { count: 0, bill: 0, items: [] }];
            localStorage.setItem('tables', JSON.stringify(tableData));
        }
        else {
            itemsData = JSON.parse(localStorage.getItem('items'));
            tableData = JSON.parse(localStorage.getItem('tables'));
        }
        display();
        tableDisplay();
    })
}
function display() {
    document.getElementById("items").innerHTML = "";
    $.each(itemsData.items, function (index, value) {
        $("#items").append("<div class='itemBox' id=" + value.id + " draggable='true' ondragstart='drag(event)'><div class='name'>" + value.Name + "</div><div class='cost'>" + value.cost + "</div></div>")
    })
}
function tableDisplay() {
    document.getElementById("tables").innerHTML = "";
    $.each(tableData, function (index, value) {
        // console.log(value.bill);
        var i = Number(index) + 100;
        //console.log(i);
        $("#tables").append("<div class='tableBox ' ondrop='drop(event)' ondragover='allowDrop(event)' id='" + i + "'onclick='modalDisplay()'><div class='name' >Table-" + (index+1) + "</div><div class='cost'>Rs." + value.bill + " | Total items:" + value.count + "</div></div>")
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
    // console.log("sdvb ")
    var data = ev.dataTransfer.getData("text");
    //console.log(data);
    var value;
    if (ev.target.id)
        value = ev.target.id%100;
    else
        value = ev.target.parentElement.id%100;
   // console.log(value);    
    var x = tableData[value];
    var cost = itemsData.items[data - 1].cost;
    var itemname = itemsData.items[data - 1].Name;
    var inc = x.count + 1;
    var amount = x.bill + Number(cost);
    //console.log("items");
    var obj = {};
    var flag;
    if (!tableData[value].items.length == 0) {
        for (x = 0; x < tableData[value].items.length; x++) {
            // console.log(x);
            y = tableData[value].items;
           // console.log(y);
            //  console.log(y[0]);
            if (y[x].item == itemname) {
                var i = y[x].count + 1;
                console.log(i);
                obj = {
                    item: itemname,
                    count: i
                }
                flag = true;
               // console.log("in if");
                y[x] = obj;
               // console.log(y[x]);
            }

            // console.log("after if");
            // console.log(obj);

        }
        if (!flag) {
            obj = {
                item: itemname,
                count: 1
            }
         //   console.log('in else');
            tableData[value].items.push(obj);
        }
    }
    else {
        obj = {
            item: itemname,
            count: 1
        }
        // console.log("item init");
        //console.log(obj);
        tableData[value].items.push(obj);
    }
    tableData[value].count = inc;
    tableData[value].bill = amount;
    // console.log(amount);
    // tableData[value] = { count: inc, bill: amount, items:};
    localStorage.setItem('tables', JSON.stringify(tableData));
    //console.log("tableData")
    //console.log(tableData);
    ready();

}
function modalDisplay(){
var myModal=document.getElementById('modal');
myModal.style.display="block";
if (event.target.id)
value = event.target.id%100;
else
value = event.target.parentElement.id%100;
console.log(value);
document.getElementById("modal-data").innerHTML = "";
document.getElementById("modal-heading").innerHTML = "";
$("#modal-heading").append("<div class='content'>Table"+(value+1)+" | Order Details<button class='close-icon' id='modal-close'></button></div>");
console.log(tableData[value].items);
$.each(tableData[value].items,function(index,val){
    console.log(val);
$("#modal-data").append("<tr><td>1</td><td>Chicken Burger akjfbkjfb</td><td>250</td><td>"+
    "<div class='serving'>Number of servings</div><input type='number'></td>"+
"<td class='delete-icon'><img src='images/delete-icon.png'></td></tr>");})
var btn=document.getElementById('modal-close');
btn.onclick=function(){
    myModal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == myModal) {
    myModal.style.display = "none";
    }
  }
}
