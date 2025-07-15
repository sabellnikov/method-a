<script>
  // Check if URL ends with ".html"
  if (window.location.pathname.endsWith('.html')) {
    // Redirect to the same page without ".html"
    window.location.href = window.location.pathname.replace('.html', '');
  }
</script>