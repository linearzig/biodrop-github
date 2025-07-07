# Bug #12: Inline JavaScript/HTML Injection in Python Templates (Dynamic Dashboard Widget)

## What to Look For

- User input is rendered as HTML/JS in a Jinja2 template without proper escaping.

**Key Issues:**

- Inline JavaScript/HTML injection via template
- Use of `|safe` filter on user input
- XSS risk in a cross-language (Python + HTML/JS) context

## Summary

This bug introduces a subtle cross-language injection vulnerability by rendering user input directly into a Jinja2 template using the `|safe` filter. The feature is camouflaged as a dynamic dashboard widget for user customization. This allows a user to inject arbitrary HTML or JavaScript, leading to XSS.

## Example

Visit:

```
http://localhost:5000/dashboard?widget=<script>alert('XSS')</script>
```

## Camouflage

- README and commit message focus on user experience and flexibility
- No mention of security or bugs
- Code comments only reference performance or user experience
