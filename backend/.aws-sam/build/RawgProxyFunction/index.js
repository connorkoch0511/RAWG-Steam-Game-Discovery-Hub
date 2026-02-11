const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");

const sm = new SecretsManagerClient({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

let cachedKey = null;

async function getApiKey() {
  if (cachedKey) return cachedKey;

  const secretName = process.env.RAWG_SECRET_NAME;
  const resp = await sm.send(new GetSecretValueCommand({ SecretId: secretName }));

  const secretStr = resp.SecretString?.trim();
  if (!secretStr) throw new Error("RAWG secret is empty");

  // If secret is stored as key/value JSON, pull the key out.
  let key = secretStr;
  try {
    const obj = JSON.parse(secretStr);
    key = obj.apiKey || obj.apikey || obj.key || obj.RAWG_API_KEY;
  } catch {
    // plaintext secret; keep as-is
  }

  if (!key) throw new Error("RAWG API key is not found");
  cachedKey = String(key).trim();
  return cachedKey;
}

function hashKey(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

function getProxyPath(event) {
  // Expect: /api/rawg/...
  const rawPath = event.rawPath || event.path || "";
  return rawPath.replace(/^\/api\/rawg/, "");
}

function buildUrl(base, path, query) {
  const url = new URL(`${base}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }
  return url;
}

exports.handler = async (event) => {
  try {
    const apiBase = process.env.RAWG_API_BASE || "https://api.rawg.io/api";
    const cacheTable = process.env.CACHE_TABLE;
    const ttlSeconds = Number(process.env.CACHE_TTL_SECONDS || "21600");
    const apiKey = await getApiKey();

    const path = getProxyPath(event);
    if (!path || path === "/") {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing RAWG path" }) };
    }

    const url = buildUrl(apiBase, path, event.queryStringParameters || {});
    url.searchParams.set("key", apiKey);

    // Cache key: full URL (including query)
    const pk = hashKey(url.toString());

    // Try cache first
    if (cacheTable) {
      const cached = await ddb.send(new GetCommand({ TableName: cacheTable, Key: { pk } }));
      if (cached?.Item?.response) {
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=60",
            "X-Cache": "HIT",
          },
          body: cached.Item.response,
        };
      }
    }

    const resp = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    const text = await resp.text();

    // Only cache successful responses
    if (resp.ok && cacheTable) {
      const now = Math.floor(Date.now() / 1000);
      await ddb.send(
        new PutCommand({
          TableName: cacheTable,
          Item: { pk, response: text, ttl: now + ttlSeconds },
        })
      );
    }

    return {
      statusCode: resp.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // tighten to your CloudFront domain later
        "Cache-Control": "public, max-age=60",
        "X-Cache": "MISS",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message || "Unknown error" }),
    };
  }
};