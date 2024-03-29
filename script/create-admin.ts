import { LocalConfig } from '@app/config';
import { AdminEntity } from '@app/entity';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';

const jwtService = new JwtService();
const jwtConfig = LocalConfig.jwt;

//runOrm(createAdmin);
export async function createAdmin(txManager: EntityManager): Promise<void> {
  const nicknames: string[] = ['admin1', 'admin2', 'admin3'];
  const promises = nicknames.map(async (nickname) => {
    const adminRepo = txManager.getRepository(AdminEntity);
    const admin = adminRepo.create({ nickname, isActive: true });
    const { id } = await adminRepo.save(admin);
    const token = issueToken(id);
    await adminRepo.update(id, { token });
    return { id, nickname, token };
  });
  const result = await Promise.all(promises);

  result.forEach((r) =>
    console.log(`
        - id: ${r.id}
        - nickname: ${r.nickname}
        - token: ${r.token}`),
  );
}

function issueToken(id: number): string {
  const { secret, issuer, expiresIn, subject } = jwtConfig;
  return jwtService.sign(
    { id },
    {
      secret,
      issuer,
      expiresIn,
      subject,
    },
  );
}
