# 🦟 dengue-watch-AI - Track dengue risk with clear alerts

[![Download](https://img.shields.io/badge/Download-Visit%20GitHub%20Page-blue?style=for-the-badge)](https://github.com/hanaadumbrative727/dengue-watch-AI)

## 📥 Download

Visit this page to download or open the project files:
https://github.com/hanaadumbrative727/dengue-watch-AI

If you want to run the app on Windows, use the files from that page and follow the steps below.

## 🖥️ What this app does

DengueWatch.AI helps users check dengue risk across Theni District, Tamil Nadu. It gives a simple view of risk by village, shows forecasts, and helps staff send alerts and track action.

You can use it to:

- view a district risk dashboard
- check village-level risk
- see 6-month dengue forecasts
- train and view the AI model
- review alerts and notifications
- use role-based login for staff access

## ⚙️ Before you start

You need:

- a Windows PC
- internet access
- Google Chrome, Edge, or Firefox
- Node.js installed on your PC
- the project files from the GitHub page

If you do not have Node.js yet, install the latest LTS version for Windows from the official Node.js website.

## 🔧 Install on Windows

Follow these steps in order.

1. Open the download page:
   https://github.com/hanaadumbrative727/dengue-watch-AI

2. Download the project files to your PC.

3. If the files come in a ZIP folder, right-click the ZIP file and choose Extract All.

4. Open the extracted folder.

5. Make sure you can see the project files, including the app folders and package files.

6. Open Command Prompt in that folder:
   - right-click inside the folder
   - choose Open in Terminal
   - or open Command Prompt and change to that folder

7. Install the app files by running:
   npm install

8. Wait for the install to finish.

9. Start the app by running:
   npm start

10. Keep the terminal window open.

11. Open your web browser.

12. Go to:
   http://localhost:3000

## 🔐 Demo login details

Use one of these demo accounts to sign in.

| Role | Email | Password |
|------|-------|----------|
| Field Officer | officer@theni.gov.in | theni123 |
| Health Admin | admin@health.tn.gov.in | admin123 |
| Data Analyst | analyst@nvbdcp.in | analyst123 |

## 📱 Main pages

These are the main parts of the app.

| Page | What it shows |
|------|---------------|
| **Login** | Role-based sign in for Officer, Admin, and Analyst |
| **Dashboard** | District risk view, key stats, and village grid |
| **AI Model** | Train the RF + LSTM model and view feature importance |
| **Villages** | Browse all 15 Theni villages and open each village view |
| **Forecast** | 6-month dengue prediction for each village |
| **Alerts** | Risk alerts and acknowledge actions |
| **Notifications** | Create and send alerts to authorities |

## 🪟 How to use it

After the app opens in your browser:

1. Sign in with one of the demo accounts.
2. Open the Dashboard to see the district risk view.
3. Use Villages to check a specific village.
4. Open Forecast to view future risk for that area.
5. Use Alerts to review active risk messages.
6. Use Notifications to send updates to staff or authorities.
7. Open AI Model if you want to inspect the model view.

## 🧭 What each role can do

### 👮 Field Officer
- check village risk
- review alerts
- view district and village details
- acknowledge field updates

### 🏥 Health Admin
- monitor district health risk
- send notifications
- manage alert flow
- track action status

### 📊 Data Analyst
- review model output
- inspect feature importance
- analyze forecast trends
- compare village risk patterns

## 🛠️ If the app does not open

Try these steps:

1. Check that the terminal still shows the app running.
2. Make sure you ran `npm install` first.
3. Confirm that `npm start` finished without errors.
4. Refresh the browser page.
5. Close other apps if your PC feels slow.
6. Open `http://localhost:3000` again.
7. If the port is busy, stop the other app that uses port 3000 and run `npm start` again.

## 📁 Folder view

A typical project folder may include:

- `src` for app code
- `public` for static files
- `package.json` for app settings
- `node_modules` after install
- build and config files used by the app

## 🧪 Test the app

Use this quick check after startup:

1. Open the login page.
2. Sign in with the Field Officer account.
3. Open the Dashboard.
4. Open Villages and select a village.
5. Open Forecast and check the prediction view.
6. Open Alerts and review one alert.
7. Sign out if the app provides that option.

## 💡 Best use on Windows

For a smooth run:

- keep the terminal open while using the app
- use a recent version of Chrome or Edge
- do not move or rename the project folder after setup
- run the app from the same folder each time
- close and reopen the terminal if the app stops

## 🔗 Project link

Primary download and project page:
https://github.com/hanaadumbrative727/dengue-watch-AI