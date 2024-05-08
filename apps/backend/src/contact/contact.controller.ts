import { Body, Controller, Logger, Post } from '@nestjs/common';

import { Validate } from '@app/utils';

import { ContactDto } from './dto/contact.dto';
import { ContactService } from './contact.service';
import { LinkPrecedence } from './constants';
import { ContactResponse } from './contact.types';
import { identifySchema } from './schema';

@Controller()
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(public contactService: ContactService) {}

  @Validate(identifySchema)
  @Post('identify')
  async identify(@Body() contact: ContactDto) {
    this.logger.log('Request received', contact);

    const results = await this.contactService.find(contact);

    this.logger.verbose(`Fetched ${results.contacts.length} records`);
    // No existing records found, let's create one and do early return.
    if (!results.contacts.length) {
      this.logger.log(`Creating a new contact`);
      await this.contactService.create(contact);

      this.logger.verbose('New contact created');

      return this.respond(contact);
    }

    this.logger.verbose('Finding existing records');
    const existingRecord = results.contacts.find(
      (r) =>
        // There could be a scenario where email/phone is not defined in request
        (contact.email === undefined || r.email === contact.email) &&
        (contact.phoneNumber === undefined ||
          Number(r.phoneNumber) === contact.phoneNumber)
    );

    this.logger.log(`Existing record found?`, existingRecord);
    if (!existingRecord) {
      // Request contains new information, we should create a new record.
      this.logger.log('Creating a new record based on request...');
      await this.contactService.create(contact);
      this.logger.verbose('New contact created');
    }

    this.logger.verbose('Re-fetching contacts.');
    const { primaryContact, secondaryContact } =
      await this.contactService.fetchContacts(contact);

    this.logger.log('Found contacts: ', { primaryContact, secondaryContact });

    if (secondaryContact.length) {
      this.logger.verbose(
        `There are ${secondaryContact.length} secondary contacts`
      );
      const outDatedEntries = secondaryContact
        .filter(
          (r) =>
            r.linkedId !== primaryContact.id ||
            r.linkPrecedence !== LinkPrecedence.SECONDARY
        )
        .map((r) => r.id);

      this.logger.verbose(
        `There are ${outDatedEntries.length} secondary contacts that needs to be updated`
      );

      if (outDatedEntries.length) {
        await this.contactService.update(outDatedEntries, {
          linkedId: primaryContact.id,
          linkPrecedence: LinkPrecedence.SECONDARY,
        });
        this.logger.log('Secondary contact(s) updated', outDatedEntries);
      }
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
