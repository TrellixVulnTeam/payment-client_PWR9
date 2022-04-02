### Basic

```jsx
  <Breadcrumbs separator="-">
    <Typography>Trang chủ</Typography>
    <Typography>Chi tiết</Typography>
  </Breadcrumbs>

```

### Custom separator

```jsx
  <Breadcrumbs separator={<Icon component={AngleRight} />}>
    <Typography type={TypoTypes.sub}>Trang chủ</Typography>
    <Typography>Chi tiết</Typography>
  </Breadcrumbs>
```
