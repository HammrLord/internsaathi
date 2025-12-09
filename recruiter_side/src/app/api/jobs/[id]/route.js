import { NextResponse } from 'next/server';
import { query } from "@/lib/db";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        // Fetch job details
        const jobResult = await query(
            'SELECT * FROM jobs WHERE id = $1',
            [parseInt(id)]
        );

        if (jobResult.rows.length === 0) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const job = jobResult.rows[0];

        // Fetch real-time applicant count
        const countResult = await query('SELECT COUNT(*) FROM candidates WHERE job_id = $1', [parseInt(id)]);
        job.applicants_count = parseInt(countResult.rows[0].count);

        return NextResponse.json(job);
    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        let queryText = 'UPDATE jobs SET ';
        const values = [];
        let index = 1;

        if (body.description) {
            queryText += `description = $${index++} `;
            values.push(body.description);
        }

        // Check if we have anything to update
        if (values.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        queryText += `WHERE id = $${index} RETURNING *`;
        values.push(parseInt(id));

        const result = await query(queryText, values);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const job = result.rows[0];
        // Fetch real-time applicant count again to return complete object
        const countResult = await query('SELECT COUNT(*) FROM candidates WHERE job_id = $1', [parseInt(id)]);
        job.applicants_count = parseInt(countResult.rows[0].count);

        return NextResponse.json(job);
    } catch (error) {
        console.error("Error updating job:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // Cascade Delete: Remove candidates first
        await query('DELETE FROM candidates WHERE job_id = $1', [parseInt(id)]);

        // Now delete the job
        const result = await query('DELETE FROM jobs WHERE id = $1 RETURNING id', [parseInt(id)]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Job and associated candidates deleted successfully', id: parseInt(id) });
    } catch (error) {
        console.error("Error deleting job:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
