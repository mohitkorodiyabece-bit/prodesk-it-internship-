import { useState } from "react";
import "./App.css";

const entities = [
  {
    name: "User",
    purpose: "Stores staff, manager, and administrator accounts.",
    fields: [
      "_id: ObjectId",
      "name: String",
      "email: String (unique)",
      "passwordHash: String",
      "role: staff | manager | admin",
      "createdAt: Date",
      "updatedAt: Date",
    ],
  },
  {
    name: "Property",
    purpose: "Stores permanent property-listing information.",
    fields: [
      "_id: ObjectId",
      "title: String",
      "description: String",
      "propertyType: String",
      "price: Number",
      "status: available | sold | rented | inactive",
      "address: Object",
      "bedrooms: Number",
      "bathrooms: Number",
      "area: Number",
      "images: String[]",
      "createdBy: ObjectId → User",
      "createdAt: Date",
      "updatedAt: Date",
    ],
  },
];

const apiContracts = [
  {
    method: "GET",
    endpoint: "/api/properties",
    purpose: "Return paginated property listings with filters and search.",
    success: "200 OK",
    errors: "400 Invalid query parameters, 500 Internal server error",
  },
  {
    method: "GET",
    endpoint: "/api/properties/:id",
    purpose: "Return one property by its unique identifier.",
    success: "200 OK",
    errors: "400 Invalid ID, 404 Property not found",
  },
  {
    method: "POST",
    endpoint: "/api/properties",
    purpose: "Create a new property listing and invalidate list caches.",
    success: "201 Created",
    errors: "400 Validation failed, 401 Unauthorized",
  },
  {
    method: "PUT",
    endpoint: "/api/properties/:id",
    purpose: "Update a property and invalidate related Redis keys.",
    success: "200 OK",
    errors: "400 Validation failed, 404 Property not found",
  },
  {
    method: "DELETE",
    endpoint: "/api/properties/:id",
    purpose: "Delete a property and remove its cached data.",
    success: "200 OK",
    errors: "404 Property not found, 403 Forbidden",
  },
  {
    method: "DELETE",
    endpoint: "/api/cache/properties",
    purpose: "Allow managers or admins to clear property-listing caches.",
    success: "200 OK",
    errors: "401 Unauthorized, 403 Forbidden",
  },
];

const redisKeys = [
  {
    key: "property:{propertyId}",
    content: "Single property details",
    ttl: "300 seconds",
  },
  {
    key: "properties:list:{page}:{limit}",
    content: "Paginated property list",
    ttl: "120 seconds",
  },
  {
    key: "properties:search:{query}",
    content: "Sanitized search results",
    ttl: "120 seconds",
  },
  {
    key: "properties:city:{city}",
    content: "Properties filtered by city",
    ttl: "180 seconds",
  },
  {
    key: "properties:status:{status}",
    content: "Properties filtered by status",
    ttl: "180 seconds",
  },
];

const requirements = [
  {
    title: "Empty states",
    detail:
      'Return an empty data array and display the message "No data found" instead of a blank screen.',
  },
  {
    title: "Slow connectivity",
    detail:
      "Display an accessible loading indicator and temporarily disable repeated actions.",
  },
  {
    title: "Invalid inputs",
    detail:
      "Prevent submission, apply an error style, and connect each message to its input.",
  },
  {
    title: "Redis unavailable",
    detail:
      "Log the cache failure and continue retrieving information directly from the main database.",
  },
  {
    title: "Security",
    detail:
      "Validate and sanitize all text input before storage. Keep credentials in environment variables.",
  },
  {
    title: "Accessibility",
    detail:
      "Use semantic HTML, keyboard navigation, visible focus states, ARIA labels, and sufficient contrast.",
  },
];

