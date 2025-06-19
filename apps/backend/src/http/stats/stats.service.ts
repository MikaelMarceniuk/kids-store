import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/database/prisma.service';
import { TopCustomerByPurchaseFrequencyPresenter } from './presenters/top-costumers-by-purchase-frequency.presenter';
import { TopCustomerByAverageSalePresenter } from './presenters/top-customers-by-average-sale.presenters';
import { TopCustomersByVolumePresenter } from './presenters/top-customers-by-volume.presenter';

@Injectable()
export class StatusService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSalesPerDay() {
    try {
      const salesPerDay = await this.prismaService.$queryRaw<
        { date: string; total: number }[]
      >`
				SELECT 
					DATE("date") AS date, 
					SUM(price) AS total
				FROM sales
				GROUP BY DATE("date")
				ORDER BY DATE("date") ASC;
			`;

      return salesPerDay;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async topCustomersByVolume() {
    try {
      const topCustomers = await this.prismaService.sales.groupBy({
        by: ['userId'],
        _sum: { price: true },
        _count: { id: true },
        orderBy: {
          _sum: {
            price: 'desc',
          },
        },
        take: 5,
      });

      const users = await this.prismaService.user.findMany({
        where: {
          id: {
            in: topCustomers.map((c) => c.userId),
          },
        },
      });

      // Reordena o array de usuários na mesma ordem do topCustomers
      const usersOrdered = topCustomers.map(
        (tc) => users.find((u) => u.id === tc.userId)!,
      );

      return usersOrdered.map((u, i) => {
        const stats = topCustomers[i];
        return new TopCustomersByVolumePresenter({
          ...u,
          price: stats._sum.price || 0,
          amount: stats._count.id || 0,
        });
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch top customer by volume');
    }
  }

  async topCustomersByAverageSale() {
    const topCustomers = await this.prismaService.sales.groupBy({
      by: ['userId'],
      _avg: {
        price: true,
      },
      having: {
        price: {
          _min: {
            gt: 0,
          },
        },
      },
      orderBy: {
        _avg: {
          price: 'desc',
        },
      },
      take: 5,
    });

    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: topCustomers.map((c) => c.userId),
        },
      },
    });

    // Reordena usuários na ordem de topCustomers
    const usersOrdered = topCustomers.map(
      (tc) => users.find((u) => u.id === tc.userId)!,
    );

    return usersOrdered.map(
      (u, i) =>
        new TopCustomerByAverageSalePresenter({
          ...u,
          averagePrice: topCustomers[i]._avg.price || 0,
        }),
    );
  }

  async topCustomersByPurchaseFrequency() {
    const rawResults: { user_id: string; dias_unicos: bigint }[] = await this
      .prismaService.$queryRawUnsafe(`
    SELECT "user_id", COUNT(DISTINCT DATE("date")) as dias_unicos
    FROM sales
    GROUP BY "user_id"
    ORDER BY dias_unicos DESC
    LIMIT 5
  `);

    const results = rawResults.map((r) => ({
      user_id: r.user_id,
      dias_unicos: Number(r.dias_unicos),
    }));

    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: results.map((r) => r.user_id),
        },
      },
    });

    const usersOrdered = results.map(
      (r) => users.find((u) => u.id === r.user_id)!,
    );

    return usersOrdered.map(
      (user, i) =>
        new TopCustomerByPurchaseFrequencyPresenter({
          ...user,
          uniqueDays: results[i].dias_unicos,
        }),
    );
  }
}
