import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function getTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return null;
}

export async function GET(request: NextRequest) {
    try {
        // Intentar obtener el token del header primero
        let token = getTokenFromRequest(request);

        // Si no hay token en el header, intentar obtenerlo de la sesión del servidor
        if (!token) {
            console.log('No token in header, trying session...');
            const session = await getServerSession(authOptions);
            token = session?.accessToken || null;
            console.log('Session token exists:', !!token);
        }

        if (!token) {
            console.error('API Route - No token available');
            return NextResponse.json({ error: 'No autorizado - Token no disponible' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        const apiUrl = `https://api.cubells.com.ar/stock/categorias${queryString ? `?${queryString}` : ''}`;
        console.log('Fetching from:', apiUrl);

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        console.log('Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', response.status, errorText);
            return NextResponse.json(
                { error: `Error del backend: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Categories fetched successfully:', data.length || 0);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        let token = getTokenFromRequest(request);

        if (!token) {
            const session = await getServerSession(authOptions);
            token = session?.accessToken || null;
        }

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();

        const response = await fetch('https://api.cubells.com.ar/stock/categorias', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', response.status, errorText);
            return NextResponse.json(
                { error: 'Error al crear categoría' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
