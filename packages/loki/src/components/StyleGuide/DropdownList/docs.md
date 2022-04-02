## Usage

### Simple Select

- Note: the text display of each option must be string.

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby}>
      {hobby}
    </Option>
  ))}
</Select>;
```

### Select Attributes

#### Placeholder

- Note: the placeholder work with value of select is `undefined` or `null`.

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState();

<Select placeholder="Choose hobby" value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby}>
      {hobby}
    </Option>
  ))}
</Select>;
```

#### Disabled

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select disabled value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby}>
      {hobby}
    </Option>
  ))}
</Select>;
```

### Custom style

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game', 'Cooking'];
const [value, setValue] = React.useState(hobbies[0]);

<Select editable={true} value={value} onChange={setValue} className={styles.select} menuClassName={styles.customMenu}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby}>
      {hobby}
    </Option>
  ))}
</Select>;
```

### Event handler

- The events includes: `onChange`, `onClick`, `onFocus`, `onBlur`.

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

const handleClick = (event) => {};

const handleFocus = (event) => {};

const handleBlur = (event) => {};

<Select value={value} onChange={setValue} onClick={handleClick} onFocus={handleFocus} onBlur={handleBlur}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby}>
      {hobby}
    </Option>
  ))}
</Select>;
```

### Status

#### Primary

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select status={InputStatuses.primary} value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby}>
      {hobby}
    </Option>
  ))}
</Select>;
```

#### Success

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select status={InputStatuses.success} value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby}>
      {hobby}
    </Option>
  ))}
</Select>;
```

#### Warning

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select status={InputStatuses.warning} value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby}>
      {hobby}
    </Option>
  ))}
</Select>;
```

#### Error

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select status={InputStatuses.error} value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby}>
      {hobby}
    </Option>
  ))}
</Select>;
```

### Size display

#### Extra small

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select size={InputSizes.xs} value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby} size={InputSizes.xs}>
      {hobby}
    </Option>
  ))}
</Select>;
```

#### Small

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select size={InputSizes.sm} value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby} size={InputSizes.sm}>
      {hobby}
    </Option>
  ))}
</Select>;
```

#### Medium

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select size={InputSizes.md} value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby} size={InputSizes.md}>
      {hobby}
    </Option>
  ))}
</Select>;
```

#### Large

- The large size is default.

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select size={InputSizes.lg} value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby} size={InputSizes.lg}>
      {hobby}
    </Option>
  ))}
</Select>;
```

### Custom before input

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select
  value={value}
  onChange={setValue}
  beforeInput={
    <InputAdornment>
      <HeartDuotoneActive />
    </InputAdornment>
  }
>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby}>
      {hobby}
    </Option>
  ))}
</Select>;
```

#### Variant

```jsx
const hobbies = ['Coding', 'Reading book', 'Playing game'];
const [value, setValue] = React.useState(hobbies[0]);

<Select variant={SelectVariant.selected} value={value} onChange={setValue}>
  {hobbies.map((hobby) => (
    <Option value={hobby} key={hobby}>
      {hobby}
    </Option>
  ))}
</Select>;
```
