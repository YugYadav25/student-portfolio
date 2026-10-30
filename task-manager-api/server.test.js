const request = require('supertest');
const { app } = require('./server');

describe('Task Manager API', () => {
    test('GET /health returns 200', async () => {
        const response = await request(app).get('/health');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });

    test('unknown routes return 404', async () => {
        const response = await request(app).get('/not-a-real-route');

        expect(response.statusCode).toBe(404);
    });

    test('AI description generation requires authentication', async () => {
        const response = await request(app)
            .post('/api/ai/generate-description')
            .send({ title: 'Prepare practical report' });

        expect(response.statusCode).toBe(401);
    });
});
