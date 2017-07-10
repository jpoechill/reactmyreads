import React from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import MyReads from './components/MyReads'
import SearchBooks from './components/SearchBooks'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  constructor(props) {
    super(props);

    this.moveBook = this.moveBook.bind(this);
    // this.isOnBookShelf = this.isOnBookShelf.bind(this);
  }

  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    books: [],
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

  updateBookShelf() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

  addBook(book, shelf) {
    BooksAPI.update(book, shelf).then(() => {
      this.updateBookShelf()
    })
  }

  moveBook(bookID, shelf) {
    BooksAPI.update(this.state.books.find(book => book.id === bookID), shelf).then(() => {
      this.updateBookShelf()
    })
  }

  render() {
    const { books } = this.state

    return (
      <div className="app">
        <Route path='/search' render={({ history }) => (
          <SearchBooks
            books={books}
            moveBook={(bookID, shelf) => {
              BooksAPI.get(bookID)
                .then((book) => {
                  this.addBook(book, shelf)
                })
            }}
          />
        )}/>
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <MyReads
                  title='Currently Reading'
                  books={books.filter(book => book.shelf === 'currentlyReading')}
                  moveBook={this.moveBook}
                />
                <MyReads
                  title='Want to Read'
                  books={books.filter(book => book.shelf === 'wantToRead')}
                  moveBook={this.moveBook}
                />
                <MyReads
                  title='Finished Reading'
                  books={books.filter(book => book.shelf === 'read')}
                  moveBook={this.moveBook}
                />
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">About</Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp
