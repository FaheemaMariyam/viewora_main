# 🚀 A-Z Guide: Power BI Practice for Viewora

This guide will help you connect Power BI to your database and build your first "Analytics Practice" dashboard.

---

### Part A: Preparing the Connection
Before opening Power BI, we must ensure your computer can "talk" to your Database.

1.  **Check your DB credentials**:
    - Open your `.env` file.
    - Note down: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `DB_PORT` (usually 5432).
2.  **Install the "Translator" (Compulsory)**:
    - Download **Npgsql** (the PostgreSQL driver for Windows): [Download Npgsql 4.1.12](https://github.com/npgsql/npgsql/releases/download/v4.1.12/Npgsql-4.1.12.msi).
    - **Crucial Step during Install**: When it asks which features to install, click the dropdown for **GAC Installation** and select **"Will be installed on local hard drive"**.
    - Restart your computer after installation.

---

### Part B: Connecting Power BI
1.  Open **Power BI Desktop**.
2.  Click **Get Data** (Top Menu) -> **More...**
3.  Search for **PostgreSQL** and select **PostgreSQL database**.
4.  **Server**: Type `localhost:5432` (or just `localhost`).
5.  **Database**: Type your `DB_NAME` (e.g., `viewora_db`).
6.  **Data Connectivity Mode**: Choose **Import** (Choose this for practice as it's faster and easier).
7.  **Credentials**: 
    - Select the **Database** tab on the left.
    - Type your User (`viewora_user`) and Password.
    - Click **Connect**.

---

### Part C: Picking your Practice Tables
A "Navigator" window will open showing all tables. Select these three for practice:
1.  **`properties_property`**: This is your main table (it has prices, views, and counts).
2.  **`interests_propertyinterest`**: This tracks which clients are interested.
3.  **`auth_user`**: This has names of your Brokers and Clients.

Click **Load**.

---

### Part D: Building 3 Simple Visuals (Practice)

#### 1. Total Market Traffic (Card Visual)
- Click the **Card** icon in the "Visualizations" pane.
- Drag `view_count` from `properties_property` into the "Fields" area.
- *Goal*: Shows the total number of views across the whole platform.

#### 2. Popularity by Locality (Bar Chart)
- Click the **Clustered Bar Chart** icon.
- **Y-Axis**: Drag `locality` from `properties_property`.
- **X-Axis**: Drag `view_count`.
- *Goal*: Shows which area (e.g., Vagamon vs. Kochi) is getting the most interest.

#### 3. Lead Status Tracking (Pie Chart)
- Click the **Pie Chart** icon.
- **Legend**: Drag `status` from `interests_propertyinterest`.
- **Values**: Drag `id` (Count) from `interests_propertyinterest`.
- *Goal*: Shows how many leads are "Requested", "Assigned", or "Closed".

---

### Part E: How to Refresh Data
Whenever people view properties on your website, your database updates. 
- In Power BI, simply click the **Refresh** button at the top.
- Power BI will pull the latest `view_count` and `interest_count` from Postgres.

---

### Part F: Troubleshooting common errors
- **"The remote certificate is invalid"**: Go to **File** -> **Options and settings** -> **Data source settings**. Select your Postgres connection, click **Edit Permissions**, and **uncheck "Encrypt connections"**.
- **"Npgsql not found"**: This means the driver wasn't installed correctly in Part A. Re-run the installer and make sure **GAC Installation** is selected.

---

### ⚠️ IMPORTANT: Fix for "Old Data" or "0 Views"
If Power BI shows old data (or 0 views) but your website shows new data, you have a **"Twin Database"** problem. You likely have PostgreSQL installed on your Windows machine AND inside Docker.

**How to fix it:**
1.  **Stop Local Postgres**:
    - Press `Win + R`, type `services.msc`, and press Enter.
    - Find **"postgresql-x64-15"** (or similar).
    - Right-click it and select **Stop**.
2.  **Restart Docker DB**:
    - In your terminal, run: `docker restart viewora_postgres`.
3.  **Check Power BI**:
    - Go back to Power BI and click **Refresh**.

*Why this happens*: Docker and your local Windows both try to use port 5432. By stopping the local one, Power BI will finally "see" the Docker database where your real project data lives.
