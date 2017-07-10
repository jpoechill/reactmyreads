import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import * as BooksAPI from '../BooksAPI'

class SearchBooks extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  state = {
    query: '',
    books: []
  }

  static propTypes = {
    books: PropTypes.array.isRequired,
  }

  updateQuery = (query) => {
    this.setState({ query: query })
    this.updateSearchResults()
  }

  handleChange(event) {
    const book = event.target.name
    const shelf = event.target.value

    this.props.moveBook(book, shelf)
    this.updateBookShelf(book, shelf)
  }

  updateBookShelf(bookID, shelf) {
    const books = this.state.books

    books.map(book => {
      if (book.id === bookID) { book.shelf = shelf }
      return book
    })

    this.setState({books})
  }

  updateSearchResults() {
    if (this.state.query.length >= 2) {
      BooksAPI.search(this.state.query, 20).then((results) => {
        if (results.length >= 1) {
          results.map((result) => {
            this.props.books.forEach((book) => {
              if (book.id === result.id) { result.shelf = book.shelf }
            })
            return result
          })
          this.setState({ books: results })
        }
      })
    } else {
      this.setState({ books: [] })
    }
  }

  render() {
    const { query } = this.state

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link
            to='/'
            className="close-search"
          >Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={query}
              onChange={(event) => this.updateQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {
              this.state.books.map((book) => (
                  <li key={book.id}>
                    <div className="book">
                      <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                        <div className="book-shelf-changer">
                          <select name={book.id} value={book.shelf} onChange={this.handleChange}>
                            <option disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">{book.title}</div>
                      <div className="book-authors">{book.author}</div>
                    </div>
                  </li>
                ))
              }
          </ol>
        </div>
      </div>
    )
  }
}

export default SearchBooks
