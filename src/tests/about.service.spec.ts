import { Test, TestingModule } from '@nestjs/testing';
import { AboutService } from '../services/about.service';
import { getModelToken } from '@nestjs/mongoose';
import { About } from '../schemas/about.schema';

const mockAboutModel = {
  find: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValueOnce([new About()]),
  })),
  findById: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValueOnce(new About()),
  })),
  findByIdAndUpdate: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValueOnce(new About()),
  })),
  findOneAndDelete: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('AboutService', () => {
  let service: AboutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AboutService,
        {
          provide: getModelToken(About.name),
          useValue: mockAboutModel,
        },
      ],
    }).compile();

    service = module.get<AboutService>(AboutService);
  });

  it('should fetch all about records', async () => {
    expect(await service.findAll()).toBeDefined();
  });

  it('should fetch a single about record', async () => {
    expect(await service.findOne('someId')).toBeDefined();
  });

  it('should create a new about record', async () => {
    const data = { title: 'test title', text: ['test text'] };
    expect(await service.create(data)).toBeDefined();
  });

  it('should update an about record', async () => {
    const data = { title: 'updated title', text: ['updated text'] };
    expect(await service.update('someId', data)).toBeDefined();
  });

  it('should delete an about record', async () => {
    expect(await service.delete('someId')).toBeDefined();
  });
});
