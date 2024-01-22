public with sharing class ContactDatatableController {
  @AuraEnabled
  public static List<Contact> getContacts() {
    return [
      SELECT Name, Account.Name, Phone, Email, MailingAddress
      FROM Contact
    ];
  }
}
