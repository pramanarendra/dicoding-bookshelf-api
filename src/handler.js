const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    id,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!isSuccess) {
    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name: nameQuery, reading, finished } = request.query;

  if (nameQuery !== undefined) {
    const filteredByName = books.filter((book) => book.name.toLowerCase()
      .includes(nameQuery.toLowerCase()));

    const response = h.response({
      status: 'success',
      data: {
        books: filteredByName.map(({ id, name, publisher }) => ({ id, name, publisher })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading === '1') {
    const filteredByReading = books.filter((book) => book.reading === true);

    const response = h.response({
      status: 'success',
      data: {
        books: filteredByReading.map(({ id, name, publisher }) => ({ id, name, publisher })),
      },
    });

    response.code(200);
    return response;
  }

  if (reading === '0') {
    const filteredByReading = books.filter((book) => book.reading === false);

    const response = h.response({
      status: 'success',
      data: {
        books: filteredByReading.map(({ id, name, publisher }) => ({ id, name, publisher })),
      },
    });

    response.code(200);
    return response;
  }

  if (finished === '1') {
    const filteredByFinished = books.filter((book) => book.finished === true);

    const response = h.response({
      status: 'success',
      data: {
        books: filteredByFinished.map(({ id, name, publisher }) => ({ id, name, publisher })),
      },
    });

    response.code(200);
    return response;
  }

  if (finished === '0') {
    const filteredByFinished = books.filter((book) => book.finished === false);

    const response = h.response({
      status: 'success',
      data: {
        books: filteredByFinished.map(({ id, name, publisher }) => ({ id, name, publisher })),
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    name: nameQuery,
    reading,
    finished,
    data: {
      books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });

  response.code(200);
  return response;
};

const getBooksByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
