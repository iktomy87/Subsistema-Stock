
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservasService } from '../../reservas.service';
import { ProductosService } from '../../../productos/productos.service';
import { Reserva } from '../../entities/reserva.entity';
import { DetalleReserva } from '../../entities/detalle-reserva.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ReservaInputDto } from '../../dto/create-reserva.dto';
import { UpdateReservaDto } from '../../dto/update-reserva.dto';

describe('ReservasService', () => {
  let service: ReservasService;
  let reservasRepository: Repository<Reserva>;
  let detallesRepository: Repository<DetalleReserva>;
  let productosService: ProductosService;

  const mockReservasRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockDetallesRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProductosService = {
    verificarStock: jest.fn(),
    reservarStock: jest.fn(),
    liberarStock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservasService,
        {
          provide: getRepositoryToken(Reserva),
          useValue: mockReservasRepository,
        },
        {
          provide: getRepositoryToken(DetalleReserva),
          useValue: mockDetallesRepository,
        },
        {
          provide: ProductosService,
          useValue: mockProductosService,
        },
      ],
    }).compile();

    service = module.get<ReservasService>(ReservasService);
    reservasRepository = module.get<Repository<Reserva>>(getRepositoryToken(Reserva));
    detallesRepository = module.get<Repository<DetalleReserva>>(getRepositoryToken(DetalleReserva));
    productosService = module.get<ProductosService>(ProductosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('reservar', () => {
    it('debería crear una reserva exitosamente', async () => {
      const reservaInput: ReservaInputDto = {
        idCompra: 'compra-123',
        productos: [{ idProducto: 1, cantidad: 2 }],
      };
      const mockReservaGuardada = { id: 1, estado: 'confirmado', expiresAt: new Date() };

      mockProductosService.verificarStock.mockResolvedValue(true);
      mockReservasRepository.create.mockReturnValue({ ...reservaInput, estado: 'confirmado' });
      mockReservasRepository.save.mockResolvedValue(mockReservaGuardada);
      mockDetallesRepository.create.mockReturnValue({});
      mockDetallesRepository.save.mockResolvedValue(undefined);
      mockProductosService.reservarStock.mockResolvedValue(undefined);

      const result = await service.reservar(reservaInput);

      expect(result.idReserva).toBe(mockReservaGuardada.id);
      expect(result.estado).toBe('confirmado');
      expect(mockProductosService.verificarStock).toHaveBeenCalledWith(reservaInput.productos);
      expect(mockReservasRepository.save).toHaveBeenCalled();
      expect(mockDetallesRepository.save).toHaveBeenCalled();
      expect(mockProductosService.reservarStock).toHaveBeenCalledWith(reservaInput.productos);
    });

    it('debería lanzar ConflictException si no hay stock', async () => {
      const reservaInput: ReservaInputDto = {
        idCompra: 'compra-123',
        productos: [{ idProducto: 1, cantidad: 10 }],
      };

      mockProductosService.verificarStock.mockResolvedValue(false);

      await expect(service.reservar(reservaInput)).rejects.toThrow(ConflictException);
      await expect(service.reservar(reservaInput)).rejects.toThrow('Stock insuficiente para realizar la reserva');
      expect(mockReservasRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('liberar', () => {
    it('debería liberar el stock y cancelar la reserva', async () => {
      const liberacionInput: UpdateReservaDto = { idReserva: 1 };
      const mockReserva = {
        id: 1,
        estado: 'confirmado',
        detalles: [{ productoId: 1, cantidad: 2 }],
      };

      mockReservasRepository.findOne.mockResolvedValue(mockReserva);
      mockProductosService.liberarStock.mockResolvedValue(undefined);
      mockReservasRepository.save.mockResolvedValue({ ...mockReserva, estado: 'cancelado' });

      const result = await service.liberar(liberacionInput);

      expect(result.mensaje).toBe('Stock liberado exitosamente');
      expect(mockProductosService.liberarStock).toHaveBeenCalledWith([{ idProducto: 1, cantidad: 2 }]);
      expect(mockReservasRepository.save).toHaveBeenCalledWith({ ...mockReserva, estado: 'cancelado' });
    });

    it('debería lanzar NotFoundException si la reserva no existe', async () => {
      const liberacionInput: UpdateReservaDto = { idReserva: 999 };
      mockReservasRepository.findOne.mockResolvedValue(null);

      await expect(service.liberar(liberacionInput)).rejects.toThrow(NotFoundException);
      await expect(service.liberar(liberacionInput)).rejects.toThrow('Reserva no encontrada');
    });
  });

  describe('consultarReserva', () => {
    it('debería retornar los datos de una reserva existente', async () => {
      const mockReserva = { id: 1, estado: 'confirmado', expiresAt: new Date() };
      mockReservasRepository.findOne.mockResolvedValue(mockReserva);

      const result = await service.consultarReserva(1);

      expect(result).toEqual({
        idReserva: mockReserva.id,
        estado: mockReserva.estado,
        expiresAt: mockReserva.expiresAt,
      });
      expect(mockReservasRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['detalles'],
      });
    });

    it('debería lanzar NotFoundException si la reserva no se encuentra', async () => {
      mockReservasRepository.findOne.mockResolvedValue(null);

      await expect(service.consultarReserva(999)).rejects.toThrow(NotFoundException);
      await expect(service.consultarReserva(999)).rejects.toThrow('Reserva no encontrada');
    });
  });
});
