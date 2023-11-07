# btree-js

> [!NOTE]
> This project is no longer maintained

A limited feature implementation of a B-tree index in Javascript. Currently only supporting `insert`, `find` and `traverse` operations.

This is the precursor to implementing the same thing in [Solidity](https://solidity.readthedocs.io/en/develop/index.html) for use in ranking of posts in my [Ethereum Reddit clone](https://github.com/kaa/eth-talk).

## Usage
```javascript
// Initialize index
var ix = new BTree();

// Insert "the answer" with key 42
ix.insert(42,"the answer"); 

// Find value of key 42
var value = ix.find(42); // value == "the answer"

// Insert some more
ix.insert(2,"love is");
ix.insert(99,"always");

// Traverse tree in key order
var values = ix.traverse(0); // value == ["love is", "the answer", "always"]
```
