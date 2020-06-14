<?php

$urlparts    = parse_url($_SERVER['REQUEST_URI']);
$request_uri = $urlparts['query'];
$markup_fn   = "index.html?{$request_uri}";

if ( file_exists( $markup_fn ) ) {
  header('Content-Type: text/html');
  header('Content-Length: ' . filesize($markup_fn));
  readfile($markup_fn);
}
