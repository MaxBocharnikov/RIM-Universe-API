import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { characters, type Character } from './data/characters';
import {
    getPathname,
    parseCharacterId,
    readJsonBody,
    sendError,
    sendJson,
} from './lib/http';
import { parseCharacterInput, parseCharacterPatch } from './lib/validate';
import { StatusCodes } from 'http-status-codes';

function findCharacterIndex(id: string): number {
    return characters.findIndex((c) => c.id === id);
}

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const method = req.method ?? 'GET';
    const pathname = getPathname(req.url);

    if (method === 'GET' && pathname === '/health') {
        sendJson(res, StatusCodes.OK, { ok: true });
        return;
    }

    if (pathname === '/characters') {
        if (method === 'GET') {
            sendJson(res, StatusCodes.OK, characters);
            return;
        }

        if (method === 'POST') {
            let body: unknown;
            try {
                body = await readJsonBody(req);
            } catch {
                sendError(res, StatusCodes.BAD_REQUEST, 'Invalid JSON');
                return;
            }

            const input = parseCharacterInput(body);
            if (!input) {
                sendError(res, StatusCodes.BAD_REQUEST, 'Invalid character data');
                return;
            }

            const created: Character = { id: randomUUID(), ...input };
            characters.push(created);
            sendJson(res, StatusCodes.CREATED, created);
            return;
        }

        sendError(res, StatusCodes.METHOD_NOT_ALLOWED, 'Method not allowed');
        return;
    }

    const id = parseCharacterId(pathname);

    if (id) {
        const index = findCharacterIndex(id);

        if (method === 'GET') {
            if (index === -1) {
                sendError(res, StatusCodes.NOT_FOUND, 'Character not found');
                return;
            }
            sendJson(res, StatusCodes.OK, characters[index]);
            return;
        }

        if (method === 'PUT') {
            if (index === -1) {
                sendError(res, StatusCodes.NOT_FOUND, 'Character not found');
                return;
            }

            let body: unknown;
            try {
                body = await readJsonBody(req);
            } catch {
                sendError(res, StatusCodes.BAD_REQUEST, 'Invalid JSON');
                return;
            }

            const input = parseCharacterInput(body);
            if (!input) {
                sendError(res, StatusCodes.BAD_REQUEST, 'Invalid character data');
                return;
            }

            characters[index] = { id, ...input };
            sendJson(res, StatusCodes.OK, characters[index]);
            return;
        }

        if (method === 'PATCH') {
            const current = characters[index];
            if (!current || index === -1) {
                sendError(res, StatusCodes.NOT_FOUND, 'Character not found');
                return;
            }

            let body: unknown;
            try {
                body = await readJsonBody(req);
            } catch {
                sendError(res, StatusCodes.BAD_REQUEST, 'Invalid JSON');
                return;
            }

            const patch = parseCharacterPatch(body);
            if (!patch) {
                sendError(res, StatusCodes.BAD_REQUEST, 'Invalid patch data');
                return;
            }

            characters[index] = { ...current, ...patch };
            sendJson(res, StatusCodes.OK, characters[index]);
            return;
        }

        if (method === 'DELETE') {
            if (index === -1) {
                sendError(res, StatusCodes.NOT_FOUND, 'Character not found');
                return;
            }

            characters.splice(index, 1);
            sendJson(res, StatusCodes.NO_CONTENT);
            return;
        }

        sendError(res, StatusCodes.METHOD_NOT_ALLOWED, 'Method not allowed');
        return;
    }

    sendError(res, StatusCodes.NOT_FOUND, 'Not found');
}

const server = http.createServer((req, res) => {
    handleRequest(req, res).catch((err) => {
        console.error(err);
        if (!res.headersSent) {
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
        }
    });
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});