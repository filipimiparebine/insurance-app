export const metadata = {
  title: "Authentication",
  description:
    "Learn how to authenticate with the blaj.io API using API keys, manage keys, and follow security best practices.",
};

export default function AuthenticationPage() {
  return (
    <div>
      <h1>Authentication</h1>
      <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: "2rem" }}>
        The blaj.io API uses API keys for authentication. All requests must
        include a valid key.
      </p>

      <h2>API Keys</h2>
      <p>
        API keys are long-lived bearer tokens that authenticate requests to the
        blaj.io API. Each key is scoped to a single user account and inherits
        that user&apos;s permissions.
      </p>

      <h3>Include the Key</h3>
      <p>
        Pass the API key in the <code>Authorization</code> header of every
        request:
      </p>

      <div className="code-label">HTTP Header</div>
      <pre>
        <code>Authorization: Bearer YOUR_API_KEY</code>
      </pre>

      <div className="code-label">cURL</div>
      <pre>
        <code>{`curl https://api.blaj.io/public/quotes/create \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ ... }'`}</code>
      </pre>

      <div className="code-label">Node.js</div>
      <pre>
        <code>{`const response = await fetch("https://api.blaj.io/public/quotes/create", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.BLAJ_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});`}</code>
      </pre>

      <div className="code-label">Python</div>
      <pre>
        <code>{`import requests

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}

response = requests.post(
    "https://api.blaj.io/public/quotes/create",
    headers=headers,
    json=payload,
)`}</code>
      </pre>

      <h2>Managing API Keys</h2>

      <h3>Create a Key</h3>
      <ol>
        <li>
          Sign in to your{" "}
          <a href="https://blaj.io" target="_blank" rel="noopener">
            blaj.io
          </a>{" "}
          account
        </li>
        <li>
          Go to <strong>Settings &rarr; API Keys</strong>
        </li>
        <li>Click <strong>Generate API Key</strong></li>
        <li>Give it a descriptive name (e.g., &quot;Production backend&quot;)</li>
        <li>
          Copy the key immediately — it will only be shown once
        </li>
      </ol>

      <h3>Rotate a Key</h3>
      <ol>
        <li>Create a new key</li>
        <li>Deploy the new key to your application</li>
        <li>Verify the new key works</li>
        <li>Revoke the old key</li>
      </ol>

      <h3>Revoke a Key</h3>
      <p>
        From <strong>Settings &rarr; API Keys</strong>, click the revoke button
        next to the key you want to invalidate. Revoked keys stop working
        immediately.
      </p>

      <h2>Security Best Practices</h2>
      <ul>
        <li>
          <strong>Never commit API keys to version control.</strong> Use
          environment variables (<code>BLAJ_API_KEY</code>) and{" "}
          <code>.env</code> files (add <code>.env</code> to{" "}
          <code>.gitignore</code>).
        </li>
        <li>
          <strong>Rotate keys regularly</strong> — at minimum every 90 days, or
          immediately if you suspect a key has been exposed.
        </li>
        <li>
          <strong>Use separate keys per environment</strong> — one key for
          development/staging, another for production.
        </li>
        <li>
          <strong>Restrict key usage by IP</strong> — configure allowed IP
          ranges in your API key settings.
        </li>
        <li>
          <strong>Monitor key usage</strong> — check the API dashboard for
          unusual request patterns or spikes.
        </li>
        <li>
          <strong>Use HTTPS exclusively</strong> — the API rejects plain HTTP
          requests. API keys sent over HTTP are exposed.
        </li>
      </ul>

      <h2>Error Handling</h2>
      <p>Authentication errors return these HTTP status codes:</p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "0.5rem 0.75rem",
                borderBottom: "2px solid var(--color-border)",
              }}
            >
              Status
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "0.5rem 0.75rem",
                borderBottom: "2px solid var(--color-border)",
              }}
            >
              Meaning
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                padding: "0.5rem 0.75rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <code>401</code>
            </td>
            <td
              style={{
                padding: "0.5rem 0.75rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              Missing or invalid <code>Authorization</code> header
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "0.5rem 0.75rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <code>403</code>
            </td>
            <td
              style={{
                padding: "0.5rem 0.75rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              Valid key but insufficient permissions for the requested resource
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "0.5rem 0.75rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <code>410</code>
            </td>
            <td
              style={{
                padding: "0.5rem 0.75rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              API key has been revoked
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Example: Full Request with Authentication</h2>
      <div className="code-label">cURL</div>
      <pre>
        <code>{`# 1. Create a quote
curl https://api.blaj.io/public/quotes/create \\
  -H "Authorization: Bearer sk_live_abc123..." \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: $(uuidgen)" \\
  -d '{
    "vehicle": {
      "plateNumber": "B 123 ABC",
      "category": "B",
      "seats": 5,
      "mass": 1500,
      "power": 75,
      "fuelType": "diesel",
      "vin": "WVWZZZ3CZWE123456"
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
  }'

# 2. Get user profile
curl https://api.blaj.io/public/account/getProfile \\
  -H "Authorization: Bearer sk_live_abc123..."

# 3. List policies
curl https://api.blaj.io/public/policies/list \\
  -H "Authorization: Bearer sk_live_abc123..."`}</code>
      </pre>
    </div>
  );
}
