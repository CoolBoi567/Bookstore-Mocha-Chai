//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Book = require('../app/models/book');

const {ObjectId} = require('mongodb');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);

//Our parent block
describe('Books', () => {
    beforeEach((done) => {  //Before each test we empty the database
        Book.remove({}, (err) => {
            done();           
        });
    });
    /*
    * Test the /GET route for fetching all books, should be NULL
    */
    describe('/GET book', () => {
        it('GET/:id book : Fetch single book object',(done) => {
            let book1 = new Book({
                title: "The Gord of the Bings",
                author: "Mr XYZ",
                year: 1915,
                pages: 232
            });

            book1.save((err, book) => {
                chai.request(server)
                .get('/book/' + book.id)
                .send(book)
                .end((end, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.not.have.property('errors');
                    res.body.should.have.property('title');
                    res.body.should.have.property('author');
                    res.body.should.have.property('year');
                    res.body.should.have.property('pages');
                    done();
                });
            });
        });
        it('empty array for GET all book when there are none', (done) => {
            chai.request(server)
                .get('/book')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
            });
            
        it('/GET book should return 4 books for 4 books',(done) => {
            let book1 = new Book({
                title: "The Notebook",
                author: "Nicolas Sparks",
                year: 1996,
                pages: 214
            });
            let book2 = new Book({
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954,
                pages: 150
            });
            let book3 = new Book({
                title: "The Time Machine",
                author: "H.G. Wells",
                year: 1950,
                pages: 100
            });
            let book4 = new Book({
                title: "The Hitchhiker's Guide to the Galaxy",
                author: "Douglas Adams",
                year: 1979,
                pages: 208
            });

            book1.save();
            book2.save();
            book3.save();
            book4.save();

            chai.request(server)
            .get('/book')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.eql(4);
                done();
            });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST book', () => {
        it('it should not POST a book without pages field', (done) => {
            let book = {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954
            }
            chai.request(server)
            .post('/book')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
                done();
            });
        });
        it('it should POST a book with all field', (done) => {
            let book = {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954,
                pages: 255
            }
            chai.request(server)
            .post('/book')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.not.have.property('errors');
                res.body.should.have.property('book');
                res.body.should.have.property('message').eql("Book successfully added!");
                done();
            });
        });
    });
    /*
    * Test the /PUT route
    */
    describe('/PUT book', () => {
        it('it should update title, author and year', (done) => {
           let book1 = new Book({
                title: "Chronicles of Narnia",
                author: "C.S.E. Lewis",
                year: 2950,
                pages: 778
            });
            book1.save((err, book) => {
                chai.request(server)
                .put('/book/' + book.id)
                .send({
                    title: "The Chronicles of Narnia",
                    author: "C.S. Lewis",
                    year: 1950,
                    pages: 778
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eql('Book updated!');
                    res.body.should.have.property('book');
                    res.body.book.should.have.property('title').eql("The Chronicles of Narnia");
                    res.body.book.should.have.property('year').eql(1950);

                    done();
                });
            });
        });
    });
    /*
    * Test the /DELETE route
    */
    describe('/DELETE book', () => {
        it('it should delete a book', (done) =>{
            let book1 = new Book({
                title: "The Bord of the Bings",
                author: "B.R.R. BolBien",
                year: 8888,
                pages: 888
            });

            book1.save((err, book) => {
                chai.request(server)
                .delete('/book/' + book.id)
                .send({

                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eql("Book successfully deleted!");
                    res.body.result.should.have.property('n').eql(1);
                    res.body.result.should.have.property('ok').eql(1);

                    done();
                });
            });
        });
    });

});