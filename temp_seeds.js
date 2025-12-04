"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const categoria_entity_1 = require("../../categorias/entities/categoria.entity");
const producto_entity_1 = require("../../productos/entities/producto.entity");
const reserva_entity_1 = require("../../reservas/entities/reserva.entity");
const dimensiones_entity_1 = require("../../productos/entities/dimensiones.entity");
const ubicacion_almacen_entity_1 = require("../../productos/entities/ubicacion-almacen.entity");
const detalle_reserva_entity_1 = require("src/reservas/entities/detalle-reserva.entity");
let SeedsService = class SeedsService {
    constructor(categoriaRepository, productoRepository, reservaRepository, dimensionesRepository, ubicacionRepository, detalleRepository) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
        this.reservaRepository = reservaRepository;
        this.dimensionesRepository = dimensionesRepository;
        this.ubicacionRepository = ubicacionRepository;
        this.detalleRepository = detalleRepository;
    }
    async loadData() {
        console.log('Iniciando verificación y carga de datos de prueba (Modo UPSERT)...');
        const categoriasMap = await this.loadCategorias();
        const productosMap = await this.loadProductos(categoriasMap);
        await this.loadReservas(Object.values(productosMap));
        console.log('Carga de datos de prueba finalizada.');
    }
    async loadCategorias() {
        const categoriasSeed = [
            { nombre: 'Electrónicos', descripcion: 'Dispositivos y gadgets tecnológicos' },
            { nombre: 'Ropa', descripcion: 'Prendas de vestir' },
            { nombre: 'Libros', descripcion: 'Obras literarias y educativas' },
            { nombre: 'Deportes', descripcion: 'Artículos y equipo deportivo' },
        ];
        const loadedCategorias = {};
        for (const data of categoriasSeed) {
            let categoria = await this.categoriaRepository.findOne({
                where: { nombre: data.nombre },
            });
            if (!categoria) {
                categoria = this.categoriaRepository.create(data);
                await this.categoriaRepository.save(categoria);
                console.log(`[UPSERT - Categoria] Creada: ${data.nombre}`);
            }
            else {
                console.log(`[UPSERT - Categoria] Ya existe: ${data.nombre}`);
            }
            loadedCategorias[categoria.nombre] = categoria;
        }
        return loadedCategorias;
    }
    async loadProductos(categoriasMap) {
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
                categorias: ['Electrónicos'],
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
                categorias: ['Ropa'],
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
                categorias: ['Libros'],
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
                categorias: ['Deportes'],
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
                categorias: ['Electrónicos'],
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
                categorias: ['Deportes'],
            },
        ];
        const loadedProductos = {};
        for (const data of productosData) {
            const existingProducto = await this.productoRepository.findOne({
                where: { nombre: data.nombre },
            });
            if (existingProducto) {
                console.log(`[UPSERT - Producto] Ya existe: ${data.nombre}. Omitiendo inserción.`);
                loadedProductos[existingProducto.nombre] = existingProducto;
                continue;
            }

            // PATCHED: Always create new dimensions
            const dimensiones = await this.dimensionesRepository.save(data.dimensiones);
            console.log(`[UPSERT - Dimensiones] Creada para ${data.nombre}`);

            // PATCHED: Always create new location
            const ubicacion = await this.ubicacionRepository.save(data.ubicacion);
            console.log(`[UPSERT - Ubicacion] Creada para ${data.nombre}`);

            const categorias = data.categorias.map((nombre) => categoriasMap[nombre]).filter(c => c);
            const productoToCreate = this.productoRepository.create({
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                stockDisponible: data.stockDisponible,
                pesoKg: data.pesoKg,
                dimensiones,
                ubicacion,
                categorias,
                imagenes: data.imagenes,
            });
            const savedProducto = await this.productoRepository.save(productoToCreate);
            console.log(`[UPSERT - Producto] Creado: ${data.nombre}`);
            loadedProductos[savedProducto.nombre] = savedProducto;
        }
        return loadedProductos;
    }
    ;
    async loadReservas(productos) {
        const laptop = productos.find((p) => p.nombre === 'Laptop Pro');
        const camiseta = productos.find((p) => p.nombre === 'Camiseta de Algodón');
        const libro = productos.find((p) => p.nombre === 'El Gran Gatsby');
        const bicicleta = productos.find((p) => p.nombre === 'Bicicleta Bmx');
        const tablet = productos.find((p) => p.nombre === 'Lenovo Tablet');
        const pelota = productos.find((p) => p.nombre === 'Pelota Mundial 2014');
        if (!laptop || !camiseta || !libro || !bicicleta || !pelota || !tablet) {
            console.error('Productos requeridos para el seed de reservas no encontrados. Omitiendo seed de reservas.');
            return [];
        }
        const reservasSeedData = [
            {
                idCompra: '123ABC',
                usuarioId: 2,
                estado: 'confirmado',
                expiresAt: new Date(),
                detalles: [
                    { cantidad: 1, producto: laptop },
                    { cantidad: 3, producto: bicicleta },
                    { cantidad: 6, producto: camiseta },
                    { cantidad: 7, producto: tablet },
                    { cantidad: 2, producto: pelota },
                    { cantidad: 30, producto: libro },
                ],
            },
            {
                idCompra: '321CBA',
                usuarioId: 2,
                estado: 'pendiente',
                expiresAt: new Date(),
                detalles: [
                    { cantidad: 2, producto: camiseta },
                    { cantidad: 2, producto: pelota },
                ],
            },
            { idCompra: '111AAA', usuarioId: 3, estado: 'pendiente', expiresAt: new Date(), detalles: [{ cantidad: 90, producto: libro }, { cantidad: 28, producto: camiseta }] },
            { idCompra: '222AAA', usuarioId: 2, estado: 'pendiente', expiresAt: new Date(), detalles: [{ cantidad: 50, producto: libro }, { cantidad: 2, producto: laptop }] },
            { idCompra: '333AAA', usuarioId: 3, estado: 'confirmado', expiresAt: new Date(), detalles: [{ cantidad: 1, producto: libro }, { cantidad: 9, producto: tablet }] },
            { idCompra: '333BBB', usuarioId: 1, estado: 'confirmado', expiresAt: new Date(), detalles: [{ cantidad: 1, producto: libro }, { cantidad: 9, producto: tablet }] },
            { idCompra: '333CCC', usuarioId: 1, estado: 'pendiente', expiresAt: new Date(), detalles: [{ cantidad: 1, producto: pelota }, { cantidad: 90, producto: libro }] },
        ];
        const createdReservas = [];
        for (const data of reservasSeedData) {
            const existing = await this.reservaRepository.findOne({
                where: { idCompra: data.idCompra },
            });
            if (!existing) {
                const reserva = this.reservaRepository.create(data);
                const newReserva = await this.reservaRepository.save(reserva);
                createdReservas.push(newReserva);
                console.log(`[UPSERT - Reserva] Creada con idCompra: ${data.idCompra}`);
            }
            else {
                console.log(`[UPSERT - Reserva] Ya existe con idCompra: ${data.idCompra}. Omitiendo inserción.`);
                createdReservas.push(existing);
            }
        }
        return createdReservas;
    }
};
exports.SeedsService = SeedsService;
exports.SeedsService = SeedsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_entity_1.Categoria)),
    __param(1, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __param(2, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __param(3, (0, typeorm_1.InjectRepository)(dimensiones_entity_1.Dimensiones)),
    __param(4, (0, typeorm_1.InjectRepository)(ubicacion_almacen_entity_1.UbicacionAlmacen)),
    __param(5, (0, typeorm_1.InjectRepository)(detalle_reserva_entity_1.DetalleReserva)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
    typeorm_2.Repository,
    typeorm_2.Repository,
    typeorm_2.Repository,
    typeorm_2.Repository,
    typeorm_2.Repository])
], SeedsService);
//# sourceMappingURL=seeds.service.js.map
