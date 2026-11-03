# n8n-nodes-sortwell

Official **Sortwell** community node for [n8n](https://n8n.io) to clean, verify, and validate email addresses in real time. Protect your sender reputation, eliminate bounce rates, and filter out disposable or invalid emails before sending campaigns.

---

## Features

- **High-Precision Email Verification:** Real-time deep SMTP handshakes, MX validation, DNS records, disposable email detection, catch-all detection, role account flags, and deliverability scoring (0–100).
- **Single & Bulk Looping:** Seamlessly verify single leads or stream thousands of contacts from Google Sheets, Airtable, HubSpot, Webhooks, or PostgreSQL.
- **Account Credit Monitoring:** Check remaining verification credits and active subscription plan directly inside your workflows.
- **Fail-Safe Quotas:** Gracefully detects low/depleted credit balance (`402`) to halt downstream outbound mailing before bounces occur.

---

## Installation

### Method 1: In n8n Dashboard (Recommended)

1. Open your n8n instance.
2. Navigate to **Settings** > **Community Nodes**.
3. Click **Install**.
4. Enter package name: `n8n-nodes-sortwell`
5. Agree to the risks and click **Install**.

### Method 2: For Self-Hosted Docker Installations

Add the package to your Docker container or install via npm inside your custom image:

```bash
npm install n8n-nodes-sortwell
```

---

## Credentials Setup

1. In Sortwell, go to **Settings > API Keys** (or `/dashboard`).
2. Generate a new API key (starts with `ev_live_...`).
3. In n8n, create a new credential for **Sortwell API**:
   - **API Key:** Paste your `ev_live_...` key.
   - **Base URL:** Keep default `https://www.sortwell.xyz` (or set custom endpoint if self-hosting Sortwell).
4. Click **Save** (n8n automatically tests the credential against the `/api/v1/account` endpoint).

---

## Operations & Node Usage

### 1. Resource: Email
* **Operation: Verify**
  * Verifies an email address using Sortwell's real-time engine.
  * Input parameter: `email` (e.g., `{{ $json.email }}` or `john@example.com`).
  * **Output Schema:**
    ```json
    {
      "id": "cm...abc",
      "email": "alex@company.com",
      "status": "valid",
      "score": 98,
      "isSafeToSend": true,
      "reason": "Mailbox exists and accepts email",
      "domain": "company.com",
      "isDisposable": false,
      "isCatchAll": false,
      "isRoleAccount": false,
      "isFreeEmail": false,
      "isDeliverable": true,
      "latencyMs": 420,
      "createdAt": "2026-10-31T12:00:00.000Z",
      "creditsRemaining": 845
    }
    ```

### 2. Resource: Account
* **Operation: Get Balance & Quota**
  * Retrieves user plan, remaining credits, and daily allocation.

---

## Example Workflows

### Google Sheets ➔ Sortwell Clean ➔ Airtable
1. **Google Sheets Trigger:** New row added with user email.
2. **Sortwell Node:** Verify `{{ $json.email }}`.
3. **IF Node:** Check if `{{ $json.isSafeToSend }} === true`.
   - **True:** Insert lead into Airtable CRM.
   - **False:** Flag record as invalid or bounce-risk.

---

## Support & Resources

- **Sortwell Website:** [https://www.sortwell.xyz](https://www.sortwell.xyz)
- **API Documentation:** [https://www.sortwell.xyz/docs](https://www.sortwell.xyz/docs)
- **Report Issues:** [https://github.com/futureceptindia/n8n-nodes-sortwell/issues](https://github.com/futureceptindia/n8n-nodes-sortwell/issues)

---

## License

[MIT](LICENSE)

