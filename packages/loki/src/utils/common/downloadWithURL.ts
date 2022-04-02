function downloadWithURL(url: string) {
  const a = document.createElement('a');

  a.href = url;
  a.target = '_blank';
  a.download = url;

  document.body.appendChild(a);

  a.click();
  a.remove();
}

export { downloadWithURL };
