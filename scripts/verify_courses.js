
async function verifyCourseApi() {
    const baseUrl = 'http://localhost:3000/api/courses/nptel';

    // Test 1: No params (Should return default top courses)
    try {
        console.log("Test 1: Default Courses");
        const res = await fetch(baseUrl);
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            console.log(`- Count: ${data.courses.length}`);
            console.log(`- First: ${data.courses[0].title}`);
        } catch (e) {
            console.error("Test 1 Failed: Not JSON");
            console.log("Response Preview:", text.substring(0, 500));
        }
    } catch (e) { console.error("Test 1 Failed", e.message); }

    // Test 2: Filter by Skill 'python'
    try {
        console.log("\nTest 2: Filter by 'python'");
        const res = await fetch(`${baseUrl}?skills=python`);
        const data = await res.json();
        console.log(`- Count: ${data.courses.length}`);
        data.courses.forEach(c => console.log(`  - ${c.title} [${c.discipline}]`));
    } catch (e) { console.error("Test 2 Failed", e.message); }

    // Test 3: Filter by Search 'marketing'
    try {
        console.log("\nTest 3: Search 'marketing'");
        const res = await fetch(`${baseUrl}?search=marketing`);
        const data = await res.json();
        console.log(`- Count: ${data.courses.length}`);
        data.courses.forEach(c => console.log(`  - ${c.title}`));
    } catch (e) { console.error("Test 3 Failed", e.message); }
}

verifyCourseApi();
