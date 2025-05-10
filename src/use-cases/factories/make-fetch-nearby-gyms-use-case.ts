import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { FetchNearByGymsUseCase } from '../fetch-nearby-gyms';

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const fetchNearbyGymsUseCase = new FetchNearByGymsUseCase(gymsRepository);

  return fetchNearbyGymsUseCase;
}
