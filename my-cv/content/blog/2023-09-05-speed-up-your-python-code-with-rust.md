---
title:  "Speed up your Python code with Rust"
date:  2023-09-05 21:09:00 +0100
---

## Motivation

Python is a widely used language. According to the [Stack Overflow 2023 Developer Survey](https://survey.stackoverflow.co/2023/#section-admired-and-desired-programming-scripting-and-markup-languages), Python ranks second as the most desired language.

Python gained popularity when it became the go-to language for statistical analysis, data transformations, and machine learning.

However, Python falls short of being the most popular language when it comes to speed. Nevertheless, Python can integrate with other languages like C, Java, and Rust, which allows you to speed up your Python code. Typically, Python extensions are written in the C language, but lately, they have been extended using Rust due to its obvious rise in popularity.

In order to use Rust in Python, you need to make the compiled Rust code available for execution within Python. This integration can be done manually, but some tools have been developed to simplify this process. One of the most widely used tools for this purpose  is [PyO3](https://pyo3.rs/). PyO3 encapsulates your Rust code within a native Python module, making the process of generating bindings straightforward and entirely transparent. This allows you to speed-up your Python by some considerable order of magnitude.

## How to integrate Rust in Python?

### Pre-requisites

First things first, you need to install [Rust](https://www.rust-lang.org/tools/install) and Python of course. I recommend using [Pyenv](https://github.com/pyenv/pyenv) (to manage Python versions) and [Poetry 1.5.1+](https://python-poetry.org/) (to manage Python dependencies).

Also, choose an IDE of your choice. I am sticking with [Visual Studio Code (VSCode)](https://code.visualstudio.com/).

Please note that the following is beyond this scope:

* Configuring VSCode and your environment
* Deep diving Rust basics
* Packaging Python package with Rust dependencies (maybe in a future post :wink:)
* Walkthrough for Windows systems

### Creating a project

To create the project, follow these steps:

* `pyenv install 3.9.17` (feel free to install any other compatible version)
* `mkdir python-rust-extensions && cd python-rust-extensions`
* `pyenv local 3.9.17`
* `poetry init`
* `cargo new src`
* (Optional) `git init`


### Configuring the project

#### Rust side

Edit `Cargo.toml` file and add the following:

```toml
[lib]
# The name of the native library. This is the name which will be used in Python to import the
# library (i.e. `import string_sum`). If you change this, you must also change the name of the
# `#[pymodule]` in `src/lib.rs`.
name = "rust_extensions"
# "cdylib" is necessary to produce a shared library for Python to import from.
#
# Downstream Rust code (including code in `bin/`, `examples/`, and `tests/`) will not be able
# to `use string_sum;` unless the "rlib" or "lib" crate type is also included, e.g.:
# crate-type = ["cdylib", "rlib"]
crate-type = ["cdylib"]
```

This will ensure that the output when compiling Rust code will have the right format to be used in Python. Also, if you want to use your Rust code as a library within Rust, you need to add `rlib` as well.

Finally, run `cargo add pyo3` to add the PyO3 dependency to the Rust project.

Your final `Cargo.toml` should look like:

```toml
[package]
name = "src"
version = "0.1.0"
edition = "2023"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[lib]
# The name of the native library. This is the name which will be used in Python to import the
# library (i.e. `import string_sum`). If you change this, you must also change the name of the
# `#[pymodule]` in `src/lib.rs`.
name = "rust_extensions"
# "cdylib" is necessary to produce a shared library for Python to import from.
#
# Downstream Rust code (including code in `bin/`, `examples/`, and `tests/`) will not be able
# to `use string_sum;` unless the "rlib" or "lib" crate type is also included, e.g.:
# crate-type = ["cdylib", "rlib"]
crate-type = ["cdylib"]

[dependencies]
pyo3 = { version = "0.19.2", features = ["extension-module"] }
```

#### Python side

On Python side, we will only add a benchmark library so that we can compare built-in Python with Rust equivalent implementation. Given that, just add pytest benchmark library `poetry add pytest-benchmark -G dev`. `-G dev` adds a dependency to a dev group to separate it from the project dependencies. Feel free to add it to any other group.

Your `project.toml` file should look something like:

```toml
[tool.poetry]
name = "python-rust-extensions"
version = ...
description = "Repository to integrate Python with Rust"
authors = [...]

[tool.poetry.dependencies]
python = "^3.9"

[tool.poetry.group.dev.dependencies]
pytest-benchmark = "^4.0.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

At this point you should have a function Python + Rust project.

### Writing some code

Let's start with a basic task.

#### Getting the n-th Fibonacci number

The Fibonacci sequence is defined as the sum of the previous two numbers. This first two number of the sequence are 0 and 1 by definition. Which means that the **3rd** is `0 + 1 = 1`.

In Python, this function would be defined as follow:

```python
# python_rust_extensions/main.py
def py_fibonacci(n: int) -> int:
    # Check if n is 0; if so, return 0 (the 0th Fibonacci number).
    if n == 0:
        return 0
    # Check if n is 1; if so, return 1 (the 1st Fibonacci number).
    elif n == 1:
        return 1

    # If n is greater than 1, calculate the Fibonacci number iteratively.
    # Start with the initial values for the first two Fibonacci numbers.
    prev = 0  # The (n-2)th Fibonacci number
    curr = 1  # The (n-1)th Fibonacci number

    # Loop from 2 to n (inclusive) to calculate the nth Fibonacci number.
    for _ in range(2, n + 1):
        next_num = prev + curr  # Calculate the next Fibonacci number.
        prev = curr  # Update the (n-2)th Fibonacci number.
        curr = next_num  # Update the (n-1)th Fibonacci number.

    # Return the calculated nth Fibonacci number.
    return curr
```


In Rust, this function would be defined as follows:

```rust
# src/lib.rs

// Import the necessary PyO3 traits and macros for Python integration.
use pyo3::prelude::*;

// Define a Python function named "fibonacci" that takes an unsigned 32-bit integer "n" as input
// and returns an unsigned 64-bit integer (the Fibonacci number).
#[pyfunction]
fn fibonacci(n: u32) -> u64 {
    // Check if n is 0; if so, return 0 (the 0th Fibonacci number).
    if n == 0 {
        return 0;
    }
    // Check if n is 1; if so, return 1 (the 1st Fibonacci number).
    else if n == 1 {
        return 1;
    }

    // Initialize two mutable variables to keep track of the previous and current Fibonacci numbers.
    let mut prev = 0;  // The (n-2)th Fibonacci number
    let mut curr = 1;  // The (n-1)th Fibonacci number

    // Use a for loop to calculate the nth Fibonacci number iteratively.
    // Start the loop from 2 (since we've already handled cases for n = 0 and n = 1).
    for _ in 2..=n {
        // Calculate the next Fibonacci number by adding the previous two numbers.
        let next = prev + curr;
        // Update "prev" to store the previous Fibonacci number.
        prev = curr;
        // Update "curr" to store the current Fibonacci number.
        curr = next;
    }

    // Return the calculated nth Fibonacci number (stored in "curr").
    curr
}
```

This implementation is quite similar to the Python one. Feel free to deep-dive in the comments to understand the Rust implementation.

#### Compiling rust code to used in Python

To compile the Rust code and produce a bytecode artifact execute the following in your terminal: `cargo build --release`. This builds the Rust code ready for release (without any debugging options which would slow down Rust).

This will create `target/release/librust_extensions.so`. Now, copy that file to the project root: `cp target/release/librust_extensions.so ./rust_extensions.so`.

#### Importing Rust code in Python

Now, in `python_rust_extensions/main.py` file you can import `rust_extensions`:

```python
import rust_extensions


def py_fibonacci(n: int) -> int:
    ...
```

#### Comparing both versions

Now let's leverage `pytest-benchmark` to compare both versions.

Add the following Python code:

```python
import rust_extensions

from pytest_benchmark.fixture import BenchmarkFixture


def py_fibonacci(n: int) -> int:
    ...


def test_py_fibonacci(benchmark: BenchmarkFixture):
    benchmark.pedantic(py_fibonacci, (10_000,), rounds=1_000, iterations=10)


def test_rust_fibonacci(benchmark: BenchmarkFixture):
    benchmark.pedantic(
        rust_extensions.fibonacci,
        (10_000,),
        rounds=1_000,
        iterations=10,
    )
```

Then execute in your terminal: `pytest -sv --benchmark-sort=fullname python_rust_extensions/main.py`

The terminal shows the following results:

```command-line
------------------------------------------------------------------------------------------- benchmark: 2 tests ------------------------------------------------------------------------------------------
Name (time in us)            Min                   Max                  Mean              StdDev                Median                IQR            Outliers           OPS            Rounds  Iterations
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
test_py_fibonacci       985.0408 (196.27)   1,801.8745 (176.73)   1,051.7682 (158.35)   126.3029 (74.59)    1,006.3533 (186.42)   45.3969 (13.88)      76;104      950.7798 (0.01)       1000          10
test_rust_fibonacci       5.0188 (1.0)         10.1959 (1.0)          6.6419 (1.0)        1.6932 (1.0)          5.3984 (1.0)       3.2706 (1.0)         284;0  150,559.7812 (1.0)        1000          10
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
```

As you can see, Rust code is immensily faster that built-in Python code. You can try to change the test parameters by yourself (`rounds` and `iterations`) to do some tests.

## Wrap-Up

In this blog post, we explored a powerful strategy for enhancing the performance of Python code by integrating Rust, a high-performance systems programming language. Python is renowned for its simplicity and versatility, making it a favorite among developers. However, it often falls short in terms of raw execution speed, particularly for compute-intensive tasks.

To address this limitation, we delved into the world of Rust, a language celebrated for its speed and memory safety. By combining Python and Rust, we can leverage the strengths of both languages to create blazing-fast Python applications.

Here are the key takeaways:

### 1. Motivation

Python is widely admired for its readability and ease of use, making it a top choice for various applications. However, when it comes to tasks demanding high computational performance, Python might not be the optimal choice.

### 2. Integrating Rust with Python

We introduced the concept of integrating Rust with Python and discussed how this synergy can significantly boost the execution speed of Python code. Rust's compatibility with Python allows us to seamlessly bridge the gap between high-level scripting and low-level systems programming.

### 3. The Role of PyO3

PyO3, a popular tool in this context, simplifies the integration process. It encapsulates Rust code within native Python modules, streamlining the creation of Python bindings. PyO3 enables you to accelerate your Python code by orders of magnitude, thanks to Rust's exceptional performance.

### 4. Setting Up Your Environment

We provided essential prerequisites for this integration, including the installation of Rust and Python, and suggested tools such as Pyenv and Poetry for version management and dependency handling. We also recommended using an Integrated Development Environment (IDE) like Visual Studio Code (VSCode) for a smoother coding experience.

### 5. Project Creation and Configuration

We guided you through the process of creating a Python + Rust project, including setting up project directories, initializing the project with Poetry, and configuring the Rust side by editing the `Cargo.toml` file to ensure compatibility with Python.

### 6. Writing Code in Both Languages

We demonstrated how to write equivalent Fibonacci number calculation functions in both Python and Rust. This comparison allowed us to highlight the syntax and approaches in each language.

### 7. Compiling Rust Code for Python

You learned how to compile Rust code to produce a bytecode artifact ready for Python integration. We discussed how to generate the shared library and import it into your Python project.

### 8. Benchmarking Python and Rust

Finally, we explored the significance of benchmarking to assess the performance improvements achieved by integrating Rust. Using the `pytest-benchmark` library, we compared execution times between the Python and Rust implementations, showcasing the substantial speed gains offered by Rust.

In conclusion, the marriage of Python and Rust offers a compelling solution for developers seeking to optimize their Python code without sacrificing readability and maintainability. By tapping into Rust's speed and Python's flexibility, you can embark on a journey of enhanced performance and efficiency in your Python projects.

So why wait? Start integrating Rust with Python today and unlock the full potential of your Python applications!

Happy coding!

## Links

* [Repository example](https://github.com/jonsnowseven/python-rust-extensions.git)
