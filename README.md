# GovernanceOS // OCI-AHP Engine

**A structured decision-support framework integrating causal modeling with multi-criteria prioritization.**

GovernanceOS is a React-based decision intelligence tool designed for public administrations and mission-driven teams. It synthesizes the **Outcome–Cause–Intervention (OCI)** causal structure with the **Analytic Hierarchy Process (AHP)** to prioritize interventions based on mathematical utility rather than intuition alone.

## // Methodology

The system imposes a strict three-tier ontology to ensure traceability:

1.  **Outcome (Tier I)**: The singular strategic objective (e.g., "Reduce Rural Depopulation").
2.  **Drivers (Tier II)**: Probabilistic causal factors influencing the Outcome.
3.  **Interventions (Tier III)**: Discrete operational programs mapped to specific drivers.

Prioritization is calculated using **Eigenvector Centrality** derived from pairwise comparison matrices (Saaty, 1980). The final utility score ($S_i$) for an intervention is calculated as:

$$ S_i = Coverage \times Effectiveness \times Feasibility $$

## // Features

*   **Gemini AI Integration**: Automated discovery of causal drivers and strategic interventions using Google's Gemini 2.5 Flash model.
*   **AHP Computation Engine**: Client-side calculation of Eigenvectors, Consistency Ratios (CR), and geometric mean aggregation.
*   **Interactive Visualization**: Force-directed logic graphs using D3.js and priority matrices using Recharts.
*   **PDF Reporting**: Printable executive summaries and JSON data export.

## // Tech Stack

*   **Core**: React 19, TypeScript
*   **Styling**: Tailwind CSS (Custom "Swiss" config)
*   **Math/Logic**: Custom AHP implementation (Power Method / Geometric Mean)
*   **AI**: Google GenAI SDK (`@google/genai`)
*   **Viz**: D3.js, Recharts

## // Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/governance-os.git
    cd governance-os
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    API_KEY=your_google_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm start
    ```

## // Credits

**Concept & Engineering**: Gabriele Pizzi
**Contact**: [info@operaincerta.com](mailto:info@operaincerta.com)

Based on the AHP methodology by Thomas L. Saaty.

---
*GovernanceOS // Decision Support Protocol v1.0*
