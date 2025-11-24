import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestAuthModule } from '../src/auth/test-auth.module';
import { AuthModule } from '../src/auth/auth.module';
import * as path from 'path';
import * as fs from 'fs';

describe('ProductosController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
    })
    .overrideModule(AuthModule)
    .useModule(TestAuthModule)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get token
    const response = await request(app.getHttpServer()).post('/test-auth/login').send();
    jwtToken = response.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/productos (POST) - should create a product with an image', async () => {
    const imagePath = path.resolve(__dirname, 'test-image.jpg');
    fs.writeFileSync(imagePath, 'test image');

    const createProductoDto = {
      nombre: 'Test Product',
      descripcion: 'Test Description',
      precio: '100',
      stockInicial: '10',
      pesoKg: '1',
      dimensiones: JSON.stringify({largoCm: 1, anchoCm: 1, altoCm: 1}),
      ubicacion: JSON.stringify({pasillo: "A", estanteria: "1", estante: "1", caja: "1"}),
      categoriaIds: '[]',
    };

    const response = await request(app.getHttpServer())
      .post('/productos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .field('nombre', createProductoDto.nombre)
      .field('descripcion', createProductoDto.descripcion)
      .field('precio', createProductoDto.precio)
      .field('stockInicial', createProductoDto.stockInicial)
      .field('pesoKg', createProductoDto.pesoKg)
      .field('dimensiones', createProductoDto.dimensiones)
      .field('ubicacion', createProductoDto.ubicacion)
      .field('categoriaIds', createProductoDto.categoriaIds)
      .attach('imagenes', imagePath);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('mensaje', 'Producto creado exitosamente');

    // Verify the product was created
    const product = await request(app.getHttpServer())
      .get(`/productos/${response.body.id}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    
    expect(product.body.imagenes.length).toBe(1);
    expect(product.body.imagenes[0].url).toContain('/productos/uploads/');

    // Clean up the created image file
    const filename = product.body.imagenes[0].url.split('/').pop();
    fs.unlinkSync(path.resolve('./uploads', filename));
    fs.unlinkSync(imagePath);
  });
});
