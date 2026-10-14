
import { pipeline, env } from
  "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

env.allowLocalModels = false;

const MODEL = "Xenova/Qwen1.5-0.5B-Chat";

let generator = null;
let loadingPromise = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function notify(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

function updateStats() {
  const docs = getDocuments();
  $("#savedCount").textContent = docs.length;
  $("#aiStat").textContent = generator ? "Ready" : "Local AI";
}

function getDocuments() {
  try {
    return JSON.parse(localStorage.getItem("hustlekit_docs") || "[]");
  } catch {
    return [];
  }
}

function setDocuments(docs) {
  localStorage.setItem("hustlekit_docs", JSON.stringify(docs));
  updateStats();
}

function navigate(page) {
  $$(".page").forEach(section => {
    section.classList.toggle("hidden", section.id !== page);
  });

  $$(".nav").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  const active = $(`.nav[data-page="${page}"]`);
  $("#pageTitle").textContent =
    active ? active.textContent.replace(/^[⌂✧◎✉▤▣]\s*/, "").trim()
    : page.charAt(0).toUpperCase() + page.slice(1);

  if (page === "saved") renderSaved();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$(".nav").forEach(button => {
  button.addEventListener("click", () => navigate(button.dataset.page));
});

$$("[data-goto]").forEach(button => {
  button.addEventListener("click", () => navigate(button.dataset.goto));
});

// Load the open-weight model only when the user requests AI.
async function getGenerator() {
  if (generator) return generator;
  if (loadingPromise) return loadingPromise;

  $("#modelStatus").textContent = "Downloading model…";
  $(".dot").style.background = "#f0ad49";

  loadingPromise = pipeline("text-generation", MODEL, {
    quantized: true
  });

  try {
    generator = await loadingPromise;
    $("#modelStatus").textContent = "Local AI ready";
    $(".dot").style.background = "#38b879";
    updateStats();
    return generator;
  } catch (error) {
    loadingPromise = null;
    $("#modelStatus").textContent = "AI unavailable";
    $(".dot").style.background = "#e45d6a";
    console.error("Model loading failed:", error);
    throw new Error(
      "AI model could not load. Check your internet connection, model availability and browser compatibility."
    );
  }
}

async function generateText(prompt) {
  const model = await getGenerator();

  const result = await model(prompt, {
    max_new_tokens: 180,
    do_sample: true,
    temperature: 0.7,
    repetition_penalty: 1.1
  });

  const text = result?.[0]?.generated_text;
  if (typeof text !== "string") {
    throw new Error("The model returned no usable text.");
  }

  // Remove the prompt if the model repeats it.
  return text.slice(prompt.length).trim() || text.trim();
}

async function handleAIForm(event, outputId, makePrompt) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector('[type="submit"]');
  const output = document.getElementById(outputId);
  const data = Object.fromEntries(new FormData(form).entries());

  button.disabled = true;
  button.textContent = "Generating…";
  output.textContent =
    "Loading the open-weight model and generating your content. The first load may take a while.";

  try {
    const prompt = makePrompt(data);
    output.textContent = await generateText(prompt);
    notify("Content generated successfully.");
  } catch (error) {
    console.error(error);
    output.textContent = `Generation failed: ${error.message}\n\nPlease retry when the model is available.`;
    notify("Could not generate content.");
  } finally {
    button.disabled = false;
    button.textContent = button.dataset.originalText ||
      button.textContent.replace("Generating…", "Generate");
  }
}

$$("form").forEach(form => {
  const button = form.querySelector('[type="submit"]');
  if (button) button.dataset.originalText = button.textContent;
});

$("#productForm").addEventListener("submit", event =>
  handleAIForm(event, "productOutput", d =>
    `You are a helpful ecommerce copywriter.
Write a product description using only the supplied facts.
Do not invent product specifications or make unsupported claims.
Return a title, short description, detailed description, selling points, and call to action.
Product: ${d.name}
Category: ${d.category || "Not specified"}
Price: ${d.price ? "INR " + d.price : "Not specified"}
Features: ${d.features}
Audience: ${d.audience || "General customers"}
Tone: ${d.tone}
Write in clear, professional English.`
  )
);

$("#socialForm").addEventListener("submit", event =>
  handleAIForm(event, "socialOutput", d =>
    `You are a small-business social media copywriter.
Create one engaging social media post with relevant hashtags and a call to action.
Do not invent discounts, offers, or product facts.
Business: ${d.business}
Product/service: ${d.service}
Platform: ${d.platform}
Goal: ${d.goal}
Tone: ${d.tone}
Make the post easy to copy and publish.`
  )
);

$("#messageForm").addEventListener("submit", event =>
  handleAIForm(event, "messageOutput", d =>
    `You are a professional business communication assistant.
Write a ready-to-send ${d.type} message.
Recipient: ${d.recipient}
Service/project: ${d.service}
Additional details: ${d.details || "None provided"}
Tone: ${d.tone}
Do not invent prices, deadlines, promises, or agreements.
Include a suitable greeting and sign-off.`
  )
);

// Copy output.
$$("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const text = document.getElementById(button.dataset.copy).innerText;
    try {
      await navigator.clipboard.writeText(text);
      notify("Copied to clipboard.");
    } catch {
      notify("Clipboard unavailable. Select and copy the text manually.");
    }
  });
});

