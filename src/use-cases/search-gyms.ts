import { GymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

interface searchGymUseCaseRequest {
  query: string;
  page: number;
}

interface searchGymUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    page,
    query,
  }: searchGymUseCaseRequest): Promise<searchGymUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return {
      gyms,
    };
  }
}
