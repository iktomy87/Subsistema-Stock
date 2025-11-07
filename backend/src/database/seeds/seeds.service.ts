import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { Reserva } from '../../reservas/entities/reserva.entity';
import { Dimensiones } from '../../productos/entities/dimensiones.entity';
import { UbicacionAlmacen } from '../../productos/entities/ubicacion-almacen.entity';
import { DetalleReserva } from 'src/reservas/entities/detalle-reserva.entity';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Dimensiones)
    private readonly dimensionesRepository: Repository<Dimensiones>,
    @InjectRepository(UbicacionAlmacen)
    private readonly ubicacionRepository: Repository<UbicacionAlmacen>,
    @InjectRepository(DetalleReserva)
    private readonly detalleRepository: Repository<DetalleReserva>,  
  ) {}

  async loadData() {
    // --- INICIO DE MODIFICACIÓN ---
    // 1. Verificar si ya hay datos en la base de datos
    const count = await this.categoriaRepository.count();

    // 2. Si hay datos (count > 0), omitir el seeding
    if (count > 0) {
      console.log('La base de datos ya tiene datos. Omitiendo el seeding.');
      return;
    }

    // 3. Si no hay datos, proceder con el seeding
    console.log('Base de datos vacía. Iniciando el seeding...');
    await this.clearData();
    // --- FIN DE MODIFICACIÓN ---

    const categorias = await this.loadCategorias();
    const productos = await this.loadProductos(categorias);
    const reservas = await this.loadReservas(productos);
    console.log('Seed data loaded successfully');
  }

  private async clearData() {
    await this.detalleRepository.query('TRUNCATE TABLE "detalles_reserva" CASCADE;');
    await this.reservaRepository.query('TRUNCATE TABLE "reservas" CASCADE;');
    await this.productoRepository.query('TRUNCATE TABLE "productos" CASCADE;');
    await this.categoriaRepository.query('TRUNCATE TABLE "categorias" CASCADE;');
    await this.dimensionesRepository.query(
      'TRUNCATE TABLE "dimensiones" CASCADE;',
    );
    await this.ubicacionRepository.query(
      'TRUNCATE TABLE "ubicacion_almacen" CASCADE;',
    );
  }

  private async loadCategorias(): Promise<Categoria[]> {
    const categoriasData = [
      { nombre: 'Electrónicos' },
      { nombre: 'Ropa' },
      { nombre: 'Libros' },
      { nombre: 'Deportes' },
    ];
    const categorias = this.categoriaRepository.create(categoriasData);
    await this.categoriaRepository.save(categorias);
    return categorias;
  }

  private async loadProductos(categorias: Categoria[]): Promise<Producto[]> {
    const productosData = [
      {
        nombre: 'Laptop Pro',
        descripcion: 'Una laptop potente para profesionales',
        precio: 1500.0,
        stockDisponible: 50,
        pesoKg: 1.8,
        dimensiones: {
          largoCm: 35.79,
          anchoCm: 24.59,
          altoCm: 1.62,
        },
        ubicacion: {
          street: 'Av. Vélez Sársfield 123',
          city: 'Resistencia',
          state: 'Chaco',
          postalCode: 'H3500ABC',
          country: 'AR',
        },
        imagenes: [
          { url: 'https://i.imgur.com/JyFkdfP.png', esPrincipal: true },
          { url: 'https://i.imgur.com/JyFkdfP.png', esPrincipal: false },
        ],
        categorias: [categorias.find((c) => c.nombre === 'Electrónicos')!],
      },
      {
        nombre: 'Camiseta de Algodón',
        descripcion: 'Camiseta cómoda para el día a día',
        precio: 25.0,
        stockDisponible: 200,
        pesoKg: 0.2,
        dimensiones: {
          largoCm: 70,
          anchoCm: 50,
          altoCm: 1,
        },
        ubicacion: {
          street: 'Av. 9 de Julio 1145',
          city: 'Resistencia',
          state: 'Chaco',
          postalCode: 'H3500ABC',
          country: 'AR',
        },
        imagenes: [
          { url: 'https://i.imgur.com/4pXnYM1.jpeg', esPrincipal: true },
          { url: 'https://i.imgur.com/ph9r226.jpeg', esPrincipal: false },
          { url: 'https://i.imgur.com/7weIgiB.jpeg', esPrincipal: false },
        ],
        categorias: [categorias.find((c) => c.nombre === 'Ropa')!],
      },
      {
        nombre: 'El Gran Gatsby',
        descripcion: 'Un clásico de la literatura',
        precio: 15.0,
        stockDisponible: 100,
        pesoKg: 0.3,
        dimensiones: {
          largoCm: 13.5,
          anchoCm: 20.3,
          altoCm: 1.3,
        },
        ubicacion: {
          street: 'Av. Sarmiento 550',
          city: 'Resistencia',
          state: 'Chaco',
          postalCode: 'H3500ABC',
          country: 'AR',
        },
        imagenes: [
          { url: 'https://i.imgur.com/f6Km8P2.jpeg', esPrincipal: true },
        ],
        categorias: [categorias.find((c) => c.nombre === 'Libros')!],
      },
      {
        nombre: 'Bicicleta Bmx',
        descripcion: 'La Kush 1 es una bicicleta BMX 20 de nivel de entrada y es perfecta para principiantes que quieran recorrer las calles o el parque',
        precio: 370000.0,
        stockDisponible: 15,
        pesoKg: 7.0,
        dimensiones: {
          largoCm: 120.0,
          anchoCm: 40.5,
          altoCm: 100.5,
        },
        ubicacion: {
          street: 'Av. Sarmiento 550',
          city: 'Resistencia',
          state: 'Chaco',
          postalCode: 'H3500ABC',
          country: 'AR',
        },
        imagenes: [
          { url: 'https://i.imgur.com/9x2yX3R.jpeg', esPrincipal: true },
        ],
        categorias: [categorias.find((c) => c.nombre === 'Deportes')!],
      },
      {
        nombre: 'Lenovo Tablet',
        descripcion: 'Tablet familiar con una impresionante pantalla hasta FHD de 10"',
        precio: 600000.0,
        stockDisponible: 20,
        pesoKg: 1.5,
        dimensiones: {
          largoCm: 25.0,
          anchoCm: 3.0,
          altoCm: 26.5,
        },
        ubicacion: {
          street: 'Av. Sarmiento 550',
          city: 'Resistencia',
          state: 'Chaco',
          postalCode: 'H3500ABC',
          country: 'AR',
        },
        imagenes: [],
        categorias: [categorias.find((c) => c.nombre === 'Electrónicos')!],
      },
      {
        nombre: 'Pelota Mundial 2014',
        descripcion: 'Pelota original utilizada durante el Mundial 2014',
        precio: 60000.0,
        stockDisponible: 200,
        pesoKg: 0.6,
        dimensiones: {
          largoCm: 15.0,
          anchoCm: 8.0,
          altoCm: 15.5,
        },
        ubicacion: {
          street: 'Av. Sarmiento 550',
          city: 'Resistencia',
          state: 'Chaco',
          postalCode: 'H3500ABC',
          country: 'AR',
        },
        imagenes: [],
        categorias: [categorias.find((c) => c.nombre === 'Deportes')!],
      },
    ];

    const productos = this.productoRepository.create(productosData);
    await this.productoRepository.save(productos);
    return productos;
  };

  private async loadReservas(productos: Producto[]): Promise<Reserva[]> {
    const laptop = productos.find((p) => p.nombre === 'Laptop Pro');
    const camiseta = productos.find((p) => p.nombre === 'Camiseta de Algodón');
    const libro = productos.find((p) => p.nombre === 'El Gran Gatsby');
    const bicicleta = productos.find((p) => p.nombre === 'Bicicleta Bmx');
    const tablet = productos.find((p) => p.nombre === 'Lenovo Tablet');
    const pelota = productos.find((p) => p.nombre === 'Pelota Mundial 2014');

    // Manejo de error simple
    if (!laptop || !camiseta || !libro || !bicicleta || !pelota) {
      console.error(
        'Productos requeridos para el seed de reservas no encontrados.',
      );
      return [];
    }

    const reservasData = [
      {
        idCompra: '123ABC',
        usuarioId: 2,
        estado: 'confirmado',
        expiresAt: new Date(),
        detalles: [
          {
            cantidad: 1,
            producto: laptop,
          },
          {
            cantidad: 3,
            producto: bicicleta,
          },
                    {
            cantidad: 6,
            producto: camiseta,
          },
                    {
            cantidad: 7,
            producto: tablet,
          },
                    {
            cantidad: 2,
            producto: pelota,
          },
          {
            cantidad: 30,
            producto: libro,
          },
        ],
      },
      {
        idCompra: '321CBA',
        usuarioId: 2,
        estado: 'pendiente',
        expiresAt: new Date(),
        detalles: [
          {
            cantidad: 2,
            producto: camiseta,
          },
                    {
            cantidad: 2,
            producto: pelota,
          },
        ],
      },
      {
        idCompra: '111AAA',
        usuarioId: 3,
        estado: 'pendiente',
        expiresAt: new Date(),
        detalles: [
          {
            cantidad: 90,
            producto: libro,
          },
          {
            cantidad: 28,
            producto: camiseta,
          },
        ],
      },
      {
        idCompra: '222AAA',
        usuarioId: 2,
        estado: 'pendiente',
        expiresAt: new Date(),
        detalles: [
          {
            cantidad: 50,
            producto: libro,
          },
          {
            cantidad: 2,
            producto: laptop,
          },
        ],
      },
      {
        idCompra: '333AAA',
        usuarioId: 3,
        estado: 'confirmado',
        expiresAt: new Date(),
        detalles: [
          {
            cantidad: 1,
            producto: libro,
          },
          {
            cantidad: 9,
            producto: tablet,
          },
        ],
      },
      {
        idCompra: '333BBB',
        usuarioId: 1,
        estado: 'confirmado',
        expiresAt: new Date(),
        detalles: [
          {
            cantidad: 1,
            producto: libro,
          },
          {
            cantidad: 9,
            producto: tablet,
          },
        ],
      },
      {
        idCompra: '333CCC',
        usuarioId: 1,
        estado: 'pendiente',
        expiresAt: new Date(),
        detalles: [
          {
            cantidad: 1,
            producto: pelota,
          },
          {
            cantidad: 90,
            producto: libro,
          },
        ],
      },
    ];

    const reservas = this.reservaRepository.create(reservasData);
    await this.reservaRepository.save(reservas);
    return reservas;
  }
}