# Chatwoot Form Data Forwarder

This repository contains a Google Apps Script project designed to receive webhook data from Chatwoot forms and store it in a Google Sheet. This is a companion project to our YouTube video demonstrating how to integrate Chatwoot forms with your CRM or data storage.

## Features

*   **Webhook Receiver:** Listens for `POST` requests sent by Chatwoot when a form is submitted.
*   **Authentication:** Uses a static token for basic security to ensure only authorized requests are processed.
*   **Google Sheet Integration:** Appends submitted form data to a specified Google Sheet.
*   **Data Structuring:** Organizes form data into a structured format within the Google Sheet, including conversation ID for easy reference.
*   **Configurable:** Easy setup via Google Apps Script Properties.

## Prerequisites

*   **Chatwoot Account:** With form functionality enabled.
*   **Google Account:** To create and manage Google Sheets and Google Apps Script.

## Setup

This script needs to be deployed as a Google Apps Script Web App.

### 1. Create a New Google Apps Script Project

*   Go to [script.google.com](https://script.google.com/).
*   Click on "New project".
*   Delete any placeholder code and paste the contents of the `Code.gs` file from this repository into the script editor.

### 2. Configure Script Properties

Your script needs two properties set: `SHEET_ID` and `STATIC_TOKEN`.

*   **`SHEET_ID`:** The ID of your Google Sheet. You can find this in the URL of your Google Sheet. For example, in `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit#gid=0`, `YOUR_SHEET_ID_HERE` is the ID.
*   **`STATIC_TOKEN`:** A secret token that Chatwoot will send with its webhook requests. This acts as a simple form of authentication. **Choose a strong, unique token.**

**To set these properties:**

1.  In the script editor, go to **Project settings** (gear icon on the left sidebar).
2.  Under "Script properties," click **Add script property**.
3.  Add `SHEET_ID` as the name and your Google Sheet ID as the value.
4.  Click **Add script property** again.
5.  Add `STATIC_TOKEN` as the name and your chosen secret token as the value.
6.  Click **Save project properties**.

### 3. Prepare Your Google Sheet

*   Create a new Google Sheet or use an existing one.
*   The script will automatically create a sheet named "Leads" if it doesn't exist and add the necessary header row: `id`, `created_at`, `source`, `tenant_id`, `inbox_id`, `account_id`, `conversation_id`, `submitted_values_json`, `notes`.

### 4. Deploy as a Web App

1.  In the script editor, click **Deploy** > **New deployment**.
2.  Click the **Select type** icon (gear) and choose **Web app**.
3.  **Description:** Give your deployment a name (e.g., "Chatwoot Form Forwarder").
4.  **Execute as:** Select "Me" (your Google account).
5.  **Who has access:** Select "Anyone with the link".
6.  Click **Deploy**.
7.  You may be prompted to authorize the script. Follow the on-screen prompts to grant the necessary permissions.
8.  After successful deployment, you will see a **Web app URL**. Copy this URL – this is the webhook URL you'll configure in Chatwoot.

## Configuration in Chatwoot

1.  Navigate to your Chatwoot dashboard.
2.  Go to **Settings** > **Integrations**.
3.  Find the **Webhooks** section and click **Add webhook**.
4.  **URL:** Paste the Web app URL you copied from Google Apps Script deployment.
5.  **Events:** Select `Form submitted`.
6.  **Token:** Enter the **`STATIC_TOKEN`** you configured in your Google Apps Script properties.
7.  Click **Save**.

## How it Works

*   The `doPost(e)` function is the entry point for the Web App.
*   It first checks for the `STATIC_TOKEN` sent in the request parameters against the one stored in the script properties.
*   If the token is valid, it parses the JSON payload from the `e.postData.contents`.
*   It retrieves the `SHEET_ID` and then opens the specified Google Sheet.
*   It either finds an existing sheet named "Leads" or creates a new one with the correct headers.
*   It appends a new row to the "Leads" sheet with the extracted data, including a unique ID, timestamp, and the `submitted_values` stringified as JSON.
*   The `conversation_id` is also included, allowing you to easily cross-reference the submitted data with the original Chatwoot conversation.

## Usage

Once configured, any form submissions in Chatwoot will automatically trigger the webhook. The data will then appear as a new row in your designated Google Sheet.

## Contributing

Contributions are welcome! If you have ideas for improvements or find bugs, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---
