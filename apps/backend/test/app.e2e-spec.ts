/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Pokedex API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same configuration as main.ts
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Pokemon Endpoints', () => {
    it('GET /api/v1/pokemons - should return list of pokemons', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pokemons')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('types');
        });
    });

    it('GET /api/v1/pokemons?limit=5 - should return limited pokemons', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pokemons?limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeLessThanOrEqual(5);
        });
    });

    it('GET /api/v1/pokemons/1 - should return Bulbasaur', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pokemons/1')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(1);
          expect(res.body.name).toBe('bulbasaur');
          expect(res.body).toHaveProperty('stats');
          expect(res.body).toHaveProperty('abilities');
        });
    });

    it('GET /api/v1/pokemons/999 - should return 404 for non-existent pokemon', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pokemons/999')
        .expect(404);
    });
  });

  describe('Search Endpoint', () => {
    it('GET /api/v1/search?query=pika - should find Pikachu', () => {
      return request(app.getHttpServer())
        .get('/api/v1/search?query=pika')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].name).toContain('pika');
        });
    });

    it('GET /api/v1/search?query=fire - should find fire type pokemons', () => {
      return request(app.getHttpServer())
        .get('/api/v1/search?query=fire')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Team Endpoints', () => {
    it('GET /api/v1/teams - should return list of teams', () => {
      return request(app.getHttpServer())
        .get('/api/v1/teams')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('POST /api/v1/teams - should fail without auth token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/teams')
        .send({ name: 'Test Team' })
        .expect(401);
    });

    it('POST /api/v1/teams - should create team with valid token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/teams')
        .set('Authorization', 'Bearer pokedex-secret-token-2024')
        .send({ name: 'My E2E Team' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('My E2E Team');
          expect(res.body).toHaveProperty('pokemons');
        });
    });

    it('POST /api/v1/teams - should fail with invalid token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/teams')
        .set('Authorization', 'Bearer wrong-token')
        .send({ name: 'Test Team' })
        .expect(401);
    });
  });
});
