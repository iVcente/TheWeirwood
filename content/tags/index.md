---
title: "All Tags"
# This file exists only so the tag index can be unlisted, and to name it: the
# hero prints this title, and the kindred band on every tag page ends in a chip
# pointing here.
#
# ./plugins/weirwood-tags generates /tags/ as a VIRTUAL page with empty
# `data`, so there is no frontmatter on it to mark and no option to suppress it
# — and it was turning up in the greensight as an unconnected node labelled "#"
# (the plugin's own simplifySlug turns `tags/index` into `tags/`, which its node
# renderer then reads as a tag rather than a page). Its generate() skips any tag
# slug that already exists as a real file, so writing this one takes the virtual
# page's place and lets it carry `unlisted: true`.
#
# Being a real file is also what gets this page rendered at all: weirwood-tags
# only reaches a page through `match` when it exists on disk. The listing below
# is that plugin's, not weirwood-chrome's — the folder page type deliberately
# declines every `tags/` slug, or it would out-priority the tag page type here
# and replace the tag index with an empty section hero.
unlisted: true
---