function App() {
  const [copyStatus, setCopyStatus] = useState("");

  const copyEndpoint = async (endpoint) => {
    try {
      await navigator.clipboard.writeText(endpoint);
      setCopyStatus(`${endpoint} copied to clipboard.`);
      console.log("[Analytics] User interacted with Redis Caching");
    } catch {
      setCopyStatus("Unable to copy the endpoint. Please copy it manually.");
    }
  };

  return (
    <>
      <header className="site-header">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>

        <div className="header-inner">
          <a className="brand" href="#overview" aria-label="Redis architecture home">
            <span className="brand-mark" aria-hidden="true">
              R
            </span>

            <span>
              Redis Architecture
              <small>Property Listings</small>
            </span>
          </a>

          <nav aria-label="Primary navigation">
            <a href="#schema">Schema</a>
            <a href="#erd">ERD</a>
            <a href="#api">API</a>
            <a href="#cache">Caching</a>
            <a href="#quality">Quality</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="overview">
          <div className="hero-content">
            <p className="eyebrow">ENG-134560 · P1 HIGH PRIORITY</p>

            <h1>Redis Caching Architecture for Property Listings</h1>

            <p className="hero-description">
              Definitive database schema, entity relationships, API contracts,
              Redis caching strategy, failure handling, and enterprise quality
              planning.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#schema">
                View architecture
              </a>

              <a className="button button-secondary" href="#api">
                Review API contracts
              </a>
            </div>
          </div>

          <aside className="ticket-card" aria-label="Ticket information">
            <h2>Ticket overview</h2>

            <dl>
              <div>
                <dt>Ticket ID</dt>
                <dd>ENG-134560</dd>
              </div>

              <div>
                <dt>Epic</dt>
                <dd>Core Infrastructure Overhaul</dd>
              </div>

              <div>
                <dt>Story points</dt>
                <dd>5</dd>
              </div>

              <div>
                <dt>Owner</dt>
                <dd>Mohit Karodiya</dd>
              </div>

              <div>
                <dt>Deliverable</dt>
                <dd>Architecture planning</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="section" id="schema">
          <div className="section-heading">
            <p className="eyebrow">DATABASE DESIGN</p>
            <h2>Definitive schema</h2>
            <p>
              MongoDB remains the permanent source of truth. Redis stores
              temporary copies of frequently requested property data.
            </p>
          </div>

          <div className="entity-grid">
            {entities.map((entity) => (
              <article className="entity-card" key={entity.name}>
                <div className="entity-header">
                  <h3>{entity.name}</h3>
                  <span>MongoDB collection</span>
                </div>

                <p>{entity.purpose}</p>

                <ul>
                  {entity.fields.map((field) => (
                    <li key={field}>
                      <code>{field}</code>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-muted" id="erd">
          <div className="section-heading">
            <p className="eyebrow">ENTITY RELATIONSHIP DIAGRAM</p>
            <h2>User-to-property relationship</h2>
            <p>
              One authenticated user can create multiple property listings.
              Every property records its creator through the createdBy field.
            </p>
          </div>

          <div
            className="erd"
            role="img"
            aria-label="One user can create many property listings"
          >
            <div className="erd-entity">
              <strong>USER</strong>
              <span>_id</span>
              <span>name</span>
              <span>email</span>
              <span>role</span>
            </div>

            <div className="erd-relationship" aria-hidden="true">
              <span>1</span>
              <div className="relationship-line" />
              <strong>creates</strong>
              <div className="relationship-line" />
              <span>many</span>
            </div>

            <div className="erd-entity">
              <strong>PROPERTY</strong>
              <span>_id</span>
              <span>title</span>
              <span>price</span>
              <span>status</span>
              <span>createdBy</span>
            </div>
          </div>
        </section>

        <section className="section" id="api">
          <div className="section-heading">
            <p className="eyebrow">API CONTRACTS</p>
            <h2>Planned REST endpoints</h2>
            <p>
              Each endpoint uses predictable status codes, structured JSON
              responses, validation, and graceful error handling.
            </p>
          </div>

          <p className="sr-status" aria-live="polite">
            {copyStatus}
          </p>

          <div className="api-list">
            {apiContracts.map((contract) => (
              <article
                className="api-card"
                key={`${contract.method}-${contract.endpoint}`}
              >
                <div className="api-main">
                  <span className={`method method-${contract.method.toLowerCase()}`}>
                    {contract.method}
                  </span>

                  <div>
                    <h3>
                      <code>{contract.endpoint}</code>
                    </h3>
                    <p>{contract.purpose}</p>
                  </div>
                </div>

                <dl className="api-details">
                  <div>
                    <dt>Success</dt>
                    <dd>{contract.success}</dd>
                  </div>

                  <div>
                    <dt>Failure states</dt>
                    <dd>{contract.errors}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  className="copy-button"
                  aria-label={`Copy endpoint ${contract.endpoint}`}
                  onClick={() => copyEndpoint(contract.endpoint)}
                >
                  Copy endpoint
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-muted" id="cache">
          <div className="section-heading">
            <p className="eyebrow">CACHE-ASIDE STRATEGY</p>
            <h2>Redis key and expiration plan</h2>
            <p>
              Reads check Redis first. Cache misses retrieve data from MongoDB,
              store a temporary copy, and then return the response.
            </p>
          </div>

          <div className="flow" aria-label="Redis cache-aside request flow">
            <div>Client request</div>
            <span aria-hidden="true">→</span>
            <div>Check Redis</div>
            <span aria-hidden="true">→</span>
            <div>Cache hit?</div>
            <span aria-hidden="true">→</span>
            <div>Return cached data</div>
          </div>

          <div className="table-wrapper">
            <table>
              <caption>Planned Redis keys and expiration times</caption>
              <thead>
                <tr>
                  <th scope="col">Redis key</th>
                  <th scope="col">Cached content</th>
                  <th scope="col">TTL</th>
                </tr>
              </thead>

              <tbody>
                {redisKeys.map((item) => (
                  <tr key={item.key}>
                    <td>
                      <code>{item.key}</code>
                    </td>
                    <td>{item.content}</td>
                    <td>{item.ttl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <article className="fallback-card">
            <h3>Redis failure fallback</h3>
            <p>
              Redis is an optimization, not the source of truth. If Redis is
              unavailable, the server logs the failure and reads directly from
              MongoDB so the application remains functional.
            </p>
          </article>
        </section>

        <section className="section" id="quality">
          <div className="section-heading">
            <p className="eyebrow">ENTERPRISE QUALITY</p>
            <h2>Unhappy paths and non-functional requirements</h2>
            <p>
              The implementation plan covers usability, resilience, security,
              accessibility, and telemetry before feature development begins.
            </p>
          </div>

          <div className="requirements-grid">
            {requirements.map((requirement) => (
              <article className="requirement-card" key={requirement.title}>
                <span aria-hidden="true">✓</span>
                <div>
                  <h3>{requirement.title}</h3>
                  <p>{requirement.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>
          ENG-134560 · Property Listings Redis Caching · Architecture Phase
        </p>
      </footer>
    </>
  );
}

export default App;