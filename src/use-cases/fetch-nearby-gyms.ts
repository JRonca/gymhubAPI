import { GymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

interface searchGymUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface searchGymUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearByGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: searchGymUseCaseRequest): Promise<searchGymUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return {
      gyms,
    };
  }
}
