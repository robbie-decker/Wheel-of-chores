import './style.css';
import Proton from "proton-engine";

// import * as d3 from "d3";

// Get my buttons
var add = document.getElementById('add') 
add.onclick = function(){addPerson()};
document.getElementById('delete').onclick = function(){deletePerson()};
document.getElementById('clear').onclick = function(){clearWheel()};


add.addEventListener("keypress", function(event){
    console.log(event);
    if(event.key === 13){
        event.preventDefault();
        add.click();
    }
});
var data = []
if (typeof(Storage) !== "undefined"){
    // Has right version of browser to use local storage
    if(localStorage.length < 1){
        // data.push({"label" : "Your name goes here"})
        localStorage.setItem('first', 'Your name goes here');
    }
}
else{
    //can not keep info
}
var padding = {top:20, right:40, bottom:0, left:0},
w = 500 - padding.left - padding.right,
h = 500 - padding.top  - padding.bottom,
r = Math.min(w, h)/2,
rotation = 0,
oldrotation = 0,
picked = 100000,
oldpick = [],
color = d3.scale.category20(); //category20c()
//randomNumbers = getRandomNumbers();

for(var x = 0; x < localStorage.length; x++){
    console.log("hi there");
    // console.log(localStorage.getItem(localStorage.key(x)));
}
console.log(localStorage);
console.log(localStorage.key(0));
console.log(localStorage.length);

var svg, container, vis, pie, arc, arcs;
renderWheel();

// Move info from localStorage into data
function parseStorage(){
    data = []
    for(var x = 0; x < localStorage.length; x++){
        data.push({"label" : localStorage.getItem(localStorage.key(x))});
    }
    console.log("just parsed");
    console.log(data);
    console.log(localStorage);
}

function removeExistingItem(key) {
    if (localStorage.getItem(key) === null)
        return false;
    localStorage.removeItem(key);
    return true;
}

// TODO figure this out
function renderWheel(){
    parseStorage();
    svg = d3.select('#chart')
        .append("svg")
        .data([data])
        .attr("width",  w + padding.left + padding.right)
        .attr("height", h + padding.top + padding.bottom);

    container = svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

    vis = container
        .append("g");

    pie = d3.layout.pie().sort(null).value(function(d){return 1;});

    // declare an arc generator function
    arc = d3.svg.arc().outerRadius(r);

    // select paths, use arc generator to draw
    arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice");


    arcs.append("path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", function (d) { return arc(d); });

    // add the text
    arcs.append("text").attr("transform", function(d){
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle)/2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
        })
        .attr("text-anchor", "end")
        .text( function(d, i) {
            return data[i].label;
            // return localStorage.getItem(localStorage.key(i));
    });

    container.on("click", spin);
    container.on("mouseover", () => {
        console.log("we are hovering");
    });
    const test = d3.select("#tester")
    test.on("mouseover", () =>{
        console.log("testing now");
    });

        //make arrow
    svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
    .style({"fill":"black"});

    //draw spin circle
    container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style({"fill":"white"})
    .on("mouseover", function() {
        d3.select(this).style({"stroke":"black", "stroke-width":"3", "scale":'1.1'}); // Change the background color to red on hover
    })
    .on("mouseout", function() {
        d3.select(this).style({"fill":"white", "stroke":"none", "scale":"1"}); // Restore the background color to white on mouseout
    });

    //spin text
    container.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({"font-weight":"bold", "font-size":"30px"});
}

function spin(d){
    container.on("click", null);

    //all slices have been seen, all done
    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if(oldpick.length == data.length){
        console.log("done");
        container.on("click", null);
        return;
    }

    var  ps       = 360/data.length,
        pieslice = Math.round(1440/data.length),
        rng      = Math.floor((Math.random() * 1440) + 360);

    rotation = (Math.round(rng / ps) * ps);

    picked = Math.round(data.length - (rotation % 360)/ps);
    picked = picked >= data.length ? (picked % data.length) : picked;


    if(oldpick.indexOf(picked) !== -1){
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }

    rotation += 90 - Math.round(ps/2);

    vis.transition()
    .duration(3000)
    .attrTween("transform", rotTween)
    .each("end", function(){
        //mark slice as seen
        d3.select(".slice:nth-child(" + (picked + 1) + ") path")
            .attr("fill", "#111");

        //populate div
        window.alert(data[picked].label + " Has to do the thing");
        // d3.select("#name h1")
        //     .text(data[picked].label + " has to do the thing D:");

        oldrotation = rotation;

        container.on("click", spin);
    });
}


function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function(t) {
        return "rotate(" + i(t) + ")";
    };
}

function addPerson(){
    oldpick = [];
    var text = document.getElementById('add_text').value;
    console.log(text);
    if(text === ""){
        document.querySelector("#notif").innerHTML = "Please insert something in the text box";
        return;
    }  
    else{
        document.querySelector("#notif").innerHTML = "";
    } 

    // User is adding first name
    if(localStorage.getItem("first") == "Your name goes here"){
        localStorage.removeItem("first");
    }

    svg.remove();
    localStorage.setItem(text, text)
    // data.push({"label": text, "name": "extra words"});
    renderWheel();
}

function deletePerson(){
    oldpick = [];
    var text = document.getElementById('delete_text').value;
    if(text === ""){
        document.querySelector("#notif").innerHTML = "Please insert something in the text box";
        return;
    }
    if(!removeExistingItem(text)){
        document.querySelector("#notif").innerHTML = "That does not exist in wheel";
        return;
    }
    else{
        document.querySelector("#notif").innerHTML = "";
    }
    svg.remove();
    console.log("hey are we getting here");
    localStorage.removeItem(text);
    if(localStorage.length == 0){
        localStorage.setItem('first', 'Your name goes here');
    }
    renderWheel();
}

function clearWheel(){
    localStorage.clear();
    localStorage.setItem("first", "Your name goes here");
    data = []
    svg.remove();
    renderWheel();

}

function getRandomNumbers(){
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

    if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
        window.crypto.getRandomValues(array);
        console.log("works");
    } else {
    //no support for crypto, get crappy random numbers
        for(var i=0; i < 1000; i++){
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}