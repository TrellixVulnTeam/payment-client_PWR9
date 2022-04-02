### Simple input

```jsx

<Input
  component={InputMoneyFormat}
  placeholder="Input Money"
  value={9999999}
/>
```

### Custom suffix

```jsx

<Grid container spacing={6}>
  <Grid item md={4}>
    <Input
      component={InputMoneyFormat}
      placeholder="Input Money"
      suffix=" ﹩"
      value={9999999}
    />
  </Grid>
  <Grid item md={4}>
    <Input
      component={InputMoneyFormat}
      placeholder="Input Money"
      suffix=" €"
      value={9999999}
    />
  </Grid>
</Grid>
```

### Custom decimal separator

```jsx
<Input
  component={InputMoneyFormat}
  placeholder="Input Money"
  value={9999999.888}
  decimalSeparator="@"
/>
```

### Custom thousand separator

```jsx
<Input
  component={InputMoneyFormat}
  placeholder="Input Money"
  value={9999999}
  decimalSeparator="."
  thousandSeparator=","
/>
```
