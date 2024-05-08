import { In, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Contact } from './contact.entity';
import { ContactDto } from './dto/contact.dto';
import { ContactLink, Entries } from './contact.types';
import { LinkPrecedence } from './constants';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact) private contactRepo: Repository<Contact>
  ) {}

  async create(
    contact: ContactDto,
    link: ContactLink = { linkPrecedence: LinkPrecedence.PRIMARY }
  ) {
    const entity = this.contactRepo.create({
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      linkedId: link.linkedId,
      linkPrecedence: link.linkPrecedence,
    });
    return this.contactRepo.insert(entity);
  }

  async find(contact: ContactDto) {
    const data = await this.contactRepo.find({
      where: (Object.entries(contact) as Entries<typeof contact>).map(
        ([key, val]) => ({ [key]: val })
      ),
      order: {
        id: 'ASC',
      },
    });

    return { contacts: data };
  }

  async update(id: number | number[], link: ContactLink) {
    const results = await this.contactRepo.update(
      { id: Array.isArray(id) ? In(id) : id },
      link
    );

    if (!results.affected) {
      throw new NotFoundException({
        message: 'Contact not found',
      });
    }

    return results;
  }

  async remove(id: number) {
    const contact = await this.contactRepo.findOneBy({ id });

    if (!contact) {
      throw new NotFoundException({
        message: 'Contact not found',
      });
    }

    const { affected } = await this.contactRepo.softDelete(contact);

    return { affected };
  }

  async fetchContacts(contact: ContactDto) {
    const { contacts: results } = await this.find(contact);

    const primaryContactSorted = results.filter(
      (r) => r.linkPrecedence === LinkPrecedence.PRIMARY
    );

    const primaryContact = primaryContactSorted.shift();

    const secondaryContactSorted = results
      .filter((r) => r.linkPrecedence === LinkPrecedence.SECONDARY)
      // If there are more than 1 primary contact, we should treat all except first as secondary.
      .concat(primaryContactSorted)
      // Need to sort again as we have joined primary contacts
      .sort((a, b) => a.id - b.id);

    return { primaryContact, secondaryContact: secondaryContactSorted };
  }
}
