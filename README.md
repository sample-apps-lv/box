# BOX — SMT Intelligence Frontend

> **Real-time BOM health. Before you commit.**
> A web UI that allows users to upload a Bill of Materials (BOM) and PCB design parameters, watch live AI-driven analysis, and view a holistic product health report including supply chain risks, IPC compliance, and business models.

---

## 🏗️ Architecture & Modes

The application is divided into two distinct operational modes:

* **Mode A — The Analysis Flow (Screens 1–5):** A linear, one-shot journey. The user submits a BOM, watches it analyzed live via a Server-Sent Events (SSE) stream, and reviews the final Pre-Commitment Dashboard.
* **Mode B — The Persistent Tools (Screens 6–9):** Always accessible via the top navigation bar. These screens pull data from REST endpoints using polling and represent warehouse stock, production pipelines, and Engineering Change Orders (ECOs).

---

## 🛠️ Tech Stack

* **Framework:** React 
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **State Management:** Zustand (for global SSE stream state and persisting the `BOXReport`) + SWR (for polling REST endpoints)
* **API Streaming:** `@microsoft/fetch-event-source` (Required for POST-based SSE streams)
* **Editor:** Monaco Editor (lite) for JSON input

---

## 🚀 Getting Started

### Local Development

1.  **Clone and install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_BASE_URL=http://localhost:8000
    ```

3.  **Vite Configuration (`vite.config.js`):**
    Ensure your server is configured to allow all hosts, which is particularly useful for seamless local testing and containerization.
    ```javascript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    export default defineConfig({
      plugins: [react()],
      server: {
        allowedHosts: 'all', 
        port: 5173,
        host: true
      }
    })
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

### Containerization (Docker / Podman)

If you prefer running the application via containerization, you can use the following `docker-compose.yml` configuration:

```yaml
version: '3.8'
services:
  box-ui:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000
    restart: unless-stopped
```

---

## 🗺️ Routing & Project Structure

| Route | Screen | Description |
| :--- | :--- | :--- |
| `/` | **1. Landing** | Entry point with system health check and "Analyse" CTA. |
| `/analyse` | **2. Input** | JSON editor for BOM and IPC `design_params`. |
| `/analyse/live` | **3. Live Watch** | Streaming view handling all 5 phases of SSE events. |
| `/report/:report_id` | **4. Dashboard** | Pre-Commitment view (Components, IPC, Upgrades, Health). |
| `/report/:report_id/export`| **5. Export** | PDF, JSON, and Fabrication Note export options. |
| `/dashboard` | **6. Analytics** | KPI cards, alerts, and report history. |
| `/inventory` | **7. Inventory** | Virtual inventory snapshot and cross-BOM coverage. |
| `/pipeline` | **8. Pipeline** | Production run scheduling and optimal sequencing. |
| `/engineering` | **9. ECO Log** | Auditable log of Engineering Change Orders and BOM versions. |

---

## 🔌 API Integration & SSE Guidelines

### Server-Sent Events (SSE)
Standard `EventSource` in the browser only supports `GET` requests. Because the `/api/v1/analyze/stream` endpoint requires a `POST` request with the BOM payload, you **must** use `@microsoft/fetch-event-source` or a custom streaming fetch reader.

**Expected SSE Phases:**
1.  **Components:** `analysis_started` → `component_started` → `agent_step` → `component_done`
2.  **IPC Validation:** `ipc_check_started` → `ipc_rule_result` → `ipc_check_done`
3.  **Version Upgrade:** `upgrade_started` → `upgrade_component` → `upgrade_complete`
4.  **Product Health:** `health_check_started` → `health_check_done`
5.  **Completion:** `analysis_complete` (Contains the full `BOXReport` JSON)

### State Persistence
When the `analysis_complete` event fires, save the resulting `report_id` and data into `localStorage` (via Zustand) so that if the user refreshes Screen 4, the dashboard data is not lost.

---

Would you like me to draft the boilerplate Vite configuration, the Dockerfile, or the initial Zustand store to handle the SSE streaming?