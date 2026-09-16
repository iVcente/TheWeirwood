---
title: "Tag Index"
# This file exists only so the tag index can be unlisted.
#
# @quartz-community/tag-page generates /tags/ as a VIRTUAL page with empty
# `data`, so there is no frontmatter on it to mark and no option to suppress it
# — and it was turning up in the greensight as an unconnected node labelled "#"
# (the plugin's own simplifySlug turns `tags/index` into `tags/`, which its node
# renderer then reads as a tag rather than a page). Its generate() skips any tag
# slug that already exists as a real file, so writing this one takes the virtual
# page's place and lets it carry `unlisted: true`.
#
# The listing below it is still rendered by tag-page, not by weirwood-chrome:
# that plugin's folder page type deliberately declines every `tags/` slug, or it
# would out-priority tag-page here and replace the tag listing with an empty
# section hero.
unlisted: true
---
