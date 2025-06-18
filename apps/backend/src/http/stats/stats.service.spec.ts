import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../../providers/database/prisma.service';
import { TopCustomerByPurchaseFrequencyPresenter } from './presenters/top-costumers-by-purchase-frequency.presenter';
import { TopCustomerByAverageSalePresenter } from './presenters/top-customers-by-average-sale.presenters';
import { TopCustomersByVolumePresenter } from './presenters/top-customers-by-volume.presenter';
import { StatusService } from './stats.service';

const usersMock: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@email.com',
    passwordHash: 'hashedpassword1',
    role: Role.USER,
  },
  {
    name: 'John Doe',
    email: 'johndoe@email.com',
    passwordHash: 'hashedpassword2',
    role: Role.USER,
  },
  {
    name: 'Admin',
    email: 'admin@email.com',
    passwordHash: 'hashedpassword3',
    role: Role.ADMIN,
  },
];

describe('stats.service', () => {
  let service: StatusService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [PrismaService, StatusService],
    }).compile();

    service = module.get<StatusService>(StatusService);
    prismaService = module.get<PrismaService>(PrismaService);

    const dbUsers = await prismaService.user.createManyAndReturn({
      data: usersMock,
    });

    await prismaService.sales.createMany({
      data: [
        {
          userId: dbUsers[0].id,
          amount: 1,
          price: 100,
          date: new Date('2023-10-01'),
        },
        {
          userId: dbUsers[1].id,
          amount: 1,
          price: 200,
          date: new Date('2023-10-01'),
        },
      ],
    });
  });

  describe('getSalesPerDay', () => {
    it.todo('Should return sales per day');
  });

  describe('topCustomersByVolume', () => {
    it('Should return top customers by volume', async () => {
      const topCustomers = await service.topCustomersByVolume();

      expect(
        topCustomers.every((tc) => tc instanceof TopCustomersByVolumePresenter),
      ).toBe(true);
    });
  });

  describe('topCustomersByAverageSale', () => {
    it('Should return top customers by average sale', async () => {
      const topCustomers = await service.topCustomersByAverageSale();

      expect(
        topCustomers.every(
          (tc) => tc instanceof TopCustomerByAverageSalePresenter,
        ),
      ).toBe(true);
    });
  });

  describe('topCustomersByPurchaseFrequency', () => {
    it('Should return top customers by purchase frequency', async () => {
      const topCustomers = await service.topCustomersByPurchaseFrequency();

      expect(
        topCustomers.every(
          (tc) => tc instanceof TopCustomerByPurchaseFrequencyPresenter,
        ),
      ).toBe(true);
    });
  });
});
