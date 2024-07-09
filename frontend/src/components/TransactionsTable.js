import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchTransactions } from '../utils/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Pagination, CircularProgress } from '@mui/material';
import debounce from 'lodash/debounce';

const TransactionsTable = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const searchInputRef = useRef(null);

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  const thumbnailStyle = {
    width: '50px', 
    height: '50px', 
    objectFit: 'cover', 
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  };

  const fetchData = useCallback(async (searchTerm) => {
    setLoading(true);
    try {
      const data = await fetchTransactions(month, page, itemsPerPage, searchTerm);
      setTransactions(data.transactions || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil(data.total / itemsPerPage) || 1);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, [month, page, itemsPerPage]);

  const debouncedFetchData = useCallback(
    debounce((searchTerm) => fetchData(searchTerm), 300),
    [fetchData]
  );

  useEffect(() => {
    debouncedFetchData(search);
  }, [search, debouncedFetchData, itemsPerPage]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = Math.min(Math.max(1, parseInt(event.target.value) || 1), totalItems);
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="transactions-table">
      <h2>Transactions for {getMonthName(month)}</h2>
      <TextField 
        className='searchbox'
        label="Search" 
        variant="outlined" 
        value={search} 
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        inputRef={searchInputRef}
      />
      <TextField
        label="Items per page"
        type="number"
        variant="outlined"
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
        inputProps={{ min: 1, max: totalItems }}
        style={{ marginBottom: '10px', marginTop: '10px' }}
      />
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="transactions table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell>Date of Sale</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>
                  <a href={transaction.image} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={transaction.image} 
                      alt={transaction.title} 
                      style={thumbnailStyle}
                    />
                  </a>
                </TableCell>
                <TableCell>{highlightText(transaction.title, search)}</TableCell>
                <TableCell>{highlightText(transaction.description, search)}</TableCell>
                <TableCell>${transaction.price.toFixed(2)}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.sold ? 'Yes' : 'No'}</TableCell>
                <TableCell>{new Date(transaction.dateOfSale).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination 
        count={totalPages} 
        page={page} 
        onChange={handlePageChange}
        color="primary"
        size="large"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
};


// Function to highlight searched text
const highlightText = (text, search) => {
  if (!search) return text;
  const parts = text.split(new RegExp(`(${search})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) => 
        part.toLowerCase() === search.toLowerCase() 
          ? <mark key={index}>{part}</mark>
          : part
      )}
    </span>
  );
};

export default TransactionsTable;