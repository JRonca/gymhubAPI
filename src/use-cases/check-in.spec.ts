import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { Gym } from '@prisma/client';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;
let gym: Gym;
let userLatitude: Decimal;
let userLongitude: Decimal;

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gym = await gymsRepository.create({
      title: 'Gym 01',
      description: null,
      phone: null,
      latitude: -23.608808,
      longitude: -51.647692,
    });

    userLatitude = new Decimal(-23.608808);
    userLongitude = new Decimal(-51.647708);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude,
      userLongitude,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0));
    await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude,
      userLongitude,
    });

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: 'user-01',
        userLatitude,
        userLongitude,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0));
    await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude,
      userLongitude,
    });

    vi.setSystemTime(new Date(2023, 0, 2, 12, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude,
      userLongitude,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    userLatitude = new Decimal(-23.609924);
    userLongitude = new Decimal(-51.647708);
    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: 'user-01',
        userLatitude,
        userLongitude,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
