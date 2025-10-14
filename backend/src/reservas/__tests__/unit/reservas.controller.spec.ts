
import { Test, TestingModule } from '@nestjs/testing';
import { ReservaController } from '../../reservas.controller';
import { ReservasService } from '../../reservas.service';
import { ReservaInputDto } from '../../dto/create-reserva.dto';
import { UpdateReservaDto } from '../../dto/update-reserva.dto';

describe('ReservaController', () => {
  let controller: ReservaController;
  let service: ReservasService;

  const mockReservasService = {
    reservar: jest.fn(),
    liberar: jest.fn(),
    consultarReserva: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservaController],
      providers: [
        {
          provide: ReservasService,
          useValue: mockReservasService,
        },
      ],
    }).compile();

    controller = module.get<ReservaController>(ReservaController);
    service = module.get<ReservasService>(ReservasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /reservar', () => {
    it('debería llamar al servicio de reservar con los datos correctos', async () => {
      const reservaInput: ReservaInputDto = {
        idCompra: 'compra-123',
        productos: [{ idProducto: 1, cantidad: 2 }],
      };
      const mockResponse = { idReserva: 1, estado: 'confirmado', expiresAt: new Date() };

      mockReservasService.reservar.mockResolvedValue(mockResponse);

      const result = await controller.reservar(reservaInput);

      expect(result).toEqual(mockResponse);
      expect(service.reservar).toHaveBeenCalledWith(reservaInput);
    });
  });

  describe('POST /liberar', () => {
    it('debería llamar al servicio de liberar con los datos correctos', async () => {
      const liberacionInput: UpdateReservaDto = { idReserva: 1 };
      const mockResponse = { mensaje: 'Stock liberado exitosamente' };

      mockReservasService.liberar.mockResolvedValue(mockResponse);

      const result = await controller.liberar(liberacionInput);

      expect(result).toEqual(mockResponse);
      expect(service.liberar).toHaveBeenCalledWith(liberacionInput);
    });
  });

  describe('GET /reservas/:idReserva', () => {
    it('debería llamar al servicio de consultarReserva con el ID correcto', async () => {
      const mockResponse = { idReserva: 1, estado: 'confirmado', expiresAt: new Date() };

      mockReservasService.consultarReserva.mockResolvedValue(mockResponse);

      const result = await controller.consultarReserva(1);

      expect(result).toEqual(mockResponse);
      expect(service.consultarReserva).toHaveBeenCalledWith(1);
    });
  });
});
