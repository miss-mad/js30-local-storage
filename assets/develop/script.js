const addItems = document.querySelector(".add-items");
const itemsList = document.querySelector(".plates");
// store all data in an array of objects which has the name of the array as well as the status (checked off or not)
// try to get items from local storage and if not there, default to populating an empty array
const items = JSON.parse(localStorage.getItem("items")) || [];

function addItem(e) {
  // page refreshes without preventing default (otherwise, can check 'preserve log' in console to see the console.logged message)
  // normally when a form is submitted the page reloads to send the data to the server but we are only working on the client side for this simple app so prevent reloading and keep it on client side
  e.preventDefault();
  console.log("hello from line 63");
  // capture text from input box and put into object
  // 'this' points to the form tag and we look inside that form tag for something that has a name attribute of 'item'
  const text = this.querySelector("[name=item]").value;
  const item = {
    text, // this is the ES6 version shortcut; can also read as 'text: text' using the variable created on line 69
    done: false, //default unchecked
  };
  console.log(item);
  // takes item from form and pushes it into the items array
  items.push(item);
  populateList(items, itemsList);

  // can only use strings in local storage; if object, it just shows an object
  console.log(JSON.stringify(items));
  localStorage.setItem("items", JSON.stringify(items));

  // clears the form input by using the form element method called 'reset'
  this.reset();
}
// plates default = empty object bc if, for some reason, you forget to pass in something, it won't break but instead will loop over nothing and the map function will still work
// want to make this function resilient to allow for us to pass in any array of plates and any destination HTML element and it will still work
function populateList(plates = [], platesList) {
  // place this directly inside the HTML
  // map takes in an array of raw data and returns an array of some other data
  platesList.innerHTML = plates
    .map((plate, i) => {
      // link the input and label by making the id and the for the same thing (i)
      return `
            <li>
              <input type="checkbox" data-index=${i} id="item${i}" ${
        plate.done ? "checked" : ""
      }>
              <label for="item${i}">${plate.text}</label>
            </li>
            `;
    })
    // .join("") turns the array that .map returns into a big string
    .join("");
}

// persist the checked or unchecked state of the checkboxes when page refreshes
function toggleDone(e) {
  console.log(e.target);
  // check if target matches what we're looking for
  if (!e.target.matches("input")) return; // skip this unless it's an input
  const el = e.target;
  // this is why we put a data-index on each of the checkboxes
  // this console.log tells you the index of the corresponding item in the array
  console.log(el.dataset.index);
  const index = el.dataset.index;
  // setting the done true/false opposite to itself
  items[index].done = !items[index].done;
  // store the checked property in local storage
  localStorage.setItem("items", JSON.stringify(items));
  // visually update what's on the page
  populateList(items, itemsList);
}

// the idea behind event delegation is rather than listening for a click or change on the checkboxes directly, we look for somebody who is going to be on the page at the time of listening
// event delegation = very responsible parents + very negligible children who don't listen
// hey parent, please pass on this click to your child if it's for one of them. it might be for an existing child, or for a child that's created in the future but you're the one responsible for them so please pass it along to the right child

// local storage = object in the browser that shows data that's been saved to this domain particular to this computer, browser and website; saves text to the browser and when page reloaded, can grab the text

// grab form element and listen for submit event (not just listen for click on 'Add Item' - listening for submit is more all-encompassing)
// if you add event listeners to something that doesn't exist, you'll know that in the future, it won't be checked - so event delegation can fix that
addItems.addEventListener("submit", addItem);
itemsList.addEventListener("click", toggleDone);

populateList(items, itemsList);
