import './style.css';
import Proton from "proton-engine";
import MicroModal from 'micromodal';  // es6 module
import axios from 'axios';
// import * as d3 from "d3";

const apiURL2 = 'http://localhost:4000/api/name_increment';
const apiURL3 = 'http://localhost:4000/api/totalSpins';

const api = 'http://localhost:4000/api/';
const nameIncrement = "name_increment";
const totalSpins = "total_spins";
const topNumber = "top_number_leaderboard"

// Initialize the modal
MicroModal.init({
    awaitCloseAnimation: true,// set to false, to remove close animation
    onShow: function(modal) {
      console.log("micromodal open");
    },
    onClose: function(modal) {
      console.log("micromodal close");
    }
  });


// Get my buttons
var add = document.getElementById('add') 
add.onclick = function(){addPerson()};
// Add event listener for the "DELETE" button in the modal
document.getElementById('delete').onclick = function(){deletePerson()};
// Add event listener to the "Save" button inside the modal
document.getElementById('save').onclick = function(){editPerson()};
document.getElementById('clear').onclick = function(){clearWheel()};
document.getElementById('reset').onclick = function(){resetWheel()};
var spinning = false;
var selected_slice = null;
const removeOption = document.getElementById("remove_on_spin")
const notification = document.querySelector("#notif");

// Get and populate total spins
const totalSpinsElem = document.getElementById("totalSpins");
getTotalSpinsDB().then((data)  => {
    if(data){
        totalSpinsElem.textContent = data[0]['totalamount'];
    }
    else{
        totalSpinsElem.textContent = "Can't find out"
    }
});

// Get and populate leaderboard
const leaderboard = document.querySelectorAll(".leaderboard ol li");
getTopLeaders(5).then((data) =>{
    if(data){
        for(let i = 0; i < leaderboard.length; i++){
            leaderboard[i].textContent = `${data[i]['name']} (${data[i]['total']})`;
        }
    }
})


add.addEventListener("keypress", function(event){
    console.log(event);
    if(event.key === 13){
        event.preventDefault();
        add.click();
    }
});
// Add defualt handling of array/ objects to localStorage
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

// Has right version of browser to use local storage
if(localStorage.length < 1){
    localStorage.setObj('data', ['Name here']);
}


var padding = {top:0, right:20, bottom:0, left:20},
w = 450 - padding.left - padding.right,
h = 450 - padding.top  - padding.bottom,
r = Math.min(w, h)/2,
rotation = 0,
oldrotation = 0,
picked = 100000,
oldpick = [],
color = d3.scale.category20(); //category20c()
//randomNumbers = getRandomNumbers();

var svg, container, vis, spinButton, pie, arc, arcs;
renderWheel();


// TODO: figure this out
function renderWheel(){
    oldpick = [];
    var data = localStorage.getObj('data');
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
        .attr("class", "slice")
        .style("scale", "1"); // Set the initial scale to 1


    arcs.append("path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", function (d) { return arc(d); })
        // .data(data)
        .on("mouseover", function(e) {
            if (!spinning){
                var parent = d3.select(this.parentNode);
                var slice = d3.select(this);

                // Change stroke and stroke-width on hover
                slice.style({"stroke":"black", "stroke-width":'2'});

                // Apply smooth scale transition
                parent.transition()
                    .duration(200) // Transition duration in milliseconds
                    .ease("ease-in-out") // Easing function for smooth effect
                    .style({"scale":"1.05"}); // Target scale on hover
                // Raise element by placing it at end of group
                parent.each(function() {  
                    this.parentNode.appendChild(this); 
                    });
            }
        })
        .on("mouseout", function() {
            if (!spinning){
                // Change the background color to red on hover
                d3.select(this.parentNode).transition()
                    .duration(500) // Transition duration in milliseconds
                    .ease("ease-out") // Easing function for smooth effect
                    .style({"scale":"1"}); // Initial scale
                d3.select(this).style({"stroke":"none"});
            }
        })
        .on("click", function(e){
            if (!spinning){
                MicroModal.show('modal-slice-info'); // [1]
                selected_slice = e.data;
                console.log(e);
                document.getElementById('slice_name_input').value = selected_slice;
            }
        });


    // add the text
    arcs.append("text").attr("transform", function(d){
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle)/2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -20) +")";
        })
        .attr("text-anchor", "end")
        .text( function(d, i) {
            return data[i];
            // return localStorage.getItem(localStorage.key(i));
    });

    //make arrow
    svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
    .style({"fill":"black"});


    // Make group for spin button
    spinButton = container
        .append("g");

    //draw spin circle
    spinButton.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style({"fill":"white"})
    .on("mouseover", function() {
        // Change the background color to red on hover
        d3.select(this.parentNode).style({"scale":'1.1', "transition": 'all .2s ease-in-out'});
        d3.select(this).style({"stroke":"black", "stroke-width":"3"});
    })
    .on("mouseout", function() {
        // Restore the background color to white on mouseout
        d3.select(this.parentNode).style({"scale":"1", "transition": 'all .5s ease-out'})
        d3.select(this).style({"stroke":"none"});
    })
    .on("click", spin);

    //spin text
    spinButton.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({"font-weight":"bold", "font-size":"30px"});
}

