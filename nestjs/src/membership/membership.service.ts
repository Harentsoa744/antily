import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ImportedMembership } from './dto/import-memberships.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly repository: Repository<Membership>,
  ) {}

  create(dto: CreateMembershipDto) {
    const entity = this.repository.create(dto as Partial<Membership>);
    return this.repository.save(entity);
  }

  async importMemberships(rows: ImportedMembership[]) {
    if (rows.length === 0) throw new BadRequestException('Aucune donnée à importer');
    const entities = rows.map((row) => {
      const { territoryId, memberId, membershipFeeId, membershipPaymentId, ...rest } = row;
      const entity = this.repository.create({
        ...rest,
        territoryId,
        memberId: memberId ?? null,
        membershipFeeId: membershipFeeId ?? null,
        membershipPaymentId: membershipPaymentId ?? null,
      } as Partial<Membership>);
      return entity;
    });
    await this.repository.save(entities);
    return { imported: entities.length };
  }

  findAll() {
    return this.repository.find({ relations: ['territory', 'member', 'membershipFee', 'membershipPayment'] });
  }

  async findOne(id: string | number) {
    const entity = await this.repository.findOne({ where: { id } as any, relations: ['territory', 'member', 'membershipFee', 'membershipPayment'] });
    if (!entity) throw new NotFoundException(`Membership ${id} introuvable`);
    return entity;
  }

  async update(id: string | number, dto: UpdateMembershipDto) {
    const entity = await this.findOne(id);
    const { territoryId, memberId, membershipFeeId, membershipPaymentId, ...rest } = dto as any;
    Object.assign(entity, rest);
    if (territoryId !== undefined) entity.territoryId = territoryId;
    if (memberId !== undefined) entity.memberId = memberId ?? null;
    if (membershipFeeId !== undefined) entity.membershipFeeId = membershipFeeId ?? null;
    if (membershipPaymentId !== undefined) entity.membershipPaymentId = membershipPaymentId ?? null;
    return this.repository.save(entity);
  }

  async remove(id: string | number) {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
    return entity;
  }
}
