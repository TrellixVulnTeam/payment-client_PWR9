### Simple TextField

```jsx
<TextField placeholder="Simple TextField" />
```

### TextField props

```jsx

const optionalContent = (
  <Typography component={Link} href="#" type="link">
    Forgot password?
  </Typography>
);

<Grid container spacing={6}>
  <Grid item md={4}>
    <TextField
      label="Inputted"
      value="Input Text"
      placeholder="Input text"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      label="Disabled"
      value="Input Text"
      disabled
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      type="password"
      label="Password"
      placeholder="Input your password"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      label="Read Only"
      value="Input Text"
      readOnly
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      type="number"
      label="Number"
      placeholder="Input your number"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      type="email"
      label="Email"
      placeholder="Input your email"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      type="password"
      label="Optional"
      optional={optionalContent}
      placeholder="Input your password"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      label="Note"
      note="Some text note"
      placeholder="Input text"
    />
  </Grid>
</Grid>
```

### Statuses

#### Primary

```jsx

<Grid container spacing={6}>
  <Grid item md={4}>
    <TextField
      value="Primary TextField"
      status={InputStatuses.primary}
      placeholder="Input text"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      value="Primary TextField"
      status={InputStatuses.primary}
      placeholder="Input text"
      note="Some text note"
    />
  </Grid>  
  <Grid item md={4}>
    <TextField
      label={' '}
      value="Primary TextField"
      status={InputStatuses.primary}
      placeholder="Input text"
      optional="Optional"
    />
  </Grid>
</Grid>
```

#### Error

```jsx

<Grid container spacing={6}>
  <Grid item md={4}>
    <TextField
      value="Error TextField"
      status={InputStatuses.error}
      placeholder="Input text"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      value="Error TextField"
      status={InputStatuses.error}
      placeholder="Input text"
      note="Error note"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      value="Error TextField"
      status={InputStatuses.error}
      placeholder="Input text"
      afterInput={
        <InputAdornment>
          <Icon component={AlertCircle} />
        </InputAdornment>
      }
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      label={' '}
      value="Error TextField"
      status={InputStatuses.error}
      placeholder="Input text"
      optional="Optional"
    />
  </Grid>
</Grid>
```

#### Warning

```jsx

<Grid container spacing={6}>
  <Grid item md={4}>
    <TextField
      value="Warning TextField"
      status={InputStatuses.warning}
      placeholder="Input text"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      value="Warning TextField"
      status={InputStatuses.warning}
      placeholder="Input text"
      note="Warning note"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      value="Warning TextField"
      status={InputStatuses.warning}
      placeholder="Input text"
      afterInput={
        <InputAdornment>
          <Icon component={AlertTriangle} />
        </InputAdornment>
      }
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      label={' '}
      value="Warning TextField"
      status={InputStatuses.warning}
      placeholder="Input text"
      optional="Optional"
    />
  </Grid>
</Grid>
```

#### Success

```jsx

<Grid container spacing={6}>
  <Grid item md={4}>
    <TextField
      value="Success TextField"
      status={InputStatuses.success}
      placeholder="Input text"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      value="Success TextField"
      status={InputStatuses.success}
      placeholder="Input text"
      note="Success note"
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      value="Success TextField"
      status={InputStatuses.success}
      placeholder="Input text"
      afterInput={
        <InputAdornment>
          <Icon component={CheckMark} />
        </InputAdornment>
      }
    />
  </Grid>
  <Grid item md={4}>
    <TextField
      label={' '}
      value="Success TextField"
      status={InputStatuses.success}
      placeholder="Input text"
      optional="Optional"
    />
  </Grid>
</Grid>
```

### Adornments

```jsx

const [showPassword, togglePassword] = React.useState(false);

const handleShowPassword = () => {
  togglePassword(!showPassword);
};

<Grid container spacing={6}>
  <Grid item md={3}>
    <TextField
      label="Weight"
      value={69}
      placeholder="Your weight"
      beforeInput={
        <InputAdornment>
          Kg
        </InputAdornment>
      }
    />
  </Grid>
  <Grid item md={3}>
    <TextField
      label="Weight"
      value={69}
      placeholder="Your weight"
      afterInput={
        <InputAdornment>
          Kg
        </InputAdornment>
      }
    />
  </Grid>
  <Grid item md={3}>
    <TextField
      label="Username"
      placeholder="Username or email address"
      beforeInput={
        <InputAdornment>
          <Icon component={ShieldPermission} />
        </InputAdornment>
      }
    />
  </Grid>
  <Grid item md={3}>
    <TextField
      type={showPassword ? 'text' : 'password'}
      label="Password"
      placeholder="Password"
      afterInput={
        <InputAdornment>
          <Icon
            style={{ cursor: 'pointer' }}
            onClick={handleShowPassword}
            component={showPassword ? EyeOpen : EyeClose}
          />
        </InputAdornment>
      }
    />
  </Grid>
</Grid>
```
### Sizes

```jsx

<Grid container spacing={6}>
  <Grid item md={3}>
    <TextField
      size={InputSizes.lg}
      label="Big"
      placeholder="Input big"
    />
  </Grid>
  <Grid item md={3}>
    <TextField
      size={InputSizes.md}
      label="Medium"
      placeholder="Input medium"
    />
  </Grid>
  <Grid item md={3}>
    <TextField
      size={InputSizes.sm}
      label="Small"
      placeholder="Input small"
    />
  </Grid>
  <Grid item md={3}>
    <TextField
      size={InputSizes.xs}
      label="Tiny"
      placeholder="Input tiny"
    />
  </Grid>
</Grid>
```
