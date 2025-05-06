import { expect, it, describe, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearByGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearByGymsUseCase;

describe('Fetch Near By Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearByGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -23.609924,
      longitude: -51.647708,
    });

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -23.548051,
      longitude: -51.4415963,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.608808,
      userLongitude: -51.647692,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
