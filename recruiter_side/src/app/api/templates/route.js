import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'emailTemplates.json');

function getTemplates() {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileData);
}

function saveTemplates(templates) {
    fs.writeFileSync(dataFilePath, JSON.stringify(templates, null, 2));
}

export async function GET() {
    try {
        const templates = getTemplates();
        return NextResponse.json({ templates });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const templates = getTemplates();

        // Update existing or add new
        const index = templates.findIndex(t => t.id === body.id);
        if (index !== -1) {
            templates[index] = { ...templates[index], ...body };
        } else {
            templates.push({ id: Date.now().toString(), ...body });
        }

        saveTemplates(templates);
        return NextResponse.json({ success: true, templates });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
