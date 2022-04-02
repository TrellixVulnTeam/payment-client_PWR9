## Grid
Inspired by Material Design Grid Layout. The grid response layout adapts to screen size and orientation, ensuring consistency across layouts. 

The grid creates visual consistency between layouts while allowing flexibility across a wide variety of designs. Responsive UI is based on a 12-column grid layout.

### How it works
The grid system is implemented with the Grid component:

- It uses [CSS’s Flexible Box module](https://www.w3.org/TR/css-flexbox-1/) for high flexibility.
- There are two types of layout: containers and items.
- Item widths are set in percentages, so they’re always fluid and sized relative to their parent element.
- Items have padding to create the spacing between individual items.
- There are five grid breakpoints: xs, sm, md, lg, and xl.

If you are new to or unfamiliar with flexbox, we encourage you to read this [CSS-Tricks flexbox guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox).

#### Basic usage

##### Horizontal
```tsx

import Paper from 'components/StyleGuide/Paper';
import Grid from 'components/StyleGuide/Grid';

<Grid container spacing={2}>
  <Grid item sm={4}>
    <Paper elevation={1} style={{padding: '16px', textAlign: 'center'}}>sm=4</Paper>
  </Grid>
  <Grid item sm={2}>
    <Paper elevation={1} style={{padding: '16px', textAlign: 'center'}}>sm=2</Paper>
  </Grid>
  <Grid item sm={2}>
    <Paper elevation={1} style={{padding: '16px', textAlign: 'center'}}>sm=2</Paper>
  </Grid>
  <Grid item sm={4}>
    <Paper elevation={1} style={{padding: '16px', textAlign: 'center'}}>sm=4</Paper>
  </Grid>
</Grid>
```

##### Vertical
```tsx

import Paper from 'components/StyleGuide/Paper';
import Grid from 'components/StyleGuide/Grid';
<Grid container direction="column" spacing={2}>
  <Grid item>
    <Paper elevation={1} style={{padding: '16px', textAlign: 'center'}}>item</Paper>
  </Grid>
  <Grid item>
    <Paper elevation={1} style={{padding: '16px', textAlign: 'center'}}>item</Paper>
  </Grid>
  <Grid item>
    <Paper elevation={1} style={{padding: '16px', textAlign: 'center'}}>item</Paper>
  </Grid>
  <Grid item>
    <Paper elevation={1} style={{padding: '16px', textAlign: 'center'}}>item</Paper>
  </Grid>
</Grid>
```

#### Spacing
Margins and columns follow an 4px square baseline grid. The spacing property is an integer between 0 and 12 inclusive. By default, the spacing between two grid items follows a linear function: output(spacing) = spacing * 4px, e.g. spacing={2} creates a 8px wide gap.

```tsx

import Paper from 'components/StyleGuide/Paper';
import Grid from 'components/StyleGuide/Grid';
import RadioGroup from 'components/StyleGuide/RadioGroup';
import Radio from 'components/StyleGuide/Radio';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import useRadio from 'hooks/useRadio';

const { selected: spacing, onChange } = useRadio(2);

const paperStyle = {
  height: '140px',
  width: '100px'
};

const controlStyle = {
  padding: '16px'
};

<Grid container spacing={2}>
  <Grid item xs={12}>
    <Grid container justifyContent="center" spacing={parseInt(spacing)}>
      {[0, 1, 2].map((value) => (
        <Grid key={value} item xs="auto">
          <Paper elevation={1} style={paperStyle} />
        </Grid>
      ))}
    </Grid>
  </Grid>

  <Grid item xs={12}>
    <Paper elevation={1} style={controlStyle}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Typography component="label" variant={TypoVariants.caption} weight={TypoWeights.bold}>Spacing</Typography>
        </Grid>
        <Grid item>
          <RadioGroup
            selected={`${spacing}`} 
            onChange={onChange}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => (
              <Radio
                key={value}
                value={`${value}`}
              >
                {value}
              </Radio>
            ))}
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  </Grid>

</Grid>  
```

#### Fluid Grid
Fluid grids use columns that scale and resize content. A fluid grid’s layout can use breakpoints to determine if the layout needs to change dramatically.

##### Basic grid
The column widths apply at all breakpoints (i.e. xs and up).

```tsx

import Paper from 'components/StyleGuide/Paper';
import Grid from 'components/StyleGuide/Grid';

const paperStyle = {
  padding: '16px',
  textAlign: 'center'
};

<Grid container spacing={3}>
  <Grid item xs={12}>
    <Paper elevation={1} style={paperStyle}>xs=12</Paper>
  </Grid>
  <Grid item xs={6}>
    <Paper elevation={1} style={paperStyle}>xs=6</Paper>
  </Grid>
  <Grid item xs={6}>
    <Paper elevation={1} style={paperStyle}>xs=6</Paper>
  </Grid>
  <Grid item xs={3}>
    <Paper elevation={1} style={paperStyle}>xs=3</Paper>
  </Grid>
  <Grid item xs={3}>
    <Paper elevation={1} style={paperStyle}>xs=3</Paper>
  </Grid>
  <Grid item xs={3}>
    <Paper elevation={1} style={paperStyle}>xs=3</Paper>
  </Grid>
  <Grid item xs={3}>
    <Paper elevation={1} style={paperStyle}>xs=3</Paper>
  </Grid>
</Grid>
```

##### Grid with breakpoints
Some columns have multiple widths defined, causing the layout to change at the defined breakpoint.

```tsx

import Paper from 'components/StyleGuide/Paper';
import Grid from 'components/StyleGuide/Grid';

const paperStyle = {
  padding: '16px',
  textAlign: 'center'
};

<Grid container spacing={3}>
  <Grid item xs={12}>
    <Paper elevation={1} style={paperStyle}>xs=12</Paper>
  </Grid>
  <Grid item xs={6} sm={6}>
    <Paper elevation={1} style={paperStyle}>xs=6 sm=6</Paper>
  </Grid>
  <Grid item xs={6} sm={6}>
    <Paper elevation={1} style={paperStyle}>xs=6 sm=6</Paper>
  </Grid>
  <Grid item xs={3} sm={3}>
    <Paper elevation={1} style={paperStyle}>xs=3 sm=3</Paper>
  </Grid>
  <Grid item xs={3} sm={3}>
    <Paper elevation={1} style={paperStyle}>xs=3 sm=3</Paper>
  </Grid>
  <Grid item xs={3} sm={3}>
    <Paper elevation={1} style={paperStyle}>xs=3 sm=3</Paper>
  </Grid>
  <Grid item xs={3} sm={3}>
    <Paper elevation={1} style={paperStyle}>xs=3 sm=3</Paper>
  </Grid>
</Grid>
```

#### Auto-Layout
The Auto-layout makes the items equitably share the available space. That also means you can set the width of one item and the others will automatically resize around it.

```tsx

import Paper from 'components/StyleGuide/Paper';
import Grid from 'components/StyleGuide/Grid';

const paperStyle = {
  padding: '16px',
  textAlign: 'center'
};

<div>
  <Grid container spacing={3}>
    <Grid item xs={true}>
      <Paper elevation={1} style={paperStyle}>xs</Paper>
    </Grid>
    <Grid item xs={true}>
      <Paper elevation={1} style={paperStyle}>xs</Paper>
    </Grid>
    <Grid item xs={true}>
      <Paper elevation={1} style={paperStyle}>xs</Paper>
    </Grid>
  </Grid>

  <Grid container spacing={3}>
    <Grid item xs={true}>
      <Paper elevation={1} style={paperStyle}>xs</Paper>
    </Grid>
    <Grid item xs={6}>
      <Paper elevation={1} style={paperStyle}>xs=6</Paper>
    </Grid>
    <Grid item xs={true}>
      <Paper elevation={1} style={paperStyle}>xs</Paper>
    </Grid>
  </Grid>
</div>
```

#### Variable width content
To size columns based on the natural width of their content.

```tsx

import Paper from 'components/StyleGuide/Paper';
import Grid from 'components/StyleGuide/Grid';

const paperStyle = {
  padding: '16px',
  textAlign: 'center'
};

<div>
  <Grid container spacing={3} justifyContent="center">
    <Grid item xs={3}>
      <Paper elevation={1} style={paperStyle}>xs=3</Paper>
    </Grid>
    <Grid item xs="auto">
      <Paper elevation={1} style={paperStyle}>Variable width content</Paper>
    </Grid>
    <Grid item xs={3}>
      <Paper elevation={1} style={paperStyle}>xs=3</Paper>
    </Grid>
  </Grid>

  <Grid container spacing={3}>
    <Grid item xs={true}>
      <Paper elevation={1} style={paperStyle}>xs</Paper>
    </Grid>
    <Grid item xs="auto">
      <Paper elevation={1} style={paperStyle}>Variable width content</Paper>
    </Grid>
    <Grid item xs={1}>
      <Paper elevation={1} style={paperStyle}>xs=1</Paper>
    </Grid>
  </Grid>
</div>
```

#### Nested Grid
The `container` and `item` properties are two independent booleans. They can be combined.

```tsx

import Paper from 'components/StyleGuide/Paper';
import Grid from 'components/StyleGuide/Grid';

const paperStyle = {
  padding: '16px',
  textAlign: 'center'
};

function FormRow() {
  return (
    <React.Fragment>
      <Grid item xs={4}>
        <Paper elevation={1} style={paperStyle}>item</Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper elevation={1} style={paperStyle}>item</Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper elevation={1} style={paperStyle}>item</Paper>
      </Grid>
    </React.Fragment>
  );
}

<Grid container spacing={1}>
  <Grid container item xs={12} spacing={3}>
    <FormRow />
  </Grid>
  <Grid container item xs={12} spacing={3}>
    <FormRow />
  </Grid>
  <Grid container item xs={12} spacing={3}>
    <FormRow />
  </Grid>
</Grid> 
```

### Limitations

#### Negative margin
There is one limitation with the negative margin we use to implement the spacing between items. A horizontal scroll will appear if a negative margin goes beyond the `<body>`. There are 3 available workarounds:

1. Not using the spacing feature and implementing it in user space `spacing={0}` (default).
2. Applying padding to the parent with at least half the spacing value applied to the child:

```html
<body>
 <div style={{ padding: 20 }}>
   <Grid container spacing={5}>
     //...
   </Grid>
 </div>
</body>
```

3. Adding `overflow-x: hidden;` to the parent.