// Taken from file-upload-tool; may not be needed if this is included in scraperwiki.js
scraperwiki.readSettings = function() {
  try {
    // Try the hash from this window
    return JSON.parse(decodeURIComponent(window.location.hash.substr(1)))
  } catch (e) {
    try {
      // Try the hash from the container, if it has one?
      return JSON.parse(decodeURIComponent(parent.location.hash.substr(1)))
    } catch (e) {}
  }
  return null
}