function spin(d){
    container.on("click", null);
    var data = localStorage.getObj('data');
    if(data.length == 1 && data[0] == "Name here"){
        notification.textContent = "Add a person first";
        return;
    }
    //all slices have been seen, all done
    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if(oldpick.length == data.length){
        console.log("done");
        return;
    }
    
    spinning = true;

    var  ps       = 360/data.length,
        pieslice = Math.round(1440/data.length),
        rng      = Math.floor((Math.random() * 1440) + 360);

    rotation = (Math.round(rng / ps) * ps);

    picked = Math.round(data.length - (rotation % 360)/ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
    
    // Figure out if user wants to remove slice or not

    // FIXME: Okay. I think this is really bad
    // If it does not find a new slice it recursively will call this function
    // This is a garbage way to do this but I am too scared to change things :))
    
    if(removeOption.checked){
        if(oldpick.indexOf(picked) !== -1){
            d3.select(this).call(spin);
            console.log("REPICK");
            return;
        } else {
            oldpick.push(picked);
        }
    }

    rotation += 90 - Math.round(ps/2);


    vis.transition()
    .duration(3000)
    .attrTween("transform", rotTween)
    .each("end", function(){
        //mark slice as seen only if that option is selected
        if(removeOption.checked){
            var selected_elem = d3.selectAll(".slice path").filter(function(d){
                return d.data == data[picked];
            });
            selected_elem.transition()
                .duration(1000)
                .attr("fill", "#111");
        }
        
        //bring up modal and populate it
        MicroModal.show("modal-selected")
        document.getElementById('selected_text').textContent = data[picked];

        // Now increment value selected in our DB
        incrementNameDB(data[picked]).then(() => {
            // Get top 5 people again to see if anything changed
            getTopLeaders(5).then((data) =>{
                if(data){
                    for(let i = 0; i < leaderboard.length; i++){
                        leaderboard[i].textContent = `${data[i]['name']} (${data[i]['total']})`;
                    }
                }
            });
            // Check for new total spins and set text accordingly
            getTotalSpinsDB().then((data)  => {
                if(data){
                    totalSpinsElem.textContent = data[0]['totalamount'];
                }
                else{
                    totalSpinsElem.textContent = "Can't find out"
                }
            });
        });


        // allow slices to be hoverable/ clickable again
        spinning = false;
        oldrotation = rotation;
    });
}


function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function(t) {
        return "rotate(" + i(t) + ")";
    };
}

function addPerson(){
    var text = document.getElementById('add_text').value;
    var data = localStorage.getObj('data');
    if(text === ""){
        notification.textContent = "Please insert something in the text box";
        return;
    }  
    else if(data.includes(text)){
        notification.textContent = "Duplicate name. Try entering something else";
        return;
    }
    else{
        notification.textContent = "";
    } 

    // User is adding first name
    if(data[0] == "Name here"){
        data[0] = text;
    }
    else{
        data.push(text);
    }

    localStorage.setObj('data', data);
    svg.remove();
    renderWheel();
}

function deletePerson(){
    console.log("hey are we getting here");
    var data = localStorage.getObj('data');
    let selected_index = data.indexOf(selected_slice);
    if (selected_index >= 0 && selected_index < data.length){
        data.splice(selected_index,1);
        if(data.length == 0){
            data[0] = "Name here";
        }
    }
    // Close the modal
    MicroModal.close('modal-slice-info');

    localStorage.setObj('data', data);
    resetWheel();
}

function editPerson(){
    console.log('is this happening?');
    // Get the updated text from the input field inside the modal
    var data = localStorage.getObj('data');
    var updatedText = document.getElementById('slice_name_input').value;
    let selected_index = data.indexOf(selected_slice);
    // Check if the picked variable is valid
    if (selected_index >= 0 && selected_index < data.length) {
        // Update the label of the selected slice with the new text
        data[selected_index] = updatedText
        localStorage.setObj('data', data);

        // TODO: in a perfect world this would not reset and rerender the wheel but for times sake, I am using it
        resetWheel();
        
        // Close the modal
        MicroModal.close('modal-slice-info');
    }
}

function showFireworks(running){
    if(running){
        // start the fireworks
    }
    else{
        // stop the fireworks
    }
}

function resetWheel(){
    svg.remove();
    renderWheel();
}

function clearWheel(){
    localStorage.clear();
    localStorage.setObj("data", ["Name here"]);
    // remove wheel
    svg.remove();
    // rerender the wheel
    renderWheel();
}

function incrementNameDB(selectedName){
    return axios.post((api + nameIncrement), {name : selectedName})
    .then(response => {
        console.log('POST request succesful:', response.data);
    })
    .catch(error => {
        console.error('Error making POST request:', error);
    });
}

function getTotalSpinsDB(){
    return axios.get(api + totalSpins)
    .then(response => {
        // Handle the successful response here
        console.log('GET total spins request successful:', response.data);
        return response.data
    })
    .catch(error => {
        // Handle errors here
        console.error('Error fetching GET total spins request:', error);
    });
}
// top is the top number of people we want to fetch
function getTopLeaders(top){
    return axios.get((api + topNumber), {
        params: {
          limit: top
        }
      })
        .then(response => {
            // Handle the successful response here
            console.log('GET request successful:', response.data);
            return response.data
        })
        .catch(error => {
            // Handle errors here
            console.error('Error fetching GET request:', error);
        });
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