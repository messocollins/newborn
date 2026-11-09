// ---- Product data (edit these to change what is sold) ----
const baskets = [
  { id: "wicker", name: "Wicker Basket", emoji: "🧺", price: 399 },
  { id: "box", name: "Gift Box", emoji: "🎁", price: 299 },
  { id: "hamper", name: "Premium Hamper", emoji: "🎀", price: 599 }
];
const clothes = [
  { id: "onesie", name: "Cotton Onesie", price: 249 },
  { id: "romper", name: "Romper", price: 349 },
  { id: "socks", name: "Socks (pair)", price: 99 },
  { id: "cap", name: "Soft Cap", price: 129 },
  { id: "mittens", name: "Mittens", price: 119 },
  { id: "swaddle", name: "Swaddle Blanket", price: 399 }
];
const extras = [
  { id: "toy", name: "Plush toy", price: 299 },
  { id: "card", name: "Handwritten card", price: 49 },
  { id: "wrap", name: "Gift wrapping", price: 99 }
];

// ---- State ----
let selectedBasket = null;
const qty = {};          // clothing id -> quantity
const chosenExtras = {}; // extra id -> true/false

// ---- Helpers ----
const $ = id => document.getElementById(id);
const rupees = n => "₹" + n;

// ---- Render the options ----
function renderBaskets() {
  $("baskets").innerHTML = "";
  baskets.forEach(b => {
    const div = document.createElement("div");
    div.className = "option" + (selectedBasket === b.id ? " selected" : "");
    div.innerHTML = `<span class="emoji">${b.emoji}</span><strong>${b.name}</strong><br>${rupees(b.price)}`;
    div.onclick = () => { selectedBasket = b.id; renderBaskets(); update(); };
    $("baskets").appendChild(div);
  });
}

function renderClothes() {
  $("clothes").innerHTML = "";
  clothes.forEach(c => {
    qty[c.id] = qty[c.id] || 0;
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span>${c.name} – ${rupees(c.price)}</span>
      <span class="qty"><button>−</button><span>${qty[c.id]}</span><button>+</button></span>`;
    const [minus, plus] = row.querySelectorAll("button");
    minus.onclick = () => { if (qty[c.id] > 0) qty[c.id]--; renderClothes(); update(); };
    plus.onclick = () => { qty[c.id]++; renderClothes(); update(); };
    $("clothes").appendChild(row);
  });
}

function renderExtras() {
  extras.forEach(e => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox"> ${e.name} – ${rupees(e.price)}`;
    label.querySelector("input").onchange = ev => { chosenExtras[e.id] = ev.target.checked; update(); };
    $("extras").appendChild(label);
  });
}

// ---- Summary and total ----
function update() {
  let total = 0;
  const lines = [];
  const b = baskets.find(x => x.id === selectedBasket);
  if (b) { lines.push(`${b.name} – ${rupees(b.price)}`); total += b.price; }
  clothes.forEach(c => {
    if (qty[c.id] > 0) {
      const cost = qty[c.id] * c.price;
      lines.push(`${c.name} × ${qty[c.id]} – ${rupees(cost)}`);
      total += cost;
    }
  });
  extras.forEach(e => {
    if (chosenExtras[e.id]) { lines.push(`${e.name} – ${rupees(e.price)}`); total += e.price; }
  });
  $("summaryList").innerHTML = lines.length
    ? lines.map(l => `<li>${l}</li>`).join("")
    : "<li>Nothing selected yet.</li>";
  $("total").textContent = rupees(total);
  $("orderMsg").textContent = "";
}

// ---- Buttons ----
$("orderBtn").onclick = () => {
  if (!selectedBasket) { $("orderMsg").style.color = "#c62828"; $("orderMsg").textContent = "Please choose a basket first."; return; }
  const name = $("babyName").value.trim();
  $("orderMsg").style.color = "#2e7d32";
  $("orderMsg").textContent = "Thank you! Your hamper" + (name ? " for " + name : "") + " has been placed 🎉";
};
$("resetBtn").onclick = () => location.reload();

renderBaskets(); renderClothes(); renderExtras(); update();
