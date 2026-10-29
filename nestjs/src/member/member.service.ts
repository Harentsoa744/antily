import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ImportedMember } from './dto/import-members.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
  ) {}

  create(dto: CreateMemberDto) {
    const { confirmDuplicate: _confirmDuplicate, ...memberData } = dto;
    const entity = this.repository.create(memberData as Partial<Member>);
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['memberships'] });
  }


  async findOne(id: string | number) {
    const entity = await this.repository.findOne({ where: { id } as any, relations: ['memberships'] });
    if (!entity) throw new NotFoundException(`Member ${id} introuvable`);
    return entity;
  }
  

  findOneWithBirthDate(dateOfBirth: Date | string) {
    return this.repository.findOne({
      where: { dateOfBirth } as any,
      relations: ['memberships'],
    });
  }

  async update(id: string | number, dto: UpdateMemberDto) {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: string | number) {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
    return entity;
  }
  async importMembers(rows: ImportedMember[]) {
    if (rows.length === 0) throw new BadRequestException('Aucune donnée à importer');
    const entities = rows.map((row) => this.repository.create({
      name: row.name,
      firstname: row.firstname,
      dateOfBirth: row.dateOfBirth ? new Date(`${row.dateOfBirth}T00:00:00.000Z`) : null,
      email: row.email,
      phone: row.phone,
    }));
    await this.repository.save(entities);
    return { imported: entities.length };
  }
}
