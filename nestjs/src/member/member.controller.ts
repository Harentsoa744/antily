import { ConflictException, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ImportMembersDto } from './dto/import-members.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Post()
  async create(@Body() dto: CreateMemberDto) {
    if (dto.dateOfBirth && !dto.confirmDuplicate) {
      const existingMember = await this.service.findOneWithBirthDate(dto.dateOfBirth);
      if (existingMember) {
        throw new ConflictException({
          message: 'Un membre existe déjà avec cette date de naissance mentionnée.',
          duplicate: existingMember,
        });
      }
    }
    return this.service.create(dto);
  }
  
  @Post('import')
  importMembers(@Body() dto: ImportMembersDto) {
    return this.service.importMembers(dto.rows);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
