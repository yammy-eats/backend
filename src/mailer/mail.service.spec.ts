import { MailService } from './mail.service';
import { Test } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

const mockMailerService = {
  sendMail: jest.fn(),
};

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('_send', () => {
    it('_send', async () => {
      const result = await service._send([], '', '');
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(result).toEqual(true);
    });
  });

  describe('signin', () => {
    it('sign in', async () => {
      const result = await service.signin('');
      expect(result).toEqual(true);
    });
  });

  describe('signup', () => {
    it('sign up', async () => {
      const result = await service.signup('', '');
      expect(result).toEqual(true);
    });
  });
});
