---
layout: post
title:  "Speed up your Python code with Rust"
date:  2023-09-05 21:09:00 +0100
categories: python rust
tags: python rust
---

## Motivation

Python is a widely used language. According to the [Stack Overflow 2023 Developer Survey](https://survey.stackoverflow.co/2023/#section-admired-and-desired-programming-scripting-and-markup-languages), Python ranks second as the most desired language.

Python gained popularity when it became the go-to language for statistical analysis, data transformations, and machine learning.

However, Python falls short of being the most popular language when it comes to speed. Nevertheless, Python can integrate with other languages like C, Java, and Rust, which allows you to speed up your Python code. Typically, Python extensions are written in the C language, but lately, they have been extended using Rust due to its obvious rise in popularity.

In order to use Rust in Python, you need to make the compiled Rust code available for execution within Python. This integration can be done manually, but some tools have been developed to simplify this process. One of the most widely used tools for this purpose  is [PyO3](https://pyo3.rs/).

WIP...
