## Image

### Basic usage

```tsx
<Image src="http://placehold.jp/64/0f1e29/ffffff/600x400.jpg?text=image" alt="Something great" />
```

### Fallback with other image

```tsx
<Image
  src="https://google.com"
  fallback="http://placehold.jp/64/0f1e29/ffffff/600x400.jpg?text=fall back image"
  alt="Something great"
/>
```
