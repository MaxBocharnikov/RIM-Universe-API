import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { characters, type Character } from './data/characters';
import {
    getPathname,
    parseCharacterId,
    readAndParse,
    sendError,
    sendJson,
} from './lib/http';
import { parseCharacterInput, parseCharacterPatch } from './lib/validate';
import { StatusCodes } from 'http-status-codes';

function findCharacterIndex(id: string): number {
    return characters.findIndex((character) => character.id === id);
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
            const input = await readAndParse(req, res, parseCharacterInput);
            if (!input) return;

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
        const character = characters[index];
        if (index === -1 || !character) {
            sendError(res, StatusCodes.NOT_FOUND, 'Character not found');
            return;
        }

        switch (method) {
            case 'GET':
                sendJson(res, StatusCodes.OK, character);
                return;

            case 'PUT': {
                const input = await readAndParse(req, res, parseCharacterInput);
                if (!input) return;

                characters[index] = { id, ...input };
                sendJson(res, StatusCodes.OK, characters[index]);
                return;
            }

            case 'PATCH': {
                const patch = await readAndParse(req, res, parseCharacterPatch);
                if (!patch) return;

                characters[index] = { ...character, ...patch };
                sendJson(res, StatusCodes.OK, characters[index]);
                return;
            }

            case 'DELETE':
                characters.splice(index, 1);
                sendJson(res, StatusCodes.NO_CONTENT);
                return;

            default:
                sendError(res, StatusCodes.METHOD_NOT_ALLOWED, 'Method not allowed');
                return;
        }
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