import { LightningElement } from "lwc";
import getContacts from "@salesforce/apex/ContactDatatableController.getContacts";
export default class ContactDatatable extends LightningElement {
  /* Table row actions */
  rowActions = [
    { label: "View", name: "view" },
    { label: "Edit", name: "edit" },
    { label: "Delete", name: "delete" }
  ];

  contactColumns = [
    {
      label: "Name",
      fieldName: "ContactURL",
      type: "url",
      typeAttributes: {
        label: { fieldName: "Name" },
        target: "_blank",
        tooltip: "Click to view contact"
      },
      sortable: true
    },
    {
      label: "Account Name",
      fieldName: "AccountURL",
      type: "url",
      typeAttributes: {
        label: { fieldName: "AccountName" },
        target: "_blank",
        tooltip: "Click to view account"
      },
      sortable: true
    },
    {
      label: "Phone",
      fieldName: "Phone",
      type: "phone",
      sortable: true
    },
    { label: "Email", fieldName: "Email", type: "email", sortable: true },
    { label: "Street", fieldName: "Street", sortable: true },
    { label: "City", fieldName: "City", sortable: true },
    { label: "State", fieldName: "State", sortable: true },
    { label: "Country", fieldName: "Country", sortable: true },
    { label: "PostalCode", fieldName: "PostalCode", sortable: true },
    {
      type: "action",
      typeAttributes: { rowActions: this.rowActions, menuAlignment: "auto" }
    }
  ];

  contacts = [];

  // * Sorting attributes
  sortedBy = "Name";
  sortedDirection = "asc";
  defaultSortDirection = "asc";

  connectedCallback() {
    getContacts()
      .then((contacts) => {
        contacts.forEach((contact) => {
          console.log(contact);
          contact.ContactURL = "/" + contact.Id;
          contact.AccountURL = "/" + contact.AccountId;
          contact.AccountName = contact.Account?.Name;
          contact.Street = contact.MailingAddress?.street;
          contact.City = contact.MailingAddress?.city;
          contact.State = contact.MailingAddress?.state;
          contact.Country = contact.MailingAddress?.country;
          contact.PostalCode = contact.MailingAddress?.postalCode;
        });
        //console.log(contacts);
        this.contacts = contacts;
        //console.log(this.contacts);
      })
      .catch((error) => {
        console.log("Error: " + error.body.message);
      });
  }
  handleRowAction(event) {
    console.log(JSON.stringify(event.detail));
    const actionName = event.detail?.action?.name;
    const row = event.detail?.row;
    switch (actionName) {
      case "view":
        this.viewContact(row);
        break;
      case "edit":
        this.editContact(row);
        break;
      case "delete":
        this.deleteContact(row);
        break;
      default:
    }
  }
  viewContact(row) {
    console.log("View contact: " + JSON.stringify(row));
  }
  editContact(row) {
    console.log("Edit contact: " + JSON.stringify(row));
  }
  deleteContact(row) {
    console.log("Delete contact: " + JSON.stringify(row));
  }

  // * Handle sorting
  handleSort(event) {
    console.log(JSON.stringify(event.detail));
    const { fieldName: sortedBy, sortDirection: sortedDirection } =
      event.detail;
    const clonedData = [...this.contacts];
    clonedData.sort(
      this.sortBy(sortedBy, sortedDirection === "asc" ? 1 : -1),
      this.primer
    );
    this.contacts = clonedData;
    this.sortedBy = sortedBy;
    this.sortedDirection = sortedDirection;
  }

  // * Sort utility function
  sortBy(field, reverse, primer) {
    const key = primer
      ? function (x) {
          return primer(field, x);
        }
      : function (x) {
          return x[field];
        };
    return function (a, b) {
      a = key(a);
      b = key(b);
      if (a === b) {
        return 0;
      } else if (a === null || a === undefined) {
        return reverse * -1;
      } else if (b === null || b === undefined) {
        return reverse * 1;
      }
      return reverse * ((a > b) - (b > a));
      /**
       * ('apple' > 'banana')  -> false
       * ('banana' > 'apple')  -> true
       * false - true = -1
       */
    };
  }

  /**
   *
   * a and b -> contact records
   * All valid for the assending orde
   *  > 0 if a should occur after b in the sorted array
   *  < 0 if a should occur before b in the sorted array
   *  == 0 if the order doesn't matter
   */
  // * helper method is used to sort records
  primer(field, record) {
    let returnValue;
    switch (field) {
      case "ContactURL":
        returnValue = record["Name"];
        break;
      case "AccountURL":
        returnValue = record["AccountName"];
        break;
      default:
        returnValue = record[field];
        break;
    }
    return returnValue;
  }
}
