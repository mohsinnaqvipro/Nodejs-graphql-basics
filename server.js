import { ApolloServer, gql } from "apollo-server";
import crypto from "crypto";

// console.log(crypto.randomUUID())

const users = [
  {
    id: "1",
    firstName: "Mohsin",
    lastName: "Ali",
    email: "mohsin123@gmail.com",
    password: "12345"
  },
  {
    id: "2",
    firstName: "Ahsan",
    lastName: "Ali",
    email: "ahsan123@gmail.com",
    password: "12345"
  },
  {
    id: "3",
    firstName: "Hassan",
    lastName: "Ali",
    email: "hassan123@gmail.com",
    password: "12345"
  }
]

const Todos = [
  {
    title: "Read Book",
    by: "1"
  },
  {
    title: "Swimming",
    by: "1"
  },
  {
    title: "Eating Burger",
    by: "2"
  },
  {
    title: "Buy me a coffee",
    by: "2"
  },
  {
    title: "Cycling",
    by: "3"
  }
]

const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
  },

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    todos: [Todo]
  }

  type Todo{
    title: String!
    by: ID
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Mutation {
    createUser(newUser: UserInput!): User
  }
`

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, { id }, { userLoggedIn }) => {
      console.log(userLoggedIn);
      if (!userLoggedIn) {
        throw new Error(`You are not logged in`);
      }
      return users.find((item) => item.id === id)
    }
  },

  User: {
    todos: (parent) => {
      console.log(`Parent ====== ${JSON.stringify(parent)}`);
      return Todos.filter((todo) => todo.by === parent.id)
    }
  },

  Mutation: {
    createUser: (_, { newUser }) => {
      const user = {
        id: crypto.randomUUID(),
        ...newUser
      }
      users.push(user);
      return user;
    }
  }
}




const server = new ApolloServer({ typeDefs, resolvers, context: { userLoggedIn: false } });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
})