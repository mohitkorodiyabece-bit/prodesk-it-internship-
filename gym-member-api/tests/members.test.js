import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { members } from '../src/data/members.js';

const validMember = {
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '9876543210',
  membershipType: 'Premium',
  joiningDate: '2026-07-14',
  isActive: true,
};

beforeEach(() => {
  members.length = 0;
});

describe('GET /api/health', () => {
  it('returns a healthy status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe('GET /api/members', () => {
  it('returns No data found when there are no members', async () => {
    const response = await request(app).get('/api/members');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('No data found');
    expect(response.body.data).toEqual([]);
  });

  it('returns all members', async () => {
    await request(app).post('/api/members').send(validMember);

    const response = await request(app).get('/api/members');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('returns No data found for an empty search result', async () => {
    await request(app).post('/api/members').send(validMember);

    const response = await request(app).get(
      '/api/members?search=nonexistent',
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('No data found');
    expect(response.body.data).toEqual([]);
  });
});

describe('GET /api/members/:id', () => {
  it('returns a single member by id', async () => {
    const createResponse = await request(app)
      .post('/api/members')
      .send(validMember);

    const { id } = createResponse.body.data;

    const response = await request(app).get(`/api/members/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(id);
  });

  it('returns 404 for an unknown member', async () => {
    const response = await request(app).get(
      '/api/members/unknown-id',
    );

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});

describe('POST /api/members', () => {
  it('creates a valid member', async () => {
    const response = await request(app)
      .post('/api/members')
      .send(validMember);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(validMember.email);
  });

  it('rejects an invalid email', async () => {
    const response = await request(app)
      .post('/api/members')
      .send({
        ...validMember,
        email: 'not-an-email',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toHaveProperty('email');
  });

  it('rejects a missing name', async () => {
    const memberWithoutName = { ...validMember };
    delete memberWithoutName.name;

    const response = await request(app)
      .post('/api/members')
      .send(memberWithoutName);

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveProperty('name');
  });

  it('rejects a duplicate email', async () => {
    await request(app).post('/api/members').send(validMember);

    const response = await request(app)
      .post('/api/members')
      .send({
        ...validMember,
        phone: '9876543211',
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });
});

describe('PUT /api/members/:id', () => {
  it('updates a member', async () => {
    const createResponse = await request(app)
      .post('/api/members')
      .send(validMember);

    const { id } = createResponse.body.data;

    const response = await request(app)
      .put(`/api/members/${id}`)
      .send({
        name: 'Updated Name',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('Updated Name');
  });
});

describe('DELETE /api/members/:id', () => {
  it('deletes a member', async () => {
    const createResponse = await request(app)
      .post('/api/members')
      .send(validMember);

    const { id } = createResponse.body.data;

    const response = await request(app).delete(
      `/api/members/${id}`,
    );

    expect(response.status).toBe(200);

    const getResponse = await request(app).get(
      `/api/members/${id}`,
    );

    expect(getResponse.status).toBe(404);
  });
});