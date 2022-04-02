### Basic usage

Using `CheckboxGroup` component with `useCheckbox` hook.

```jsx

const options = ['value-1', 'value-2', 'value-3', 'value-4'];

const { selected, onChange } = useCheckbox(null, options);

const contentOfOptions = options.map(value => (
  <React.Fragment key={value}>
    <Checkbox value={value}>{value}</Checkbox>
    <br />
  </React.Fragment>
));

<CheckboxGroup selected={selected} onChange={onChange}>
  {contentOfOptions}
</CheckboxGroup>;
```

### Defaults checked

```jsx

const options = ['value-1', 'value-2', 'value-3', 'value-4'];

const { selected, onChange } = useCheckbox([options[0], options[1]], options);

const contentOfOptions = options.map(value => (
  <React.Fragment key={value}>
    <Checkbox value={value}>{value}</Checkbox>
    <br />
  </React.Fragment>
));

<CheckboxGroup selected={selected} onChange={onChange}>
  {contentOfOptions}
</CheckboxGroup>;
```

### Disabled

```jsx

const options = ['value-1', 'value-2', 'value-3', 'value-4'];

const { selected, onChange } = useCheckbox([options[0], options[1]], options);

const contentOfOptions = options.map(value => (
  <React.Fragment key={value}>
    <Checkbox value={value}>{value}</Checkbox>
    <br />
  </React.Fragment>
));

<CheckboxGroup
  selected={selected}
  disabled
  onChange={onChange}
>
  {contentOfOptions}
</CheckboxGroup>;
```

### Selections toggle

```jsx

const options = ['value-1', 'value-2', 'value-3', 'value-4'];

const {
  selected,
  onChange,
  selectAll,
  unselectAll,
} = useCheckbox(null, options);

const contentOfOptions = options.map((value, idx) => (
  <React.Fragment key={value}>
    <Checkbox value={value}>{value}</Checkbox>
    <br />
  </React.Fragment>
));

<React.Fragment>
  <Button
    fullWidth={false}
    onClick={selectAll}
  >
    Select All
  </Button>{' '}
  <Button
    fullWidth={false}
    onClick={unselectAll}
  >
    Unselect All
  </Button>
  <br />
  <br />
  <CheckboxGroup selected={selected} onChange={onChange}>
    {contentOfOptions}
  </CheckboxGroup>
</React.Fragment>;
```

### Custom

```jsx

const options = ['value-1', 'value-2', 'value-3', 'value-4'];

const {
  selected,
  onChange,
  isIntermediate,
  selectAll,
  unselectAll,
} = useCheckbox([options[0], options[2]], options);

const contentOfOptions = options.map((value, idx) => (
  <React.Fragment key={value}>
    <Checkbox value={value}>{value}</Checkbox>
    <br />
  </React.Fragment>
));

<React.Fragment>
  <Checkbox
    checked={selected.length > 0}
    isIntermediate={isIntermediate}
    onChange={isIntermediate ? selectAll : unselectAll}
  >
    Select all
  </Checkbox>
  <br />
  <CheckboxGroup selected={selected} onChange={onChange}>
    {contentOfOptions}
  </CheckboxGroup>
</React.Fragment>;
```
