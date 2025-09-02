# RescueVision AI Command Center (Front-End)

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</p>

**RescueVision** is a sophisticated, web-based command center designed to accelerate search and rescue (SAR) operations by leveraging the power of Artificial Intelligence. This Minimum Viable Product (MVP) serves as an **after-action review and intelligence gathering tool**, allowing operators to rapidly analyze hours of aerial drone footage and pinpoint critical events.

### **➡️ [View the AI Backend (Python, PyTorch, YOLOv8, RAG) Here](https://github.com/MdEhsanulHaqueKanan/rescue-vision-project)**

<p align="center">
  <img src="./assets/RescueVision_demo.gif" alt="RescueVision AI Command Center Demo" width="900"/>
</p>

The platform fuses two powerful AI capabilities into a single, intuitive interface:
1.  **AI-Powered Video Analysis:** A custom-trained deep learning model automatically scans drone videos to detect and log every instance of a potential survivor.
2.  **A Mission AI Assistant:** A conversational AI, powered by a Retrieval-Augmented Generation (RAG) pipeline, that provides instant, expert-level answers to operator questions based on official FEMA SAR manuals.

This project demonstrates a complete, end-to-end workflow, from a stunning user interface built with modern web technologies to its seamless integration with a powerful, custom-built AI backend.

[**Insert a high-quality GIF or screenshot of the final application in action here!**]

---

## ✨ Core Features (Investor & User Perspective)

### 1. Automated Event Detection & Logging

Instead of forcing an operator to manually scrub through hours of footage, RescueVision automates the process, creating a high-value intelligence report.

*   **Upload & Process:** The operator uploads a drone video file. The system enters a professional "ANALYZING FOOTAGE..." state, clearly communicating that its powerful AI backend is at work.
*   **Automated Log Generation:** After processing, the **Detections Log** is instantly populated with a complete, time-stamped list of every high-confidence detection.
*   **Confidence Scoring:** Each event is tagged with a clear confidence score (e.g., **"Confidence: 83%"**), allowing the operator to prioritize the most likely sightings.

### 2. Flawless, Pixel-Perfect Event Review

This is the core of the user experience. The platform eliminates the ambiguity of real-time tracking in favor of precision analysis.

*   **Click-to-View:** When an operator clicks on any event in the Detections Log (e.g., "Survivor at 00:28"), the video player instantly jumps to that exact timestamp and **pauses**.
*   **Pixel-Perfect Bounding Box:** A single, static, and **perfectly aligned** bounding box is drawn on the paused frame, definitively highlighting the detected survivor. This provides an unambiguous ground truth for the operator.
*   **Clean Playback:** When the operator presses "Play" to view the context around the event, the bounding box cleanly disappears, allowing for an unobstructed view of the footage.

### 3. Integrated AI Mission Support

Operators can instantly access expert-level knowledge without ever leaving the command center interface.

*   **Conversational Q&A:** An operator can ask complex, natural-language questions like `"What are the signs and treatment for hypothermia?"` or `"What is the procedure for a swiftwater rescue?"`
*   **Grounded, Authoritative Answers:** The **Mission AI Assistant** does not hallucinate. It retrieves and displays relevant passages directly from its knowledge base of official FEMA Search and Rescue manuals, providing reliable, life-saving information.

---

## 🛠️ Technology Stack

*   **Frontend Framework:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **Core Libraries:** OpenCV.js (future), Fetch API
*   **Backend Services:** Two independent Flask-based microservices providing AI capabilities.

---

## 🏁 Getting Started

### Prerequisites

*   Node.js and npm installed
*   The [RescueVision AI Backend](https://github.com/MdEhsanulHaqueKanan/rescue-vision-project) must be running locally.

### Local Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd rescuevision-ai-command-center
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    *(The application will be available at `http://localhost:5173`)*