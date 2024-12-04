# Admin Dashboard with Role-Based Access Control (RBAC)

## Overview
This project is an Admin Dashboard that enables efficient user management with role-based access control (RBAC). The dashboard allows administrators to manage user accounts, view statistics, and access data visualizations. It includes two roles: Admin and User, each with specific permissions. The interface is fully responsive, ensuring usability across desktop and mobile devices.
Admin is automatically create with admin as user name and password(using a create admin function - can change accordingly)

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [How to Run](#how-to-run)

## Features
- **User Management**:  Admins can edit roles/status and delete user accounts.
- **Role-Based Access Control**: 
       **Admin Role**: Full access to user's info.
       **User Role**: Limited access to view their own profile.
- **User Statistics Overview**: Displays statistics like the number of active/inactive users, total signups.
- **Responsive Design**: Optimized for various screen sizes, providing a seamless experience on both mobile and desktop devices.

## Technologies Used
- **Frontend**: React.js+vite
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Styling**: Shadcn Ui and custom Tailwind CSS for responsive design
- **Version Control**: Git & GitHub

## Installation

### Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v14 or later)
- npm (Node Package Manager)
- MongoDB (for local development)

### Step 1: Clone the Repository
```bash
git clone [https://github.com/Neel-max-cpu/AdminDashboard.git](https://github.com/Neel-max-cpu/AdminDashboard.git)
```

### Step 2: Navigate to the Project Directory
Change into the project directory:
```
cd frontend
```

```
cd backend
```

### Step 3: Install Dependencies
Run the following command to install the necessary dependencies for both the frontend and backend:
```
npm install
```

### Step 4: Set Up the Environment Variables
Don't need to create the .env file, just paste your MONGODB_URI, PORT and can change your SECRET_KEY in the server.js

```
const MONGODB_URI = "mongodb://localhost:27017/portal"
```

### Usage
After setting up the environment variables, you can start the application.


### How to Run
### Step 1: Start the Backend Server
Navigate to the server directory and start the backend server:
```
cd backend
node src/server.js
```

### Step 2: Start the Frontend
In a new terminal window, navigate to the client directory and start the React application:
```
cd frontend
npm run dev
```

### Step 3: Access the Application
Open your web browser and go to http://localhost:5173/login to access the Task Manager application.
