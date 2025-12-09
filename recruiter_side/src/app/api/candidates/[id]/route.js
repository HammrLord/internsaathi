import { NextResponse } from 'next/server';
import { query } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { status, current_round } = await request.json();

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        // Build query dynamically based on provided fields
        const updates = [];
        const values = [];
        let idx = 1;

        if (status) {
            updates.push(`status = $${idx++}`);
            values.push(status);
        }
        if (current_round) {
            updates.push(`current_round = $${idx++}`);
            values.push(current_round);
        }

        values.push(id); // ID is the last param

        const sql = `UPDATE candidates SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`;

        const result = await query(sql, values);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating candidate:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
