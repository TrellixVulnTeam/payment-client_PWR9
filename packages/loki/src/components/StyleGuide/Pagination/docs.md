## Usage

### Simple Pagination

```jsx
const [currentPage, setCurrentPage] = React.useState(1);

<Pagination total={100} current={currentPage} onChangePage={setCurrentPage} />;
```

### Set range page display

- The range default is 5.

```jsx
const [currentPage, setCurrentPage] = React.useState(1);

<Pagination
  total={100}
  current={currentPage}
  displayNumber={10}
  onChangePage={setCurrentPage}
/>;
```
