## Typography
Use typography to present your design and content as clearly and efficiently as possible.

#### Basic
```tsx
<Typography variant={TypoVariants.title1} weight={TypoWeights.bold} type={TypoTypes.default} component="h1">
  Heading
</Typography>
```

#### Variants

```tsx
const stylesOfRow = {
  borderBottom: '1px #DDD dashed'
};

<Panel border={false}>
  <PanelBody>
    <Grid container spacing={4}>
      <Grid item style={stylesOfRow}>
        <Typography variant={TypoVariants.title1} weight={TypoWeights.bold} type={TypoTypes.default} component="h1">
          Title1 - Legendary / Font Size: 36pt | Line Height: 44pt | Weight: Bold |
          Space: 0.15 | Component: H1
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography variant={TypoVariants.title2} weight={TypoWeights.bold} type={TypoTypes.default}>
          Title2 - Hero / Font Size: 32pt | Line Height: 38pt | Weight: Bold |
          Space: 0.15
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography variant={TypoVariants.subtitle1} weight={TypoWeights.bold} type={TypoTypes.default}>
          subtitle1 - Display / Font Size: 24pt | Line Height: 32pt | Weight: Bold |
          Space: 0.15
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography variant={TypoVariants.subtitle2} weight={TypoWeights.bold} type={TypoTypes.default}>
          subtitle2 - Title / Font Size: 20pt | Line Height: 22pt | Weight: Bold |
          Space: 0.15
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography variant={TypoVariants.body1} weight={TypoWeights.medium} type={TypoTypes.default}>
          body1 - Title / Font Size: 16pt | Line Height: 22pt | Weight: Medium |
          Space: 0
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography variant={TypoVariants.body2} weight={TypoWeights.normal} type={TypoTypes.default}>
          body2 - Body / Font Size: 14pt | Line Height: 18pt | Weight: Regular |
          Space: 0
        </Typography>
      </Grid>
       <Grid item style={stylesOfRow}>
        <Typography variant={TypoVariants.button1} weight={TypoWeights.medium} type={TypoTypes.default}>
          button1 - Title / Font Size: 16pt | Line Height: 22pt | Weight: Medium |
          Space: 0
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography variant={TypoVariants.button2} weight={TypoWeights.normal} type={TypoTypes.default}>
          button2 - Title / Font Size: 14pt | Line Height: 18pt | Weight: Medium |
          Space: 0
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography variant={TypoVariants.caption} weight={TypoWeights.normal} type={TypoTypes.default}>
          caption - Body / Font Size: 12pt | Line Height: 16pt | Weight: Regular |
          Space: 0
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography variant={TypoVariants.tiny} weight={TypoWeights.normal} type={TypoTypes.default}>
          tiny - Captions / Font Size: 11pt | Line Height: 12pt | Weight: Regular |
          Space: 0.4
        </Typography>
      </Grid>
    </Grid>
  </PanelBody>
</Panel>
```

#### Weight

```tsx

const stylesOfRow = {
  borderBottom: '1px #DDD dashed'
};

<Panel border={false}>
  <PanelBody>
    <Grid container spacing={4}>
      <Grid item style={stylesOfRow}>
        <Typography weight={TypoWeights.bold}>
          Bold
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography weight={TypoWeights.medium}>
          Medium
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography weight={TypoWeights.regular}>
          Regular
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography weight={TypoWeights.light}>
          Light
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography weight={TypoTypes.inherit}>
          Inherit
        </Typography>
      </Grid>

    </Grid>
  </PanelBody>
</Panel>
```

#### Types

```tsx
const stylesOfRow = {
  borderBottom: '1px #DDD dashed'
};

<Panel border={false}>
  <PanelBody>
    <Grid container spacing={4}>
      <Grid item style={stylesOfRow}>
        <Typography type={TypoTypes.default}>
          Default - The platform for modern developers
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography type={TypoTypes.titleDefault}>
          Title Default - The platform for modern developers
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography type={TypoTypes.disable}>
          Disable - The platform for modern developers
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography type={TypoTypes.sub}>Sub - The platform for modern developers</Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography type={TypoTypes.titleSub}>Title Sub - The platform for modern developers</Typography>
      </Grid>
       <Grid item style={stylesOfRow}>
        <Typography type={TypoTypes.titleSub}>Body - The platform for modern developers</Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography type={TypoTypes.link}>
          Link - The platform for modern developers
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography type={TypoTypes.invert}>
          Invert - The platform for modern developers
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography type={TypoTypes.success}>
          Success - The platform for modern developers
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography type={TypoTypes.error}>
          Error - The platform for modern developers
        </Typography>
      </Grid>
      <Grid item style={stylesOfRow}>
        <Typography type={TypoTypes.warning}>
          Warning - The platform for modern developers
        </Typography>
      </Grid>

    </Grid>
  </PanelBody>
</Panel>
```
