const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

// Set up the view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Read the library data from JSON file
let libraryData = JSON.parse(fs.readFileSync('library.json'));

// Home page route
app.get('/', (req, res) => {
  res.render('index', { books: libraryData.books });
});

// Add new book route
app.post('/add', (req, res) => {
  const newBook = req.body.book;
  libraryData.books.push(newBook);
  saveLibraryData();
  res.redirect('/');
});

// Update book route
app.post('/update', (req, res) => {
  const updatedBook = req.body.book;
  const bookIndex = req.body.index;
  libraryData.books[bookIndex] = updatedBook;
  saveLibraryData();
  res.redirect('/');
});

// Delete book route
app.post('/delete', (req, res) => {
  const bookIndex = req.body.index;
  libraryData.books.splice(bookIndex, 1);
  saveLibraryData();
  res.redirect('/');
});

// Search book route
app.post('/search', (req, res) => {
  const searchTerm = req.body.search;
  const searchResults = libraryData.books.filter((book) =>
    book.toLowerCase().includes(searchTerm.toLowerCase())
  );
  res.render('index', { books: searchResults });
});

// Function to save library data to JSON file
function saveLibraryData() {
  fs.writeFileSync('library.json', JSON.stringify(libraryData, null, 2));
}

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
