---
title:  "Managing multiple Poetry versions"
date:  2023-08-19 14:04:51 +0100
---

## Motivation

As Machine Learning Engineers, you might deal with multiple ML projects. Since (at the time of writing),
the use of Poetry for Python dependency management is not standard and each project might have different Poetry versions, we often deal with incompatibilities across projects in our OS.

Usually, the installation of Poetry is global (unless it is installed using pip in the environment which is not the recommended installation or you are using Conda).
This means that managing different Poetry versions can be a challenging task.

## How to manage different Poetry installations

Fortunately, using [pipx](https://pypa.github.io/pipx/) (isolated pip) and [Makefile](https://makefiletutorial.com/), you can workaround and implement a solution that allows you to have multiple
Poetry versions without conflicting with one another.

### Installing different Poetry versions

1. Install pipx
2. Using pipx:
   1. Execute `pipx install --suffix "@1.4" poetry==1.4.2` and `pipx install --suffix "@1.2" poetry==1.2.0` in your terminal
   2. Ensure you have `poetry@1.4` and `poetry@1.2` available in your terminal

At this point, you should have different Poetry versions available in your environment

### Selecting a Poetry version

Whenever you want to use a specific Poetry version, you can simply select the version by the suffix in the previous step: `poetry@1.4 install`.

When you use Makefile, the commands usually only reference `poetry` and this selects the first Poetry version in the environment. Although, if you change the Makefile as follows:

```makefile
# Loads .env on the same directory as the Makefile
ifneq ("$(wildcard .env)","")
	include .env
endif

POETRY_COMMAND ?= poetry  # `POETRY_COMMAND` environment variable which defaults to `poetry`
...

# Run poetry commands
install:
  @$(POETRY_COMMAND) config virtualenvs.create true
  @$(POETRY_COMMAND) config virtualenvs.in-project true
  $(POETRY_COMMAND) install
```

If you have these instructions in the Makefile of every project, you can point to different Poetry versions through `POETRY_COMMAND` env variable. Let's use `.env` files for that:
 
```command-line
> cd project_1
> tree
.
├── app
Makefile
.env
> cat .env
POETRY_COMMAND=poetry@1.4

> cd project_2
> tree
.
├── app
Makefile
.env
> cat .env
POETRY_COMMAND=poetry@1.2
```

## Future work

This workaround is enough to have multiple Poetry versions between projects. Nonetheless, a better and standard solution would be appreciated. For instance, there is a tool to manage different [Terraform](https://www.terraform.io/) versions called [tfswitch](https://tfswitch.warrensbox.com/).

## References

* [Several versions of poetry at the same time?](https://github.com/orgs/python-poetry/discussions/7866#discussioncomment-5787384)
* [tfswitch](https://tfswitch.warrensbox.com/)
