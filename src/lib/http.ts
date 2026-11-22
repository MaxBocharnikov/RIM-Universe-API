import type http from 'node:http';
import { StatusCodes } from 'http-status-codes';

const JSON_TYPE = 'application/json';

export function getPathname(url: string | undefined): string {
    return (url ?? '').split('?')[0] as string;
}

export function parseCharacterId(pathname: string): string | null {
    const match = pathname.match(/^\/characters\/([^/]+)$/);
    return match?.[1] ?? null;
}

export function readJsonBody(req: http.IncomingMessage): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];

        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('error', reject);
        req.on('end', () => {
            const raw = Buffer.concat(chunks).toString('utf8');

            if (!raw.trim()) {
                resolve(null);
                return;
            }

            try {
                resolve(JSON.parse(raw));
            } catch {
                reject(new SyntaxError('Invalid JSON'));
            }
        });
    });
}

export function sendJson(
    res: http.ServerResponse,
    status: number,
    body?: unknown,
): void {
    if (status === StatusCodes.NO_CONTENT) {
        res.writeHead(StatusCodes.NO_CONTENT);
        res.end();
        return;
    }

    res.writeHead(status, { 'Content-Type': JSON_TYPE });
    res.end(JSON.stringify(body));
}

export function sendError(res: http.ServerResponse, status: number, message: string): void {
    sendJson(res, status, { error: message });
}