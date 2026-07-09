// App State
let invoiceItems = [];

// DOM Elements
const invoiceForm = document.getElementById("invoice-form");
const itemNameInput = document.getElementById("item-name");
const itemQtyInput = document.getElementById("item-qty");
const itemPriceInput = document.getElementById("item-price");
const invoiceBody = document.getElementById("invoice-body");
const grandTotalDisplay = document.getElementById("grand-total");
const printBtn = document.getElementById("btn-print");

// Handle Form Submission
invoiceForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop page refresh

  // Capture values
  const description = itemNameInput.value;
  const quantity = parseInt(itemQtyInput.value);
  const price = parseFloat(itemPriceInput.value);

  // Validate quantity
  if (isNaN(quantity) || quantity <= 0) {
    alert("Please enter a valid quantity greater than 0.");
    itemQtyInput.focus();
    return;
  }

  // Validate price
  if (isNaN(price) || price <= 0) {
    alert("Please enter a valid price greater than 0.");
    itemPriceInput.focus();
    return;
  }

  // Calculate row total
  const total = quantity * price;

  // Create item object
  const item = {
    id: Date.now(), // unique timestamp ID
    description,
    quantity,
    price,
    total,
  };

  // Add to state and update UI
  invoiceItems.push(item);
  updateInvoice();

  // Reset Form fields
  invoiceForm.reset();
  itemQtyInput.value = 1; // set default back to 1
  itemNameInput.focus();
});

// Delete Item Function
function deleteItem(id) {
  invoiceItems = invoiceItems.filter((item) => item.id !== id);
  updateInvoice();
}

// Update UI (Table & Grand Total)
function updateInvoice() {
  // Clear old rows
  invoiceBody.innerHTML = "";

  let grandTotal = 0;

  // Loop through items and generate HTML rows
  invoiceItems.forEach((item) => {
    grandTotal += item.total;

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
            <td>
                <button class="btn-delete" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
    invoiceBody.appendChild(row);
  });

  // Update Grand Total display
  grandTotalDisplay.innerText = `$${grandTotal.toFixed(2)}`;
}

// Download PDF
function downloadPDF() {
  const invoice = document.querySelector(".invoice-container");
  const opt = {
    margin: 0.5,
    filename: `invoice-${Date.now()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  // Use html2pdf to generate the PDF
  html2pdf().from(invoice).set(opt).save();
}

// Event listener for the print button
printBtn.addEventListener("click", function (e) {
  e.preventDefault();
  downloadPDF();
});
