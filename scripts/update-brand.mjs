import { createClient } from "@libsql/client";

const client = createClient({ url: "file:./db.sqlite" });

async function main() {
  console.log("Updating room names & descriptions in db.sqlite...");
  const res1 = await client.execute(
    "UPDATE rooms SET name = REPLACE(name, 'Là Em', 'M_Dalats'), description = REPLACE(description, 'Là Em', 'M_Dalats'), shortDescription = REPLACE(shortDescription, 'Là Em', 'M_Dalats')"
  );
  console.log("Updated rows affected:", res1.rowsAffected);

  const res2 = await client.execute("SELECT id, name, shortDescription FROM rooms");
  console.log("Current rooms in database:");
  for (const r of res2.rows) {
    console.log(`- [${r.id}] ${r.name}: ${r.shortDescription}`);
  }
}

main().catch(console.error);
