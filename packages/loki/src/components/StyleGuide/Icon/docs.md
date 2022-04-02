## Icons

Exported svg component to render inside `Icon` component.

#### Usage
```tsx
<Icon width={24} height={24} component={ArrowDown} />
```

#### Color
```tsx

// you can use css with className instead.
const iconStyle = {
  color: '#ee2624'
};

<Icon width={24} height={24} component={ArrowDown} style={iconStyle}/>
```

#### Size

```tsx

// you can use css with className instead.
const divStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'center'
};
const iconStyle = {
  color: '#ee2624',
  margin: '4px'
};

<div style={divStyle}>
  <Icon width={8} height={8} component={ArrowDown} style={iconStyle}/>
  <Icon width={16} height={16} component={ArrowDown} style={iconStyle}/>
  <Icon width={24} height={24} component={ArrowDown} style={iconStyle}/>
  <Icon width={32} height={32} component={ArrowDown} style={iconStyle}/>
  <Icon width={48} height={48} component={ArrowDown} style={iconStyle}/>
</div>
```