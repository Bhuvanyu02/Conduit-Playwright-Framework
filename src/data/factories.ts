import { faker } from '@faker-js/faker';

export const buildUser = () => ({
  username: faker.internet.username().slice(0, 15) + faker.string.alphanumeric(4),
  email: faker.internet.email().toLowerCase(),
  password: 'Passw0rd!' + faker.string.alphanumeric(4),
});

export const buildArticle = () => ({
  title: faker.lorem.words(4) + ' ' + faker.string.alphanumeric(5),
  description: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(2),
  tagList: ['playwright', 'qa'],
});