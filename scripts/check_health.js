
async function checkHealth() {
    const url = 'http://localhost:3000/api/auth/check-email'; // Recruiter Side API

    console.log(`Checking ${url}...`);
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com' })
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        try {
            const json = JSON.parse(text);
            console.log("Response JSON:", json);
        } catch (e) {
            console.log("Response Text (First 200 chars):", text.substring(0, 200));
        }
    } catch (e) {
        console.error("Fetch Error:", e.message);
    }
}

checkHealth();
