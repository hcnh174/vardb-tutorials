//
// showdown.js -- A JavaScript port of Markdown.
//
// Copyright (c) 2007 John Fraser.
//
// Original Markdown Copyright (c) 2004-2005 John Gruber
//   <http://daringfireball.net/projects/markdown/>
//
// Redistributable under a BSD-style open source license.
//


//
// Showdown usage:
//
//     new Showdown().convert("Markdown *rocks*.");
//     --> "<p>Markdown <em>rocks</em>.</p>"
//


;(function (window, undefined) {

  // Global hashes, used by various utility routines
  var
    g_urls,
    g_titles,
    g_html_blocks,
    // Used to track when we're inside an ordered or unordered list
    // (see processListItems() for details):
    g_list_level = 0,
    slice = Array.prototype.slice;

  window.Showdown = function () {};

  window.Showdown.prototype.convert = function (text) {
  //
  // Main function. The order in which other subs are called here is
  // essential. Link and image substitutions need to happen before
  // escapeSpecialCharsWithinTagAttributes(), so that any *'s or _'s in the <a>
  // and <img> tags get encoded.
  //

    // Clear the global hashes. If we don't clear these, you get conflicts
    // from other articles when generating a page which contains more than
    // one article (e.g. an index page that shows the N most recent
    // articles):
    g_urls = {};
    g_titles = {};
    g_html_blocks = [];

    text = (
      text
        // attacklab: Replace ~ with ~T
        // This lets us use tilde as an escape char to avoid md5 hashes
        // The choice of character is arbitrary; anything that isn't
        // magic in Markdown will work.
        .replace(/~/g, "~T")

        // attacklab: Replace $ with ~D
        // RegExp interprets $ as a special character
        // when it's in a replacement string
        .replace(/\$/g, "~D")

        // Standardize line endings
        .replace(/\r\n?/g, "\n")
    );

    return (
      unescapeSpecialChars(
        runBlockGamut(
          stripLinkDefinitions(
            hashHtmlBlocks(
              "\n\n" + detab(text).replace(/^ +$/mg, "") + "\n\n"
            )
          )
        )
      )
        .replace(/~D/g, "$$") // attacklab: Restore dollar signs
        .replace(/~T/g, "~") // attacklab: Restore tildes
    );
  };

  function stripLinkDefinitions(text) {
  //
  // Strips link definitions from text, stores the URLs and titles in
  // hash references.
  //

    // Link defs are in the form: ^[id]: url "optional title"

    text = text.replace(
      /^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm,
      function (_, m1, m2, m3, m4) {
        m1 = m1.toLowerCase();
        g_urls[m1] = encodeAmpsAndAngles(m2);  // Link IDs are case-insensitive
        if (m3) {
          // Oops, found blank lines, so it's not a title.
          // Put back the parenthetical statement we stole.
          return m3 + m4;
        } else if (m4) {
          g_titles[m1] = m4.replace(/"/g, "&quot;");
        }

        // Completely remove the definition from the text
        return "";
      }
    );

    return text;
  }

  function hashHtmlBlocks(text) {
    // Hashify HTML blocks:
    // We only want to do this for block-level HTML tags, such as headers,
    // lists, and tables. That's because we still want to wrap <p>s around
    // "paragraphs" that are wrapped in non-block-level tags, such as anchors,
    // phrase emphasis, and spans. The list of tags we're looking for is
    // hard-coded.
    //
    // First, look for nested blocks, e.g.:
    //   <div>
    //     <div>
    //     tags for inner block must be indented.
    //     </div>
    //   </div>
    //
    // The outermost tags must start at the left margin for this to match, and
    // the inner nested divs must be indented.
    // We need to do this before the next, more liberal match, because the next
    // match will start at the first `<div>` and stop at the first `</div>`.

    return (
      text
        // attacklab: Double up blank lines to reduce lookaround
        .replace(/\n/g, "\n\n")

        // attacklab: This regex can be expensive when it fails.
        .replace(
          /^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,
          hashElement
        )

        //
        // Now match more liberally, simply from `\n<tag>` to `</tag>\n`
        //
        .replace(
          /^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,
          hashElement
        )

        // Special case just for <hr />. It was easier to make a special case than
        // to make the other regex more complicated.
        .replace(
          /(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
          hashElement
        )

        // Special case for standalone HTML comments:
        .replace(
          /(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,
          hashElement
        )

        // PHP and ASP-style processor instructions (<?...?> and <%...%>)
        .replace(
          /(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
          hashElement
        )

        // attacklab: Undo double lines (see comment at top of this function)
        .replace(/\n\n/g, "\n")
    );
  }

  function hashElement(_, blockText) {
    blockText = (
      blockText
        // Undo double lines
        .replace(/\n\n/g, "\n")
        .replace(/^\n/, "")

        // strip trailing blank lines
        .replace(/\n+$/g, "")
    );

    // Replace the element text with a marker ("~KxK" where x is its key)
    return "\n\n~K" + (g_html_blocks.push(blockText) - 1) + "K\n\n";
  }

  function runBlockGamut(text) {
  //
  // These are all the transformations that form block-level
  // tags like paragraphs, headers, and list items.
  //
    var key = hashBlock("<hr />");
    text = (
      doHeaders(text)
        // Do Horizontal Rules:
        .replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, key)
        .replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm, key)
        .replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm, key)
    );

    text = doLists(text);
    text = doCodeBlocks(text);
    text = doBlockQuotes(text);

    // We already ran hashHtmlBlocks() before, in Markdown(), but that
    // was to escape raw HTML in the original Markdown source. This time,
    // we're escaping the markup we've just created, so that we don't wrap
    // <p> tags around block-level tags.
    text = hashHtmlBlocks(text);
    return formParagraphs(text);
  }

  function runSpanGamut(text) {
  //
  // These are all the transformations that occur *within* block-level
  // tags like paragraphs, headers, and list items.
  //

    text = doCodeSpans(text);
    text = escapeSpecialCharsWithinTagAttributes(text);
    text = encodeBackslashEscapes(text);

    // Process anchor and image tags. Images must come first,
    // because ![foo][f] looks like an anchor.
    text = doImages(text);
    text = doAnchors(text);

    // Make links out of things like `<http://example.com/>`
    // Must come after doAnchors(), because you can use < and >
    // delimiters in inline links like [this](<url>).
    text = doAutoLinks(text);
    text = encodeAmpsAndAngles(text);
    text = doItalicsAndBold(text);

    // Do hard breaks:
    return text.replace(/ {2,}\n/g, " <br />\n");
  }

  function escapeSpecialCharsWithinTagAttributes(text) {
  //
  // Within tags -- meaning between < and > -- encode [\ ` * _] so they
  // don't conflict with their use in Markdown for code, italics and strong.
  //

    // Build a regex to find HTML tags and comments.  See Friedl's
    // "Mastering Regular Expressions", 2nd Ed., pp. 200-201.
    var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;

    return text.replace(
      regex,
      function (wholeMatch) {
        var tag = wholeMatch.replace(/(.)<\/?code>(?=.)/g, "$1`");
        return escapeCharacters(tag, "\\`*_");
      }
    );
  }

  function doAnchors(text) {
  //
  // Turn Markdown link shortcuts into XHTML <a> tags.
  //
    return (
      text
        // First, handle reference-style links: [link text] [id]
        .replace(
          /(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,
          writeAnchorTag
        )

        // Next, inline-style links: [link text](url "optional title")
        .replace(
          /(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,
          writeAnchorTag
        )

        // Last, handle reference-style shortcuts: [link text]
        // These must come last in case you've also got [link test][1]
        // or [link test](/foo)
        .replace(
          /(\[([^\[\]]+)\])()()()()()/g,
          writeAnchorTag
        )
    );
  }

  function writeAnchorTag(_, whole_match, link_text, link_id, url, m5, m6, title) {
    link_id = link_id.toLowerCase();

    if (!url) {
      // lower-case and turn embedded newlines into spaces
      link_id || (link_id = link_text.toLowerCase().replace(/ ?\n/g, " "));
      url = "#" + link_id;

      if (g_urls[link_id] === undefined) {
        if (whole_match.search(/\(\s*\)$/m) > -1) {
          // Special case for explicit empty url
          url = "";
        } else {
          return whole_match;
        }
      }
      else {
        url = g_urls[link_id];
        g_titles[link_id] === undefined || (title = g_titles[link_id]);
      }
    }

    url = escapeCharacters(url, "*_");
    var result = '<a href="' + url + '"';

    if (title) {
      title = title.replace(/"/g, "&quot;");
      title = escapeCharacters(title, "*_");
      result += ' title="' + title + '"';
    }

    return result + ">" + link_text + "</a>";
  }

  function doImages(text) {
  //
  // Turn Markdown image shortcuts into <img> tags.
  //
    return (
      text
        // First, handle reference-style labeled images: ![alt text][id]
        .replace(
          /(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,
          writeImageTag
        )

        // Next, handle inline images:  ![alt text](url "optional title")
        // Don't forget: encode * and _
        .replace(
          /(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,
          writeImageTag
        )
    );
  }

  function writeImageTag(_, whole_match, alt_text, link_id, url, m5, m6, title) {
    link_id = link_id.toLowerCase();

    if (url === "") {
      if (link_id === "") {
        // lower-case and turn embedded newlines into spaces
        link_id = alt_text.toLowerCase().replace(/ ?\n/g, " ");
      }
      url = "#" + link_id;

      if (g_urls[link_id] === undefined) {
        return whole_match;
      }

      url = g_urls[link_id];
      title = g_titles[link_id];
    }

    alt_text = alt_text.replace(/"/g, "&quot;");
    url = escapeCharacters(url, "*_");
    result = '<img src="' + url + '" alt="' + alt_text + '"';

    if (title) {
      title = title.replace(/"/g, "&quot;");
      title = escapeCharacters(title, "*_");
      result += ' title="' + title + '"';
    }

    return result + " />";
  }

  function doHeaders(text) {
    return (
      text
        .replace( // Setext-style headings
          /^(.+)[ \t]*\n(=+|-+)[ \t]*\n+/gm,
          function (_, m1, m2) {
            var tag = m2 === "=" ? "h1" : "h2";
            return hashBlock("<", tag, ">", runSpanGamut(m1), "</", tag, ">");
          }
        )
        .replace( // atx-style headings
          /^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,
          function (_, m1, m2) {
            var tag = "h" + m1.length;
            return hashBlock("<", tag, ">", runSpanGamut(m2), "</", tag, ">");
          }
        )
    );
  }

  function doLists(text) {
  //
  // Form HTML ordered (numbered) and unordered (bulleted) lists.
  //

    // attacklab: add sentinel to hack around khtml/safari bug:
    // http://bugs.webkit.org/show_bug.cgi?id=11231
    text += "~0";

    // Re-usable pattern to match any entirel ul or ol list:
    var whole_list = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;

    if (g_list_level) {
      text = text.replace(
        whole_list,
        function (_, list, m2) {
          var
            list_type = (m2.search(/[*+-]/g) > -1) ? "ul" : "ol",
            // Turn double returns into triple returns, so that we can make a
            // paragraph for the last item in a list, if necessary:
            result = processListItems(list.replace(/\n{2,}/g, "\n\n\n"));

          // Trim any trailing whitespace, to put the closing `</$list_type>`
          // up on the preceding line, to get it past the current stupid
          // HTML block parser. This is a hack to work around the terrible
          // hack that is the HTML block parser.
          return "<" + list_type + ">" + result.replace(/\s+$/, "") + "</" + list_type + ">\n";
        }
      );
    } else {
      whole_list = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;
      text = text.replace(
        whole_list,
        function (_, runup, list, m3) {
          var list_type = (m3.search(/[*+-]/g) > -1) ? "ul" : "ol";

          // Turn double returns into triple returns, so that we can make a
          // paragraph for the last item in a list, if necessary:
          list = list.replace(/\n{2,}/g, "\n\n\n");

          return runup + "<" + list_type + ">\n" + processListItems(list) + "</" + list_type + ">\n";
        }
      );
    }

    // attacklab: strip sentinel
    return text.replace(/~0/, "");
  }

  function processListItems(list_str) {
  //
  //  Process the contents of a single ordered or unordered list, splitting it
  //  into individual list items.
  //
    // The $g_list_level global keeps track of when we're inside a list.
    // Each time we enter a list, we increment it; when we leave a list,
    // we decrement. If it's zero, we're not in a list anymore.
    //
    // We do this because when we're not inside a list, we want to treat
    // something like this:
    //
    //     I recommend upgrading to version
    //     8. Oops, now this line is treated
    //     as a sub-list.
    //
    // As a single paragraph, despite the fact that the second line starts
    // with a digit-period-space sequence.
    //
    // Whereas when we're inside a list (or sub-list), that line will be
    // treated as the start of a sub-list. What a kludge, huh? This is
    // an aspect of Markdown's syntax that's hard to parse perfectly
    // without resorting to mind-reading. Perhaps the solution is to
    // change the syntax rules such that sub-lists must start with a
    // starting cardinal number; e.g. "1." or "a.".

    g_list_level++;

    // trim trailing blank lines:
    list_str = list_str.replace(/\n{2,}$/, "\n");

    // attacklab: add sentinel to emulate \z
    list_str += "~0";

    list_str = list_str.replace(
      /(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,
      function (_, leading_line, leading_space, m3, item) {
        if (leading_line || (item.search(/\n{2,}/) > -1)) {
          item = runBlockGamut(outdent(item));
        }
        else {
          // Recursion for sub-lists:
          item = doLists(outdent(item));
          item = item.replace(/\n$/, ""); // chomp(item)
          item = runSpanGamut(item);
        }

        return  "<li>" + item + "</li>\n";
      }
    );

    // attacklab: strip sentinel
    list_str = list_str.replace(/~0/g, "");

    g_list_level--;
    return list_str;
  }

  function doCodeBlocks(text) {
  //
  //  Process Markdown `<pre><code>` blocks.
  //

    // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
    text += "~0";

    text = text.replace(
      /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,
      function (_, codeblock, nextChar) {
        codeblock = encodeCode(outdent(codeblock));
        codeblock = detab(codeblock);
        codeblock = codeblock.replace(/^\n+/g, ""); // trim leading newlines
        codeblock = codeblock.replace(/\n+$/g, ""); // trim trailing whitespace
        return hashBlock("<pre><code>", codeblock, "\n</code></pre>") + nextChar;
      }
    );

    // attacklab: strip sentinel
    return text.replace(/~0/, "");
  }

  function hashBlock() {
    return (
      "\n\n~K" +
      (g_html_blocks.push(slice.call(arguments).join("").replace(/(^\n+|\n+$)/g, "")) - 1) +
      "K\n\n"
    );
  }

  function doCodeSpans(text) {
  //
  //  *  Backtick quotes are used for <code></code> spans.
  //
  //  *  You can use multiple backticks as the delimiters if you want to
  //     include literal backticks in the code span. So, this input:
  //
  //         Just type ``foo `bar` baz`` at the prompt.
  //
  //     Will translate to:
  //
  //         <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
  //
  //  There's no arbitrary limit to the number of backticks you
  //  can use as delimiters. If you need three consecutive backticks
  //  in your code, use four for delimiters, etc.
  //
  //  *  You can use spaces to get literal backticks at the edges:
  //
  //         ... type `` `bar` `` ...
  //
  //     Turns to:
  //
  //         ... type <code>`bar`</code> ...
  //

    return text.replace(
      /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
      function (_, m1, m2, c) {
        c = c.replace(/^([ \t]*)/g, "");  // leading whitespace
        c = c.replace(/[ \t]*$/g, "");  // trailing whitespace
        c = encodeCode(c);
        return m1 + "<code>" + c + "</code>";
      }
    );
  }

  function encodeCode(text) {
  //
  // Encode/escape certain characters inside Markdown code runs.
  // The point is that in code, these characters are literals,
  // and lose their special Markdown meanings.
  //
    // Encode all ampersands; HTML entities are not
    // entities within a Markdown code span.
    text = text.replace(/&/g, "&amp;");

    // Do the angle bracket song and dance:
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");

    // Now, escape characters that are magic in Markdown:
    return escapeCharacters(text, "*_{}[]\\");

  // jj the line above breaks this:
  //---

  //* Item

  //   1. Subitem

  //            special char: *
  //---
  }

  function doItalicsAndBold(text) {

    // <strong> must go first:
    text = text.replace(
      /(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,
      "<strong>$2</strong>"
    );

    return text.replace(
      /(\*|_)(?=\S)([^\r]*?\S)\1/g,
      "<em>$2</em>"
    );
  }

  function doBlockQuotes(text) {

    text = text.replace(
      /((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,
      function (_, bq) {
        // attacklab: hack around Konqueror 3.5.4 bug:
        // "----------bug".replace(/^-/g, "") === "bug"

        bq = bq.replace(/^[ \t]*>[ \t]?/gm, "~0");  // trim one level of quoting

        // attacklab: clean up hack
        bq = bq.replace(/~0/g, "");

        bq = bq.replace(/^[ \t]+$/gm, "");  // trim whitespace-only lines
        bq = runBlockGamut(bq);  // recurse

        bq = bq.replace(/(^|\n)/g, "$1  ");
        // These leading spaces screw with <pre> content, so we need to fix that:
        bq = bq.replace(
          /(\s*<pre>[^\r]+?<\/pre>)/gm,
          function (_, pre) {
            // attacklab: hack around Konqueror 3.5.4 bug:
            pre = pre.replace(/^ {2}/mg, "~0");
            return pre.replace(/~0/g, "");
          }
        );

        return hashBlock("<blockquote>\n", bq, "\n</blockquote>");
      }
    );
    return text;
  }

  function formParagraphs(text) {
  //
  //  Params:
  //    $text - string to process with html <p> tags
  //

    // Strip leading and trailing lines:
    text = text.replace(/^\n+/g, "");
    text = text.replace(/\n+$/g, "");

    var
      grafs = text.split(/\n{2,}/g),
      grafsOut = [],
      end = grafs.length,
      i,
      str,
      blockText;

    //
    // Wrap <p> tags.
    //
    for (i = 0; i < end; i++) {
      str = grafs[i];

      // if this is an HTML marker, copy it
      if (str.search(/~K(\d+)K/g) >= 0) {
        grafsOut.push(str);
      }
      else if (str.search(/\S/) >= 0) {
        str = runSpanGamut(str);
        str = str.replace(/^([ \t]*)/g, "<p>");
        str += "</p>";
        grafsOut.push(str);
      }

    }

    //
    // Unhashify HTML blocks
    //
    end = grafsOut.length;
    for (i = 0; i < end; i++) {
      // if this is a marker for an html block...
      while (grafsOut[i].search(/~K(\d+)K/) >= 0) {
        blockText = g_html_blocks[RegExp.$1];
        blockText = blockText.replace(/\$/g, "$$$$"); // Escape any dollar signs
        grafsOut[i] = grafsOut[i].replace(/~K\d+K/, blockText);
      }
    }

    return grafsOut.join("\n\n");
  }

  function encodeAmpsAndAngles(text) {
  // Smart processing for ampersands and angle brackets that need to be encoded.

    return (
      text
        // Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
        //   http://bumppo.net/projects/amputator/
        .replace(
          /&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,
          "&amp;"
        )

        // Encode naked <'s
        .replace(
          /<(?![a-z\/?\$!])/gi,
          "&lt;"
        )
    );
  }

  function encodeBackslashEscapes(text) {
  //
  //   Parameter:  String.
  //   Returns:  The string, with after processing the following backslash
  //             escape sequences.
  //

    // attacklab: The polite way to do this is with the new
    // escapeCharacters() function:
    //
    //   text = escapeCharacters(text, "\\", true);
    //   text = escapeCharacters(text, "`*_{}[]()>#+-.!", true);
    //
    // ...but we're sidestepping its use of the (slow) RegExp constructor
    // as an optimization for Firefox.  This function gets called a LOT.

    return (
      text
        .replace(
          /\\(\\)/g,
          escapeCharacters_callback
        )
        .replace(
          /\\([`*_{}\[\]()>#+-.!])/g,
          escapeCharacters_callback
        )
    );
  }

  function doAutoLinks(text) {
    return (
      text
        .replace(
          /<((https?|ftp|dict):[^'">\s]+)>/gi,
          '<a href="$1">$1</a>'
        )

        // Email addresses: <address@domain.foo>
        .replace(
          /<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,
          function (_, m1) {
            return encodeEmailAddress(unescapeSpecialChars(m1));
          }
        )
    );
  }

  // attacklab: why can't JavaScript speak hex?
  function char2hex(ch) {
    var
      hexDigits = '0123456789ABCDEF',
      dec = ch.charCodeAt(0);

    return hexDigits.charAt(dec>>4) + hexDigits.charAt(dec&15);
  }

  function encodeEmailAddress(addr) {
  //
  //  Input: an email address, e.g. "foo@example.com"
  //
  //  Output: the email address as a mailto link, with each character
  //  of the address encoded as either a decimal or hex entity, in
  //  the hopes of foiling most address harvesting spam bots. E.g.:
  //
  //      <a href="&#x6D;&#97;&#105;&#108;&#x74;&#111;:&#102;&#111;&#111;&#64;&#101;
  //         x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;">&#102;&#111;&#111;
  //         &#64;&#101;x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;</a>
  //
  //  Based on a filter by Matthew Wickline, posted to the BBEdit-Talk
  //  mailing list: <http://tinyurl.com/yu7ue>
  //

    var encode = [
      function (ch) { return "&#" + ch.charCodeAt(0) + ";"; },
      function (ch) { return "&#x" + char2hex(ch) + ";"; }
    ];

    addr = ("mailto:" + addr).replace(
      /./g,
      function (ch) {
        switch (ch) {
          case ":": // leave ':' alone (to spot mailto: later)
            return ch;
          case "@": // this *must* be encoded. I insist.
            return encode[Math.floor(Math.random()*2)](ch);
          default: // roughly 10% raw, 45% hex, 45% dec
            var r = Math.random();
            return r > 0.9 ? ch : r > 0.45 ? encode[1](ch) : encode[0](ch);
        }
      }
    );

    return '<a href="' + addr + '">' + addr.replace(/.+:/, "") + "</a>";
  }

  function unescapeSpecialChars(text) {
  //
  // Swap back in all the special characters we've hidden.
  //
    return text.replace(
      /~E(\d+)E/g,
      function (_, m1) {
        var charCodeToReplace = parseInt(m1, 10);
        return String.fromCharCode(charCodeToReplace);
      }
    );
  }

  function outdent(text) {
  //
  // Remove one level of line-leading tabs or spaces
  //

    // attacklab: hack around Konqueror 3.5.4 bug:
    // "----------bug".replace(/^-/g, "") === "bug"

    return (
      text
        .replace(/^(\t|[ ]{1,4})/gm, "~0") // attacklab: g_tab_width
        .replace(/~0/g, "") // attacklab: clean up hack
    );
  }

  function detab(text) {
  // attacklab: detab's completely rewritten for speed.
  // In perl we could fix it by anchoring the regexp with \G.
  // In JavaScript we're less fortunate.

    return (
      text
        // expand first n-1 tabs
        .replace(/\t(?=\t)/g, "    ") // attacklab: g_tab_width

        // replace the nth with two sentinels
        .replace(/\t/g, "~A~B")

        // use the sentinel to anchor our regex so it doesn't explode
        .replace(
          /~B(.+?)~A/g,
          function (_, leadingText) {
            var numSpaces = 4 - leadingText.length % 4; // attacklab: g_tab_width
            numSpaces > 0 && (leadingText += new Array(numSpaces + 1).join(" "));
            return leadingText;
          }
        )

        // clean up sentinels
        .replace(/~A/g, "    ") // attacklab: g_tab_width
        .replace(/~B/g, "")
    );
  }

  function escapeCharacters(text, charsToEscape) {
    // First we have to escape the escape characters so that
    // we can build a character class out of them
    return text.replace(
      new RegExp("([" + charsToEscape.replace(/([\[\]\\])/g, "\\$1") + "])", "g"),
      escapeCharacters_callback
    );
  }

  function escapeCharacters_callback(_, m1) {
    return "~E" + m1.charCodeAt(0) + "E";
  }

}(this));