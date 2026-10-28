async function testFullFlow() {
  // 1. Sign In
  const r = await fetch("http://localhost:3000/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Origin": "http://localhost:3000" },
    body: JSON.stringify({ email: "admin@dalats.vn", password: "Admin@123" })
  });

  const cookie = r.headers.get("set-cookie");
  console.log("Login Status:", r.status);
  console.log("Cookie:", cookie);

  // 2. Get Session
  const sessionRes = await fetch("http://localhost:3000/api/auth/get-session", {
    headers: { cookie: cookie || "" }
  });
  console.log("Get-Session Status:", sessionRes.status);
  const sessionData = await sessionRes.json();
  console.log("Get-Session Data:", JSON.stringify(sessionData, null, 2));

  // 3. Test Admin Page request
  const adminRes = await fetch("http://localhost:3000/admin", {
    headers: { cookie: cookie || "" },
    redirect: "manual"
  });
  console.log("Admin Page Status:", adminRes.status);
  console.log("Admin Page Location:", adminRes.headers.get("location"));
}

testFullFlow();