// Save generated output locally.
$$("[data-save]").forEach(button => {
  button.addEventListener("click", () => {
    const content = document.getElementById(button.dataset.save).innerText;
    if (!content.trim() || content.includes("will appear here") ||
        content.includes("generation failed")) {
      notify("Generate some content first.");
      return;
    }

    const docs = getDocuments();
    docs.unshift({
      id: Date.now(),
      title: button.dataset.save.replace("Output", "") + " document",
      content,
      date: new Date().toLocaleString()
    });

    setDocuments(docs);
    notify("Document saved on this device.");
  });
});

function renderSaved() {
  const list = $("#savedList");
  const docs = getDocuments();
  list.replaceChildren();

  if (!docs.length) {
    list.textContent = "No saved documents yet. Create something to get started.";
    return;
  }

  docs.forEach(doc => {
    const card = document.createElement("article");
    card.className = "saved-item";

    const details = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = doc.title;
    const date = document.createElement("p");
    date.textContent = doc.date;
    details.append(title, date);

    const actions = document.createElement("div");
    const open = document.createElement("button");
    open.className = "secondary";
    open.textContent = "Open";
    open.addEventListener("click", () => {
      const viewer = window.open("", "_blank");
      if (!viewer) {
        notify("Allow pop-ups to open this document.");
        return;
      }
      const pre = viewer.document.createElement("pre");
      pre.style.cssText =
        "white-space:pre-wrap;overflow-wrap:anywhere;font:16px sans-serif;padding:24px";
      pre.textContent = doc.content;
      viewer.document.body.appendChild(pre);
      viewer.document.title = doc.title;
    });

    const remove = document.createElement("button");
    remove.className = "secondary";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      setDocuments(getDocuments().filter(item => item.id !== doc.id));
      renderSaved();
      notify("Document deleted.");
    });

    actions.append(open, remove);
    card.append(details, actions);
    list.append(card);
  });
}

$("#clearSaved").addEventListener("click", () => {
  if (!confirm("Delete all locally saved documents?")) return;
  setDocuments([]);
  renderSaved();
  notify("All documents deleted.");
});

// Invoice and quotation calculations.
$("#invoiceForm").addEventListener("submit", event => {
  event.preventDefault();

  const form = event.currentTarget;
  const d = Object.fromEntries(new FormData(form).entries());

  const quantity = Number(d.quantity);
  const rate = Number(d.rate);
  const discount = Number(d.discount);
  const tax = Number(d.tax);

  if (
    !Number.isFinite(quantity) || quantity <= 0 ||
    !Number.isFinite(rate) || rate < 0 ||
    !Number.isFinite(discount) || discount < 0 ||
    !Number.isFinite(tax) || tax < 0 || tax > 100
  ) {
    notify("Please enter valid invoice amounts.");
    return;
  }

  const subtotal = quantity * rate;

  if (discount > subtotal) {
    notify("Discount cannot exceed the subtotal.");
    return;
  }

  const taxable = subtotal - discount;
  const taxAmount = taxable * tax / 100;
  const total = taxable + taxAmount;
  const money = value => "₹" + value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const preview = $("#invoiceOutput");
  preview.replaceChildren();
  preview.classList.remove("hidden");

  const heading = document.createElement("h2");
  heading.textContent = d.type;
  const business = document.createElement("p");
  business.textContent = "From: " + d.business;
  const client = document.createElement("p");
  client.textContent = "Bill to: " + d.client;
  const number = document.createElement("p");
  number.textContent = "Document no: " + d.number;

  const table = document.createElement("table");
  table.className = "invoice-table";
  const rows = [
    ["Description", "Qty", "Rate", "Amount"],
    [d.service, String(quantity), money(rate), money(subtotal)]
  ];

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    row.forEach(value => {
      const cell = document.createElement(index === 0 ? "th" : "td");
      cell.textContent = value;
      tr.append(cell);
    });
    table.append(tr);
  });

  const totals = document.createElement("div");
  totals.style.textAlign = "right";
  totals.textContent =
    `Subtotal: ${money(subtotal)}\n` +
    `Discount: ${money(discount)}\n` +
    `Tax (${tax}%): ${money(taxAmount)}\n` +
    `TOTAL: ${money(total)}`;

  const print = document.createElement("button");
  print.className = "primary";
  print.textContent = "Print / Save as PDF";
  print.style.marginTop = "20px";
  print.addEventListener("click", () => window.print());

  const save = document.createElement("button");
  save.className = "secondary";
  save.textContent = "Save document";
  save.style.margin = "20px 0 0 10px";
  save.addEventListener("click", () => {
    const docs = getDocuments();
    docs.unshift({
      id: Date.now(),
      title: `${d.type} ${d.number}`,
      content:
        `${d.type}\nFrom: ${d.business}\nClient: ${d.client}\n` +
        `Number: ${d.number}\nService: ${d.service}\n` +
        `Quantity: ${quantity}\nRate: ${money(rate)}\n` +
        `Subtotal: ${money(subtotal)}\nDiscount: ${money(discount)}\n` +
        `Tax: ${money(taxAmount)}\nTotal: ${money(total)}`,
      date: new Date().toLocaleString()
    });
    setDocuments(docs);
    notify("Invoice saved locally.");
  });

  preview.append(heading, business, client, number, table, totals, print, save);
  preview.scrollIntoView({ behavior: "smooth", block: "start" });
  notify("Document created.");
});

updateStats();
