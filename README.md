<div align="center">
  <h1>🇮🇳 VoteIQ</h1>
  <p><strong>Interactive Indian Democracy Education Assistant</strong></p>
  <p><em>Built for the Google Cloud x Hack2Skill PromptWars Hackathon</em></p>
</div>

<br />

## 🌟 About VoteIQ

Democracy is the backbone of India, yet the technical and historical aspects of the voting process can often feel complex or inaccessible to first-time voters. 

**VoteIQ** bridges this gap with a highly visual, gamified, and interactive web experience. Instead of just reading about elections, users can physically engage with the process, explore the history, and ask an AI assistant complex questions in real-time.

## ✨ Key Features

- **🗳️ Interactive 3D EVM Simulator:** A fully CSS-physics driven Electronic Voting Machine. Users can cast a mock vote and watch the VVPAT slip drop and verify their choice, just like on polling day.
- **📜 Democracy History Timeline:** A scroll-driven, visually stunning timeline tracking India's democratic milestones from 1947 to the present day.
- **🤖 Election Buddy AI:** An ever-present, context-aware chatbot powered by Google Gemini. It features a typing animation and provides concise, factual answers specifically regarding the Indian electoral process.
- **📊 Democracy Pulse Visualization:** A dynamic, radar-style hero section replacing static maps, giving the application a "live data center" aesthetic.

## 🛠️ Technology Stack

Built for maximum performance, premium aesthetics, and infinite scalability:

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS + Vanilla CSS (for complex 3D transforms and keyframe animations)
- **AI Engine:** Google Gemini (`gemini-2.5-flash` / `gemini-flash-latest`) via the `@google/generative-ai` SDK
- **Animations:** Native CSS `requestAnimationFrame` and `IntersectionObserver` for lag-free scroll reveals.
- **Deployment:** Optimized for **Google Cloud Run** (Standalone build mode).

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhavsarhem/VoteIQ.git
   cd vote-iq
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   *(Note: Get your free API key from [Google AI Studio](https://aistudio.google.com/apikey))*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:8080) to view the application.

## ☁️ Deploying to Google Cloud Run

This project is configured to be deployed seamlessly to Google Cloud Run directly from GitHub:

1. Open the [Google Cloud Console](https://console.cloud.google.com/run).
2. Click **Create Service** -> **Continuously deploy from a repository**.
3. Connect your GitHub and select the `VoteIQ` repository.
4. Set the build type to **Node.js via Buildpacks**.
5. Add your `GEMINI_API_KEY` in the **Variables & Secrets** tab.
6. Click **Deploy**!

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---
*Created by Hem Bhavsar with AI pair-programming via Antigravity.*
