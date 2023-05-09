require("dotenv").config();
require("./db/connection");

const express = require("express");
const Book = require("./models/bookmodel");

const app = express();

app.use(express.json());

// Server Code
app.post("/books/addbook", async (req, res) => {
    console.log("Req Body:", req.body);

    const result = await Book.create({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre
    });

    console.log(result);

    const successResponse = {
        message: "Book successfully added",
        dbresponse: result
    };

    res.status(201).send(successResponse);
});

app.get("/books/listbooks", async (req, res) => {
    const listOfBooks = await Book.find({});

    const successResponse = {
        message: "List of books found is as follows:",
        books: listOfBooks
    };

    res.status(200).send(successResponse);
}); // displays a list of the current books in the database

app.put("/books/updatebook/:title", async (req, res) => {
    const bookToUpdate = await Book.findOne({ 
        title: req.params.title 
    });
  
    if (req.body.author) {
      bookToUpdate.author = req.body.author;
    }
  
    if (req.body.genre) {
      bookToUpdate.genre = req.body.genre;
    }
  
    const updatedBook = await bookToUpdate.save();
  
    const successResponse = {
      message: "Book properties successfully updated",
      book: updatedBook
    };
  
    res.status(200).send(successResponse);
}); // updates the author/genre of the given book title in the search bar

app.delete("/books/deletebook", async (req, res) => {
    if (req.query.title) {
        const bookToDelete = await Book.deleteOne({ title: req.query.title });

        if (!bookToDelete) {
            const errorResponse = {
                message: "Book not found"
            };
            return res.status(404).send(errorResponse);
        }

        const successResponse = {
            message: "Book successfully deleted"
        };

        res.status(200).send(successResponse);
    } else if (req.query.all) {
        const allBooksDeleted = await Book.deleteMany({});

        if (!allBooksDeleted) {
            const errorResponse = {
                message: "Error deleting all books"
            };
            return res.status(500).send(errorResponse);
        }

        const successResponse = {
            message: "All books successfully deleted"
        };

        res.status(200).send(successResponse);
    } else {
        const errorResponse = {
            message: "Invalid request"
        };
        res.status(400).send(errorResponse);
    }
}); // deletes a book from the database. to delete the book the title must be in the url

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});