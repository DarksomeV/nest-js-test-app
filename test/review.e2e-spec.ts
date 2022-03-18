import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../dist/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();
const productIdFake = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'Header',
  description: 'Descr',
  rating: 5,
  productId
}
const loginDto: AuthDto = {
  login: "hello@email.com",
  password: "test123",
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer()).post('/auth/login').send(loginDto);
    token = body.access_token;
  });

  it('/review/create (POST)', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        console.log(createdId);
        expect(createdId).toBeDefined();
      });
  });

  it('/review/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400)
  });

  it('/byProduct/:productId (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
      })
  });

  it('/byProduct/:productId (GET) - failure', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + productIdFake)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      })
  });

  it('/review/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  });

  it('/review/:id (DELETE) - failure', () => {
    return request(app.getHttpServer())
      .delete('/review/' + productIdFake)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      })
  });

  afterAll(() => {
    disconnect();
  })
});
