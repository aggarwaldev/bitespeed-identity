import { In, Not, Repository } from 'typeorm';

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
      phoneNumber: String(contact.phoneNumber),
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
      relations: {
        linkedId: true,
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
    // 1.  Find all the records matching contact info.
    const { contacts: results } = await this.find(contact);

    // 2.  Check if Primary record exists.
    let primaryContact = results.find(
      (r) => r.linkPrecedence === LinkPrecedence.PRIMARY
    );

    // 2.1 Fetch primary contact using linkedId.
    if (!primaryContact && results.length) {
      primaryContact = results[0].linkedId;
    }

    // If there are more than 1 primary contact, we should treat all except first as secondary.
    const remainingContacts = results.filter((r) => r.id !== primaryContact.id);

    // 3.  Fetch all records using primary link key.
    // Fetch all related records using linkedId but don't fetch records that already exists.
    const secondaryContact = await this.contactRepo.find({
      where: {
        id: remainingContacts.length
          ? Not(In(remainingContacts.map((r) => r.id)))
          : undefined,
        linkedId: {
          id: primaryContact.id,
        },
        linkPrecedence: LinkPrecedence.SECONDARY,
      },
      relations: {
        linkedId: true,
      },
    });

    const secondaryContactSorted = secondaryContact
      .concat(remainingContacts)
      .sort((a, b) => a.id - b.id);

    return { primaryContact, secondaryContact: secondaryContactSorted };
  }
}
