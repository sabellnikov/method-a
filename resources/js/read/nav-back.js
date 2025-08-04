function goToPreviousPage() {
  if (document.referrer && new URL(document.referrer).pathname !== location.pathname) {
    location.href = document.referrer;
  } else {
    location.href = '/';
  }
}