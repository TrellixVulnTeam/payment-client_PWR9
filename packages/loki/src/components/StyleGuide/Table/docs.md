## Notes
* Default: **table-layout: fixed** (read more: https://stackoverflow.com/questions/25201854/internet-explorer-ignores-width-when-use-css-table)

### Simple table

```jsx

const cellStyle = {
  padding: '1.2rem',
  borderBottom: '1px solid #ccc',
};

<Table>
  <TableHeader>
    <TableRow>
      <TableCell inHeader={true} style={cellStyle}>Dessert</TableCell>
      <TableCell inHeader={true} align="center" style={cellStyle}>Calories</TableCell>
      <TableCell inHeader={true} align="center" style={cellStyle}>Fat</TableCell>
      <TableCell inHeader={true} align="center" style={cellStyle}>Carbs</TableCell>
      <TableCell inHeader={true} align="center" style={cellStyle}>Protein</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell style={cellStyle}>Frozen yoghurt</TableCell>
      <TableCell align="center" style={cellStyle}>159</TableCell>
      <TableCell align="center" style={cellStyle}>6</TableCell>
      <TableCell align="center" style={cellStyle}>24</TableCell>
      <TableCell align="center" style={cellStyle}>4</TableCell>
    </TableRow>
    <TableRow>
      <TableCell style={cellStyle}>Ice cream sandwich</TableCell>
      <TableCell align="center" style={cellStyle}>237</TableCell>
      <TableCell align="center" style={cellStyle}>9</TableCell>
      <TableCell align="center" style={cellStyle}>37</TableCell>
      <TableCell align="center" style={cellStyle}>4.3</TableCell>
    </TableRow>
    <TableRow>
      <TableCell style={cellStyle}>Eclair</TableCell>
      <TableCell align="center" style={cellStyle}>262</TableCell>
      <TableCell align="center" style={cellStyle}>16</TableCell>
      <TableCell align="center" style={cellStyle}>24</TableCell>
      <TableCell align="center" style={cellStyle}>6</TableCell>
    </TableRow>
    <TableRow>
      <TableCell style={cellStyle}>Cupcake</TableCell>
      <TableCell align="center" style={cellStyle}>305</TableCell>
      <TableCell align="center" style={cellStyle}>3.7</TableCell>
      <TableCell align="center" style={cellStyle}>67</TableCell>
      <TableCell align="center" style={cellStyle}>4.3</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell
        style={cellStyle}
        colSpan={5}
        align="right"
      >
        Total: 4
      </TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

### Empty table

```jsx

const cellStyle = {
  padding: '1.2rem',
  borderBottom: '1px solid #ccc',
};

<Table>
  <TableHeader>
    <TableRow>
      <TableCell inHeader={true} style={cellStyle}>Dessert</TableCell>
      <TableCell inHeader={true} align="center" style={cellStyle}>Calories</TableCell>
      <TableCell inHeader={true} align="center" style={cellStyle}>Fat</TableCell>
      <TableCell inHeader={true} align="center" style={cellStyle}>Carbs</TableCell>
      <TableCell inHeader={true} align="center" style={cellStyle}>Protein</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell style={cellStyle} align="center" colSpan={5}>Empty data.</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Table with pagination

```jsx

const tableCellHeader = [
  {
    label: 'Dessert',
    key: 'dessert',
  },
  {
    label: 'Calories',
    key: 'calories',
    align: 'center',
  },
  {
    label: 'Fat',
    key: 'fat',
    align: 'center',
  },
  {
    label: 'Carbs',
    key: 'carbs',
    align: 'center',
  },
  {
    label: 'Protein',
    key: 'protein',
    align: 'center',
  },
];

const tableCellData = [
  {
    cells: [
      {
        label: 'Frozen yoghurt',
        key: 'frozen_yoghurt_cell_1',
      },
      {
        label: 159,
        key: 'frozen_yoghurt_cell_2',
        align: 'center',
      },
      {
        label: 6,
        key: 'frozen_yoghurt_cell_3',
        align: 'center',
      },
      {
        label: 24,
        key: 'frozen_yoghurt_cell_4',
        align: 'center',
      },
      {
        label: 4,
        key: 'frozen_yoghurt_cell_5',
        align: 'center',
      },
    ],
  },
  {
    cells: [
      {
        label: 'Ice cream sandwich',
        key: 'ice_cream_sandwich_cell_1',
      },
      {
        label: 237,
        key: 'ice_cream_sandwich_cell_2',
        align: 'center',
      },
      {
        label: 9,
        key: 'ice_cream_sandwich_cell_3',
        align: 'center',
      },
      {
        label: 37,
        key: 'ice_cream_sandwich_cell_4',
        align: 'center',
      },
      {
        label: 4.3,
        key: 'ice_cream_sandwich_cell_5',
        align: 'center',
      },
    ],
  },
  {
    cells: [
      {
        label: 'Eclair',
        key: 'eclair_cell_1',
      },
      {
        label: 262,
        key: 'eclair_cell_2',
        align: 'center',
      },
      {
        label: 16,
        key: 'eclair_cell_3',
        align: 'center',
      },
      {
        label: 24,
        key: 'eclair_cell_4',
        align: 'center',
      },
      {
        label: 6,
        key: 'eclair_cell_5',
        align: 'center',
      },
    ],
  },
  {
    cells: [
      {
        label: 'Cupcake',
        key: 'cupcake_cell_1',
      },
      {
        label: 305,
        key: 'cupcake_cell_2',
        align: 'center',
      },
      {
        label: 3.7,
        key: 'cupcake_cell_3',
        align: 'center',
      },
      {
        label: 67,
        key: 'cupcake_cell_4',
        align: 'center',
      },
      {
        label: 4.3,
        key: 'cupcake_cell_5',
        align: 'center',
      },
    ],
  },
];
const pageSize = 3;

const [currentPage, setPage] = React.useState(1);
const [data, setData] = React.useState(tableCellData.slice(0, pageSize));
const totalPage = Math.ceil(tableCellData.length / pageSize);

const handlePageChange = page => {
  setPage(page);
  
  const newData = tableCellData
    .slice(pageSize * page - pageSize, page * pageSize);
  
  setData(newData);
};

const cellStyle = {
  padding: '1.2rem',
  borderBottom: '1px solid #ccc',
};

<Table>
  <TableHeader>
    <TableRow>
      {tableCellHeader.map(cell => (
        <TableCell
          key={cell.key}
          inHeader={true}
          align={cell.align}
          style={cellStyle}
        >
          {cell.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row, idx) => (
      <TableRow key={idx}>
        {row.cells.map(cell => (
          <TableCell
            key={cell.key}
            style={cellStyle}
            align={cell.align}
          >
            {cell.label}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell
        style={cellStyle}
        colSpan={5}
        align="right"
      >
        <Pagination
          total={totalPage}
          current={currentPage}
          onChangePage={handlePageChange}
        />
      </TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

### Table with checkboxes

```jsx

const tableCellHeader = [
  {
    label: 'Dessert',
    key: 'dessert',
  },
  {
    label: 'Calories',
    key: 'calories',
    align: 'center',
  },
  {
    label: 'Fat',
    key: 'fat',
    align: 'center',
  },
  {
    label: 'Carbs',
    key: 'carbs',
    align: 'center',
  },
  {
    label: 'Protein',
    key: 'protein',
    align: 'center',
  },
];

const tableCellData = [
  {
    key: 'row_0',
    cells: [
      {
        key: 'frozen_yoghurt_cell_0',
        type: 'checkbox',
      },
      {
        label: 'Frozen yoghurt',
        key: 'frozen_yoghurt_cell_1',
      },
      {
        label: 159,
        key: 'frozen_yoghurt_cell_2',
        align: 'center',
      },
      {
        label: 6,
        key: 'frozen_yoghurt_cell_3',
        align: 'center',
      },
      {
        label: 24,
        key: 'frozen_yoghurt_cell_4',
        align: 'center',
      },
      {
        label: 4,
        key: 'frozen_yoghurt_cell_5',
        align: 'center',
      },
    ],
  },
  {
    key: 'row_1',
    cells: [
      {
        key: 'ice_cream_sandwich_cell_0',
        type: 'checkbox',
      },
      {
        label: 'Ice cream sandwich',
        key: 'ice_cream_sandwich_cell_1',
      },
      {
        label: 237,
        key: 'ice_cream_sandwich_cell_2',
        align: 'center',
      },
      {
        label: 9,
        key: 'ice_cream_sandwich_cell_3',
        align: 'center',
      },
      {
        label: 37,
        key: 'ice_cream_sandwich_cell_4',
        align: 'center',
      },
      {
        label: 4.3,
        key: 'ice_cream_sandwich_cell_5',
        align: 'center',
      },
    ],
  },
  {
    key: 'row_2',
    cells: [
      {
        key: 'eclair_cell_0',
        type: 'checkbox',
      },
      {
        label: 'Eclair',
        key: 'eclair_cell_1',
      },
      {
        label: 262,
        key: 'eclair_cell_2',
        align: 'center',
      },
      {
        label: 16,
        key: 'eclair_cell_3',
        align: 'center',
      },
      {
        label: 24,
        key: 'eclair_cell_4',
        align: 'center',
      },
      {
        label: 6,
        key: 'eclair_cell_5',
        align: 'center',
      },
    ],
  },
  {
    key: 'row_3',
    cells: [
      {
        key: 'cupcake_cell_0',
        type: 'checkbox',
      },
      {
        label: 'Cupcake',
        key: 'cupcake_cell_1',
      },
      {
        label: 305,
        key: 'cupcake_cell_2',
        align: 'center',
      },
      {
        label: 3.7,
        key: 'cupcake_cell_3',
        align: 'center',
      },
      {
        label: 67,
        key: 'cupcake_cell_4',
        align: 'center',
      },
      {
        label: 4.3,
        key: 'cupcake_cell_5',
        align: 'center',
      },
    ],
  },
];

const [data, setData] = React.useState(tableCellData);
const [checkAll, setCheckAll] = React.useState(false);

const cellStyle = {
  padding: '1.2rem',
  borderBottom: '1px solid #ccc',
};

const checkboxCellStyle = {
  ...cellStyle,
  width: 24,
};

const handleCheckAll = e => {
  const newData = data.map(row => ({
    ...row,
    checked: !checkAll,
  }));

  setCheckAll(!checkAll);
  setData(newData);
};

const handleCellCheck = rowKey => {
  const newData = data.map(row => ({
    ...row,
    checked: row.key === rowKey ? !row.checked : row.checked,
  }));

  setData(newData);
};

<Table>
  <TableHeader>
    <TableRow>
      <TableCell inHeader={true} style={checkboxCellStyle}>
        <Checkbox checked={checkAll} onChange={handleCheckAll} />
      </TableCell>
      {tableCellHeader.map(cell => (
        <TableCell
          key={cell.key}
          inHeader={true}
          align={cell.align}
          style={cellStyle}
        >
          {cell.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(row => (
      <TableRow key={row.key}>
        {row.cells.map(cell => (
          cell.type === 'checkbox' ? (
            <TableCell key={cell.key} style={checkboxCellStyle}>
              <Checkbox
                checked={row.checked}
                onChange={() => handleCellCheck(row.key)}
              />
            </TableCell>
          ) : (
            <TableCell
              key={cell.key}
              style={cellStyle}
              align={cell.align}
            >
              {cell.label}
            </TableCell>
          )
        ))}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Customized tables

```jsx

const cellStyle = {
  padding: '1.2rem',
  borderBottom: '1px solid #ccc',
};

const headerCellStyle = {
  ...cellStyle,
  backgroundColor: '#f1514f',
  color: '#fff',
};

const strippedCell = {
  ...cellStyle,
  backgroundColor: '#f2f3f4',
};

<Table>
  <TableHeader>
    <TableRow>
      <TableCell inHeader={true} style={headerCellStyle}>
        <Icon component={Layers} /> Dessert
      </TableCell>
      <TableCell inHeader={true} align="center" style={headerCellStyle}>
        <Icon component={BrightnessHigh} /> Calories
      </TableCell>
      <TableCell inHeader={true} align="center" style={headerCellStyle}>
        <Icon component={Dashboard} /> Fat
      </TableCell>
      <TableCell inHeader={true} align="center" style={headerCellStyle}>
        <Icon component={Contrast} /> Carbs
      </TableCell>
      <TableCell inHeader={true} align="center" style={headerCellStyle}>
        <Icon component={Atom} /> Protein
      </TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell style={cellStyle}>
        <Typography weight="bold">Frozen yoghurt</Typography>
      </TableCell>
      <TableCell align="center" style={cellStyle}>159</TableCell>
      <TableCell align="center" style={cellStyle}>6</TableCell>
      <TableCell align="center" style={cellStyle}>24</TableCell>
      <TableCell align="center" style={cellStyle}>4</TableCell>
    </TableRow>
    <TableRow>
      <TableCell style={strippedCell}>
        <Typography weight="bold">Ice cream sandwich</Typography>
      </TableCell>
      <TableCell align="center" style={strippedCell}>237</TableCell>
      <TableCell align="center" style={strippedCell}>9</TableCell>
      <TableCell align="center" style={strippedCell}>37</TableCell>
      <TableCell align="center" style={strippedCell}>4.3</TableCell>
    </TableRow>
    <TableRow>
      <TableCell style={cellStyle}>
        <Typography weight="bold">Eclair</Typography>
      </TableCell>
      <TableCell align="center" style={cellStyle}>262</TableCell>
      <TableCell align="center" style={cellStyle}>16</TableCell>
      <TableCell align="center" style={cellStyle}>24</TableCell>
      <TableCell align="center" style={cellStyle}>6</TableCell>
    </TableRow>
    <TableRow>
      <TableCell style={strippedCell}>
        <Typography weight="bold">Cupcake</Typography>
      </TableCell>
      <TableCell align="center" style={strippedCell}>305</TableCell>
      <TableCell align="center" style={strippedCell}>3.7</TableCell>
      <TableCell align="center" style={strippedCell}>67</TableCell>
      <TableCell align="center" style={strippedCell}>4.3</TableCell>
    </TableRow>
  </TableBody>
</Table>
```
