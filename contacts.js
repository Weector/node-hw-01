const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath);

  if (!contacts) {
    throw new Error("Contacts list is empty");
  }

  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => contactId.toString() === id);

  if (!contact) {
    throw new Error("contact not found");
  }

  return contact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const deletedId = contacts.findIndex(({ id }) => id === contactId.toString());
  const [deleteContact] = contacts.splice(deletedId, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return deleteContact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const id = contacts.map(({ id }) => parseInt(id));

  const newId = (id) => {
    for (var i = 1; i <= id.length; i++) {
      if (id.indexOf(i) === -1) {
        return i.toString();
      }
      if (id.indexOf(i) === id.length - 1) {
        return (id.length + 1).toString();
      }
    }
  };

  const newContact = {
    id: newId(id),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
