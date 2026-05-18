export const metadata = {
  title: "Getting Started",
  description:
    "Get started with the blaj.io API — authentication, first request, and best practices.",
};

const steps = [
  {
    title: "Get an API Key",
    content: (
      <>
        <p>
          API keys authenticate requests to the blaj.io API. To get one:
        </p>
        <ol>
          <li>
            Create an account at{" "}
            <a href="https://blaj.io" target="_blank" rel="noopener">
              blaj.io
            </a>
          </li>
          <li>
            Navigate to <strong>Settings &rarr; API Keys</strong>
          </li>
          <li>Click &quot;Generate API Key&quot;</li>
          <li>Copy the key and store it securely</li>
        </ol>
        <p>
          API keys are scoped to your account and carry the same permissions as
          your user. Never share them or commit them to version control.
        </p>
      </>
    ),
  },
  {
    title: "Make Your First Request",
    content: (
      <>
        <p>
          All requests require an <code>Authorization: Bearer YOUR_API_KEY</code>{" "}
          header. Here&apos;s how to create a quote:
        </p>
        <div className="code-label">cURL</div>
        <pre>
          <code>{`curl https://api.blaj.io/public/quotes/create \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "vehicle": {
      "plateNumber": "B 123 ABC",
      "vin": "WVWZZZ3CZWE123456",
      "category": "B",
      "seats": 5,
      "mass": 1500,
      "power": 75,
      "fuelType": "diesel"
    },
    "owner": {
      "cnp": "1234567890123",
      "firstName": "Ion",
      "lastName": "Popescu",
      "birthDate": "1985-03-15",
      "county": "Bucuresti",
      "city": "Bucuresti"
    },
    "drivers": ["1234567890123"],
    "bonusMalusClass": "B4"
  }'`}</code>
        </pre>

        <p>
          A successful response returns an array of offers from available
          insurers:
        </p>
        <pre>
          <code>{`{
  "offers": [
    {
      "insurer": "CITY INSURANCE",
      "premiumRON": 423.50,
      "validUntil": "2026-06-16T00:00:00Z",
      "quoteId": "q_abc123..."
    },
    {
      "insurer": "OMNIASIG",
      "premiumRON": 451.20,
      "validUntil": "2026-06-16T00:00:00Z",
      "quoteId": "q_def456..."
    }
  ]
}`}</code>
        </pre>
      </>
    ),
  },
  {
    title: "Handle Errors",
    content: (
      <>
        <p>The API uses conventional HTTP status codes:</p>
        <ul>
          <li>
            <code>200</code> — Success
          </li>
          <li>
            <code>400</code> — Validation error (check your input)
          </li>
          <li>
            <code>401</code> — Invalid or missing API key
          </li>
          <li>
            <code>404</code> — Resource not found
          </li>
          <li>
            <code>429</code> — Rate limit exceeded
          </li>
          <li>
            <code>500</code> — Server error (try again or contact support)
          </li>
        </ul>
        <p>Error responses include a descriptive message:</p>
        <pre>
          <code>{`{
  "error": "VALIDATION_ERROR",
  "message": "plateNumber is required",
  "details": {
    "field": "vehicle.plateNumber"
  }
}`}</code>
        </pre>
      </>
    ),
  },
  {
    title: "Client Libraries",
    content: (
      <>
        <p>
          Use the typed oRPC client for full type safety when building with
          TypeScript:
        </p>
        <div className="code-label">TypeScript (oRPC)</div>
        <pre>
          <code>{`import { createClient } from "@orpc/client";
import type { AppRouter } from "@blaj/api";

const client = createClient<AppRouter>({
  baseURL: "https://api.blaj.io",
  headers: { Authorization: \`Bearer \${API_KEY}\` },
});

const result = await client.public.quotes.create({
  vehicle: {
    plateNumber: "B 123 ABC",
    vin: "WVWZZZ3CZWE123456",
    category: "B",
    seats: 5,
    mass: 1500,
    power: 75,
    fuelType: "diesel",
  },
  owner: {
    cnp: "1234567890123",
    firstName: "Ion",
    lastName: "Popescu",
    birthDate: "1985-03-15",
    county: "Bucuresti",
    city: "Bucuresti",
  },
  drivers: ["1234567890123"],
  bonusMalusClass: "B4",
});`}</code>
        </pre>

        <p>
          For other languages, use any HTTP client. See the{" "}
          <a href="/reference">API Reference</a> for the full
          spec with Try It playground.
        </p>
      </>
    ),
  },
];

export default function GettingStarted() {
  return (
    <div>
      <h1>Getting Started</h1>
      <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: "2rem" }}>
        Everything you need to integrate with the blaj.io API in under 5
        minutes.
      </p>

      {steps.map((step, i) => (
        <section key={i}>
          <h2>
            {i + 1}. {step.title}
          </h2>
          {step.content}
        </section>
      ))}

      <h2>Next Steps</h2>
      <ul>
        <li>
          Explore the <a href="/reference">full API Reference</a> with
          interactive Try It playground
        </li>
        <li>
          Read the <a href="/authentication">Authentication guide</a> for API
          key management and best practices
        </li>
        <li>
          Review <a href="#rate-limits">Rate Limits &amp; Best Practices</a>{" "}
          below
        </li>
      </ul>

      <h2 id="rate-limits">Rate Limits &amp; Best Practices</h2>
      <ul>
        <li>
          <strong>100 requests/minute</strong> per API key
        </li>
        <li>Implement exponential backoff for retries</li>
        <li>Cache quote results (they expire per the <code>validUntil</code> field)</li>
        <li>Use webhooks for asynchronous events instead of polling</li>
        <li>Validate inputs client-side before sending to reduce errors</li>
      </ul>
    </div>
  );
}
