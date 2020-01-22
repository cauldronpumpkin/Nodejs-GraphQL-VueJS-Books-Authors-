const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = "ilovewebdevelopment1201";
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        name       : { type: GraphQLString },
        genre      : { type: GraphQLString },
        authorName : { type: GraphQLString },
        author: {
            type: GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({ name: parent.authorName});
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        name:  { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({ authorName: parent.name});
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        username : { type: GraphQLString },
        email    : { type: GraphQLString },
        password : { type: GraphQLString }
    })
});

const TokenType = new GraphQLObjectType({
    name: 'Token',
    fields: () => ({
        token: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: new GraphQLList(BookType),
            args: { name: { type: GraphQLString } },
            resolve(parent, args) {
                return Book.find({ name: args.name })
            }
        },
        author: {
            type: new GraphQLList(AuthorType),
            args: { name: { type: GraphQLString } },
            resolve(parent, args) {
                return Author.find({name: args.name});
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent) {
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent) {
                return Author.find({});
            }
        },
        getUser: {
            type: UserType,
            resolve(parent, { user }) {
                if (user) {
                    return User.findById(user.id);
                }
                return null;
            }
        },
        allUsers: {
            type: new GraphQLList(UserType),
            resolve(parent, req) {
                if (!req.isAuth) {
                    throw new Error('Not Authenticated.');
                }
                return User.find({});
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name : { type: new GraphQLNonNull(GraphQLString) },
                age  : { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args, req) {
                if (!req.isAuth) {
                    throw new Error('Not Authenticated.');
                }
                let author = new Author({
                    name: args.name,
                    age : args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name       : { type: new GraphQLNonNull(GraphQLString) },
                genre      : { type: new GraphQLNonNull(GraphQLString) },
                authorName : { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args, req) {
                if (!req.isAuth) {
                    throw new Error('Not Authenticated.');
                }
                let book = new Book({
                    name       : args.name,
                    genre      : args.genre,
                    authorName : args.authorName
                });
                return book.save();
            }
        },
        addUser: {
            type: UserType,
            args: {
                username : { type: new GraphQLNonNull(GraphQLString) },
                email    : { type: new GraphQLNonNull(GraphQLString) },
                password : { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let user = new User({
                    username : args.username,
                    email    : args.email,
                    password : bcrypt.hashSync(args.password, 10, function (err) {
                        if (err) throw (err);
                    })
                });
                return user.save();
            }
        },
        verifyUser: {
            type: TokenType,
            args: {
                username : { type: new GraphQLNonNull(GraphQLString) },
                password : { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                let user = await User.find({username: args.username});
                if (!user) {
                    throw new Error('Username Not Found !');
                }

                const valid = bcrypt.compareSync(args.password, user[0].password, function(err) {
                    if (err) throw (err);
                })
                if (!valid) {
                    throw new Error('Username & Password Do Not Match !');
                }

                const token = jwt.sign({ 'user': _.pick(user[0], ['id', 'email']) }, SECRET, { expiresIn: '1y' });
                return { 'token': token };
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query    : RootQuery,
    mutation : Mutation
})