
# qooqbooq

This repository is an effort to develop a comprehensive guide to
asynchronous promises in JavaScript.  My hope is for this text to evolve
organically: more a binder of notes from a sequence of intrepid
explorers than a definitive guide.  Authorship has no particular
granularity, but credit where credit is due.  There is to be a mix of
tips-and-tricks, engineering, and rigorous academic exploration.  The
goal is to coax inductees from solving simple problems to solving
problems they never thought they had.  This is not mere education, but
seduction: a trail to the frontier: the state-of-the-art.

As the title implies, this book is ultimately about the `Q`
implementation of promises.  It has both a long history and a far
future.  That said, it does not stand alone.  From the vantage of `Q`, we
will explore related efforts, both in implementation and
standardization.  We will honestly assess ourselves and others in the
light of the engineering trade-offs that make each of these efforts
unique.

And with that, we hope we have established the intended tone.
Logistically, this is a collection of Markdown files.  Each of these
files should have the granularity of a chapter or a letter to Grandma.
Each file has a name of the form `lower-case.md`.  With regard to the
order or sequence of the book, refer here for the Table of Content.

All of this is likely to change when the war begins.

## Table of Content

1. [Four Words](four-words.md)
1. Foreword
1. Forward: What is a Promise
1. [A Graduated Tutorial](tutorial.md)
1. Handling Exceptions
1. Debugging
    1. Long Traces
1. Proxies for Objects
1. Proxies for Arrays
1. Recipe: A Module Loader
1. Recipe: Map and Reduce
1. [Streams](streams.md)
1. File System
1. HTTP Request and Response Cycle
1. Joey
1. Promises for Remote Objects
    1. [Bridging and Central Dispatch](central-dispatch.md)
1. On Object Capabilities
1. Recipe: An Secure Escrow Exchange
1. [The Design of a Promise Implementation](design.md)
1. The Point of Promises
    1. Epiphany: The Pyramid of Doom or the Chain of Fate
    1. Epiphany: Propagating Exceptions (by way of
       http://domenic.me/2012/10/14/youre-missing-the-point-of-promises/)
    1. Epiphany: Remote Objects and Pipelining
    1. Epiphany: Mutually Suspicious Objects
    1. Epiphany: Asynchronous Debugger
    1. Epiphany: Multi-process Debugger
    1. Epiphany: Monads
1. The Outside World
    1. Assimilation
    1. Domains
    1. jQuery
1. History of Promises
1. Future of Promises

