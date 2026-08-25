const { createClient } = require("@libsql/client");
const c = createClient({
  url: "libsql://resume-builder-jamescowx.aws-us-west-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODcyODY3OTIsImlkIjoiMDFhMDIyOTctZWQwMS03N2U5LWI2MTUtMjg5NDZiOGY0ODVjIiwia2lkIjoic0FKcFFYSm52RjRXR3lIOHd6X0h1U1E4cXZ2bTE2WC16RnNudWp6MXVEOCIsInJpZCI6IjE4ZGYzZTExLTZjOTktNDdiOS05NTIzLTg2YTJjYjFjYjk3ZSJ9.cE5gIsGkDCHGwPfQzkuaumEK37UkZBtJrNgVu-GvojFzQ6u_-N0i85j8NrZw8wUXiqVWhSV2PBq1qVk5Pki1Cg"
});

async function test() {
  try {
    await c.execute("CREATE TABLE IF NOT EXISTS shares (id TEXT PRIMARY KEY, kind TEXT NOT NULL, name TEXT NOT NULL DEFAULT '', payload TEXT NOT NULL, created_at INTEGER NOT NULL)");
    console.log("Table created OK");

    await c.execute({ sql: "INSERT INTO shares (id, kind, name, payload, created_at) VALUES (?, ?, ?, ?, ?)", args: ["test123", "resume", "test", "{}", Date.now()] });
    console.log("Insert OK");

    const r = await c.execute({ sql: "SELECT * FROM shares WHERE id = ?", args: ["test123"] });
    console.log("Select OK:", r.rows);

    await c.execute({ sql: "DELETE FROM shares WHERE id = ?", args: ["test123"] });
    console.log("Delete OK");
  } catch (e) {
    console.error("FAIL:", e.message);
  }
}

test();
