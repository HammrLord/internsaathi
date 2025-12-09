import { NextResponse } from 'next/server';
import registry from '../../data/document_registry.json';

export async function POST(request) {
    try {
        const { name } = await request.json();

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simple name matching logic for demo purposes
        // In a real app, we would match document ID or use OCR
        let isVerified = false;
        let details = null;

        // Check education certificates
        const certificates = Object.values(registry.education_certificate);
        const match = certificates.find(cert =>
            cert.holder_name.toLowerCase() === name.toLowerCase()
        );

        if (match) {
            if (match.status === 'verified') {
                isVerified = true;
                details = match;
            } else {
                return NextResponse.json({
                    verified: false,
                    status: match.status,
                    message: `Document flagged: ${match.status}`
                });
            }
        } else {
            return NextResponse.json({
                verified: false,
                status: 'not_found',
                message: 'No matching record found in registry.'
            });
        }

        return NextResponse.json({
            verified: true,
            status: 'verified',
            method: 'API Setu / Digilocker Cross-Reference',
            details
        });

    } catch (error) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
