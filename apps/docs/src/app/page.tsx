export const metadata = {
  title: "blaj.io API Reference",
  description:
    "Create quotes, compare RCA offers from 9 insurers, and issue policies programmatically.",
};

const endpoints = [
  {
    method: "POST",
    path: "/public/quotes/create",
    desc: "Create a quote with vehicle, owner, and driver data",
  },
  {
    method: "GET",
    path: "/public/policies/get",
    desc: "Retrieve a policy by its unique ID",
  },
  {
    method: "GET",
    path: "/public/policies/list",
    desc: "List all policies for the authenticated user",
  },
  {
    method: "POST",
    path: "/public/policies/cancel",
    desc: "Cancel an active policy",
  },
  {
    method: "POST",
    path: "/public/payments/createIntent",
    desc: "Create a Stripe payment intent for a policy",
  },
  {
    method: "GET",
    path: "/public/payments/get",
    desc: "Retrieve payment details by ID",
  },
  {
    method: "POST",
    path: "/public/payments/cancelWithRefund",
    desc: "Cancel a payment and request a refund",
  },
  {
    method: "GET",
    path: "/public/account/getProfile",
    desc: "Get the authenticated user's profile",
  },
  {
    method: "PUT",
    path: "/public/account/updatePreferences",
    desc: "Update user notification preferences",
  },
  {
    method: "DELETE",
    path: "/public/account/delete",
    desc: "Delete the authenticated user's account",
  },
];

export default function DocsHome() {
  return (
    <div>
      <h1>blaj.io API</h1>
      <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: "2rem" }}>
        Create quotes, compare RCA offers from 9 Romanian insurers, and issue
        policies programmatically.
      </p>

      <div className="hero-actions">
        <a href="/getting-started" className="btn btn-primary">
          Get Started
        </a>
        <a href="/reference" className="btn btn-secondary">
          API Reference
        </a>
      </div>

      <h2>Quick Start</h2>
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

      <div className="code-label">Node.js</div>
      <pre>
        <code>{`const response = await fetch("https://api.blaj.io/public/quotes/create", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.BLAJ_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
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
  }),
});

const data = await response.json();`}</code>
      </pre>

      <div className="code-label">Python</div>
      <pre>
        <code>{`import requests

response = requests.post(
    "https://api.blaj.io/public/quotes/create",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "vehicle": {
            "plateNumber": "B 123 ABC",
            "vin": "WVWZZZ3CZWE123456",
            "category": "B",
            "seats": 5,
            "mass": 1500,
            "power": 75,
            "fuelType": "diesel",
        },
        "owner": {
            "cnp": "1234567890123",
            "firstName": "Ion",
            "lastName": "Popescu",
            "birthDate": "1985-03-15",
            "county": "Bucuresti",
            "city": "Bucuresti",
        },
        "drivers": ["1234567890123"],
        "bonusMalusClass": "B4",
    },
)

data = response.json()`}</code>
      </pre>

      <h2>API Endpoints</h2>
      <div className="endpoint-grid">
        {endpoints.map((ep) => (
          <div className="endpoint-card" key={ep.path}>
            <span className={`method method-${ep.method.toLowerCase()}`}>
              {ep.method}
            </span>
            <div className="path">{ep.path}</div>
            <div className="desc">{ep.desc}</div>
          </div>
        ))}
      </div>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Multi-insurer comparison</strong> — Compare RCA offers from 9
          Romanian insurers in a single API call
        </li>
        <li>
          <strong>Instant policy issuance</strong> — Issue RCA policies
          programmatically with digital delivery
        </li>
        <li>
          <strong>Payment processing</strong> — Integrated Stripe payment
          intents with automatic receipt generation
        </li>
        <li>
          <strong>Account management</strong> — Full CRUD for user profiles and
          notification preferences
        </li>
        <li>
          <strong>Webhook notifications</strong> — Real-time events for policy
          status changes, payments, and renewals
        </li>
      </ul>

      <h2>Base URL</h2>
      <pre>
        <code>https://api.blaj.io</code>
      </pre>
      <p>All API requests must be made over HTTPS. Requests over plain HTTP will be redirected.</p>

      <h2>Rate Limits</h2>
      <p>
        The API enforces rate limits of <strong>100 requests per minute</strong>{" "}
        per API key. Exceeding this limit returns a <code>429 Too Many
        Requests</code> response. Rate limit headers are included in every
        response:
      </p>
      <pre>
        <code>{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 97
X-RateLimit-Reset: 1680000000`}</code>
      </pre>
    </div>
  );
}
