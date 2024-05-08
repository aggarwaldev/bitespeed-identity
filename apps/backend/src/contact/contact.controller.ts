import { Body, Controller, Post } from '@nestjs/common';

import { ContactDto } from './dto/contact.dto';
import { ContactService } from './contact.service';
import { LinkPrecedence } from './constants';
import { ContactResponse } from './contact.types';

@Controller()
export class ContactController {
  constructor(public contactService: ContactService) {}

  @Post('identify')
  async identify(@Body() contact: ContactDto) {
    const results = await this.contactService.find(contact);

    // No existing records found, let's create one and do early return.
    if (!results.contacts.length) {
      await this.contactService.create(contact);

      return this.respond(contact);
    }

    const existingRecord = results.contacts.find(
      (r) =>
        // There could be a scenario where email/phone is not defined in request
        (contact.email === undefined || r.email === contact.email) &&
        (contact.phoneNumber === undefined ||
          r.phoneNumber === contact.phoneNumber)
    );

    if (!existingRecord) {
      // Request contains new information, we should create a new record.
      await this.contactService.create(contact);
    }

    const { primaryContact, secondaryContact } =
      await this.contactService.fetchContacts(contact);

    if (secondaryContact.length) {
      await this.contactService.update(
        secondaryContact.map((r) => r.id),
        {
          linkedId: primaryContact.id,
          linkPrecedence: LinkPrecedence.SECONDARY,
        }
      );
    }

    return this.respond(contact);
  }

  private async respond(contact: ContactDto): Promise<ContactResponse> {
    const { primaryContact, secondaryContact } =
      await this.contactService.fetchContacts(contact);

    return {
      contact: {
        primaryContatctId: primaryContact.id,
        emails: Array.from(
          new Set([
            primaryContact.email,
            ...secondaryContact.map((r) => r.email),
          ])
        ),
        phoneNumbers: Array.from(
          new Set([
            primaryContact.phoneNumber,
            ...secondaryContact.map((r) => r.phoneNumber),
          ])
        ),
        secondaryContactIds: secondaryContact.map((r) => r.id),
      },
    };
  }
}
