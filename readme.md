# ✦ HustleKit AI

### Your Business, Simplified.

HustleKit AI is a lightweight business productivity web application designed to help freelancers, student entrepreneurs, online sellers, and small business owners create business content and manage documents from one place.

Built using **HTML, CSS, and JavaScript**, the project aims to make everyday business tasks easier and more affordable through open-weight AI and browser-based tools.

---

## 🚀 Features

- **AI Product Description Writer** — Generate product titles, descriptions, selling points, and calls to action.
- **Social Media Content Studio** — Create promotional captions and content ideas for different social media platforms.
- **Client Message Writer** — Draft professional outreach messages, proposals, follow-ups, and payment reminders.
- **Invoice & Quotation Maker** — Calculate totals, discounts, and tax, then print or save documents as PDF.
- **Saved Documents** — Save and manage generated content locally in your browser.
- **Responsive Dashboard** — Access tools through a simple, modern interface.
- **Privacy-Focused AI Architecture** — Designed to run compatible open-weight language models directly in the browser.

## 🎯 Problem Statement

Freelancers and small businesses often spend valuable time writing product descriptions, preparing promotional content, communicating with clients, and creating business documents.

Professional tools can be expensive or require subscriptions to hosted AI services.

HustleKit AI aims to provide a simple, accessible alternative that brings essential business tools together in one place.

## 🧠 Open-Source AI

Open innovation is an important part of HustleKit AI.

The project explores browser-based inference with open-weight language models instead of relying on paid, closed AI APIs.

### Why this approach?

- **Privacy:** Prompts can be processed locally without sending them to an external AI inference service.
- **Cost control:** Local inference can reduce per-request API expenses.
- **Flexibility:** The model can potentially be replaced with another compatible open-weight model.
- **Accessibility:** Users can explore AI-powered productivity tools without requiring a paid AI API subscription.
- **Independence:** The architecture reduces dependence on a single hosted AI provider.

The initial model download may require an internet connection. Actual offline functionality depends on model caching and must be tested separately.

*Note: Open weights and open-source software are not always equivalent. Check the specific model's license and usage restrictions before deployment.*

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and forms |
| CSS3 | Responsive design and styling |
| JavaScript | Application logic and interactions |
| Transformers.js | Browser-based model inference |
| Open-weight language model | AI content generation |
| localStorage | Local document persistence |
| Git & GitHub | Version control and collaboration |

## 📁 Project Structure

```text
HustleKit-AI/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- A modern web browser
- Visual Studio Code or another code editor
- An internet connection for initial dependencies and model downloads
- A local development server

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

**2. Open the project folder**

```bash
cd YOUR-REPOSITORY
```

**3. Open the folder in VS Code**

```bash
code .
```

**4. Start a local server**

Install the Live Server extension in VS Code, open `index.html`, right-click, and select **Open with Live Server**.

Alternatively, if Python is installed, run:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

The AI functionality also requires the model and its dependencies to load successfully in the browser.

## 🔒 Privacy

HustleKit AI is designed with local-first data handling in mind.

- Generated documents can be stored in browser `localStorage`.
- Local model inference can keep prompts on the user's device.
- No paid AI API key is required by the intended architecture.
- Browser storage is not encrypted by default and should not be treated as secure storage for sensitive business information.
- External dependencies and model downloads may contact their respective hosting services.

Do not enter confidential client information unless you understand the risks of the environment in which the application is running.

## 🧪 Testing Checklist

Before using the application in production, verify:

- [ ] Dashboard and navigation work correctly.
- [ ] CSS loads and the layout adapts to mobile screens.
- [ ] The language model downloads and generates actual content.
- [ ] AI loading and failure states work as expected.
- [ ] Copy and save actions work.
- [ ] Saved documents persist after refreshing the page.
- [ ] Invoice calculations handle discounts and tax correctly.
- [ ] Print-to-PDF works.
- [ ] Model license and third-party dependency licenses have been reviewed.

## 💡 Potential Use Cases

- Freelancers preparing client proposals
- Online sellers writing product listings
- Small businesses creating social media promotions
- Student entrepreneurs managing early-stage businesses
- Independent service providers preparing quotations

## 💰 Future Roadmap

- Brand-specific writing templates
- Multiple business profiles
- Bulk product description generation
- Custom-branded invoices and quotations
- Export options for business documents
- Improved multilingual generation
- Better model caching and offline support
- Optional premium features based on user feedback

## 🌱 Open Innovation Matters

HustleKit AI explores how open-weight models can make practical AI tools more accessible to independent creators and small businesses.

By giving developers greater control over model selection and inference, open AI technologies create opportunities to build specialized products without depending entirely on closed AI platforms.

The goal is to turn that flexibility into something useful: less repetitive work, greater control over business data, and affordable tools for people building their own businesses.

## 🤝 Contributing

Contributions, feature suggestions, bug reports, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the functionality.
5. Submit a pull request describing your improvements.

## 📄 License

This project does not yet specify a repository license. Add a project license, such as MIT, if you intend to distribute your code under those terms. Review the selected AI model's license separately.

## 👨‍💻 Author

**Abhinav Kumar**

Built as an exploration of open-weight AI, web development, and practical tools for small businesses.

---

**HustleKit AI — Less busywork. More business.** ✦
