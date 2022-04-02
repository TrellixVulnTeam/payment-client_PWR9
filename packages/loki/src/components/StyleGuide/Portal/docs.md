<h3>Basic Usage</h3>

```jsx

<div>
  <div id={'id-of-portal'} className={styles.portalPlaceholder}></div>
  <div className={styles.portal}>
    <Portal id={'id-of-portal'}>
      <div>
        This content was teleported from red area below
      </div>
    </Portal>
  </div>
</div>
```
