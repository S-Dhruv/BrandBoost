BrandBoost is a platform that connects **businesses** with **creators** to collaborate on marketing campaigns. It provides a seamless workflow where businesses can post job listings, creators can apply for jobs, and both parties can communicate in real-time with AI-driven marketing assistance.

## Features

### 1. User Roles
- **Business:**
  - Post job opportunities for creators.
  - Review applications from creators and approve suitable candidates.
  - Assign unique codes for approved creators to join real-time chat rooms.
  
- **Creator:**
  - Browse and apply for available jobs.
  - Gain access to an exclusive chat room upon approval.
  - Keep track of progress through assigned to-do lists.
  - Must be verified by an admin before applying to jobs.

### 2. Real-Time Chat Room
- Approved creators and businesses get access to a dedicated chat room.
- Chat rooms enable seamless communication and collaboration.
- Powered by WebSockets for instant messaging.

### 3. Task Management
- Creators receive a **to-do list** to ensure progress tracking on assigned projects.
- Businesses can monitor completion status to keep the workflow structured.

### 4. AI Marketing Assistant (Powered by Gemini AI)
- Provides recommendations on **what to market** and **how to market**.
- Helps creators and businesses optimize their content strategies.
- Offers insights into trends, audience engagement, and marketing techniques.

### 5. Protected Routes
- Certain routes are accessible only to authenticated users.
- Ensures that sensitive data remains secure.
- Role-based access control for businesses and creators.

### 6. Creator Verification by Admin
- Admin must verify new creators before they can apply to jobs.
- Ensures authenticity and quality of creators on the platform.

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-Time Communication:** WebSockets
- **AI Assistant:** Google Gemini AI

## Installation & Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/brandboost.git
   cd brandboost
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add necessary variables such as database URL, API keys, and WebSocket configurations.
4. **Run the development server:**
   ```sh
   npm start
   ```

## Contributing
We welcome contributions! If you'd like to improve **BrandBoost**, feel free to open issues and submit pull requests.

## License
This project is licensed under the MIT License.

## Contact
For any queries or suggestions, reach out to us at [your-email@example.com].

