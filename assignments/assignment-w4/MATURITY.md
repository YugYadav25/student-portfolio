# Richardson Maturity Model Evaluation

This document evaluates the Task Management API built in Practical 4 against the Richardson Maturity Model (RMM).

## Evaluation Table

| Level | Criterion | Does your API satisfy this? | Evidence |
| :--- | :--- | :--- | :--- |
| **Level 0 (The Swamp of POX)** | Uses HTTP as a transport mechanism but doesn't fully utilize its features. Usually a single URI and a single HTTP verb (like POST). | **Yes (and surpassed)** | The API exposes endpoints over HTTP (port 5000) for client-server communication. However, it does not stop at Level 0, as it uses multiple URIs and standard verbs. |
| **Level 1 (Resources)** | Uses multiple URIs, distinguishing between different resources (e.g., `/tasks`, `/tasks/1`) rather than a single generic endpoint. | **Yes** | The API explicitly distinguishes between the collection of tasks (`/tasks`) and individual tasks (`/tasks/:id`). |
| **Level 2 (HTTP Verbs & Status Codes)** | Uses standard HTTP verbs (GET, POST, PUT, DELETE) correctly and returns meaningful HTTP status codes (200, 201, 404, 500). | **Yes** | The API uses `GET /tasks` for reading, `POST /tasks` for creation (returns `201 Created`), `PUT /tasks/:id` for updating, and `DELETE /tasks/:id` for removing. It correctly handles error states by returning `400 Bad Request`, `404 Not Found`, and `500 Internal Server Error`. *(No code corrections were needed as the original implementation already fully satisfied Level 2).* |
| **Level 3 (Hypermedia Controls)** | HATEOAS (Hypermedia As The Engine Of Application State). Responses include links that tell the client what subsequent actions are possible. | **No** | The API currently only returns the raw task data (JSON representation) without providing navigational links to other related states or actions. |

---

## HATEOAS Awareness (Level 3 Target)

If we were to upgrade this API to reach **Level 3 (HATEOAS)**, we would modify the JSON responses to include hypermedia links. This allows the client to dynamically discover what actions it can perform on the resource without hardcoding URLs on the frontend.

Here is an example of what a Task response body would look like at Level 3:

```json
{
  "id": 123,
  "title": "Complete Assignment",
  "description": "Evaluate the API against RMM",
  "completed": false,
  "_links": {
    "self": "/tasks/123",
    "update": "/tasks/123",
    "delete": "/tasks/123",
    "collection": "/tasks"
  }
}
```

---

## Why Most Production APIs Stop at Level 2

Most real-world production APIs stop at Level 2 because it strikes the perfect balance between **standardization and simplicity**. Level 2 provides all the benefits of clear resource identification and correct HTTP semantics (making the API highly predictable and cacheable) without the significant overhead required to implement Level 3. Implementing HATEOAS (Level 3) requires complex backend logic to generate context-aware links for every response. Furthermore, modern frontend frameworks (like React or Angular) usually handle routing and state management internally. Therefore, the added complexity of generating and parsing hypermedia links often outweighs the theoretical benefits for most standard web applications, making Level 2 the pragmatic industry standard.
