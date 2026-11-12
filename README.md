# RIM-Universe-API

## Requirements
- **Node.js 24.x**

```bash
nvm install
nvm use
```

## Installation

```bash
npm install
```

## Running

Development mode

```bash
npm run dev
```

Production mode

```bash
npm start
```

## API


### Endpoints

| Method   | Path                | Description                            | Success        |
| -------- | ------------------- | -------------------------------------- | -------------- |
| `GET`    | `/health`           | Health check                           | `200 OK`       |
| `GET`    | `/characters`       | List all characters                    | `200 OK`       |
| `POST`   | `/characters`       | Create a character                     | `201 Created`  |
| `GET`    | `/characters/:id`   | Get one character                      | `200 OK`       |
| `PUT`    | `/characters/:id`   | Replace a character (all fields)       | `200 OK`       |
| `PATCH`  | `/characters/:id`   | Partially update a character           | `200 OK`       |
| `DELETE` | `/characters/:id`   | Delete a character                     | `204 No Content` |

Error responses have the shape `{ "error": "<message>" }` with an appropriate
status code (`400`, `404`, `405`, `500`).

### `POST /characters`

Creates a character

```json
{
    "name": "Summer Smith",
    "status": "alive",
    "species": "Human",
    "location": "Earth (Replacement Dimension)",
    "gender": "female",
    "age": 17
}
```

Response `201 Created`:

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "Summer Smith",
    "status": "alive",
    "species": "Human",
    "location": "Earth (Replacement Dimension)",
    "gender": "female",
    "age": 17
}
```

### `PUT /characters/:id`

Replaces every field of an existing character.

```json
{
    "name": "Rick Sanchez",
    "status": "alive",
    "species": "Human",
    "location": "Citadel of Ricks",
    "gender": "male",
    "age": 70
}
```

### `PATCH /characters/:id`

Updates only the provided fields.

```json
{
    "status": "dead",
    "location": "Unknown"
}
```
