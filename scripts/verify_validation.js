
const baseUrl = 'http://localhost:3000'; // Recruiter Side handles Auth APIs

async function testValidation() {
    console.log("--- Testing Name Validation ---");

    // Test Case: Invalid Name with Digits
    const invalidPayload = {
        name: "Rahul123",
        email: "test.validation@example.com",
        password: "Password123!"
    };

    try {
        console.log(`Sending Signup Request with Invalid Name: "${invalidPayload.name}"`);
        const res = await fetch(`${baseUrl}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invalidPayload)
        });

        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log(`Response:`, data);

        if (res.status === 400 && data.error && data.error.includes('digits')) {
            console.log("✅ PASS: API correctly rejected name with digits.");
        } else {
            console.error("❌ FAIL: API did not reject invalid name as expected.");
        }

    } catch (e) {
        console.log("Error:", e.message);
    }
}

testValidation();
