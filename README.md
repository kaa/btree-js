# btree-js
A limited feature implementation of a B-tree index in Javascript. Currently only supporting `insert` and `find` operations.

This is the precursor to implementing the same thing in [Solidity](https://solidity.readthedocs.io/en/develop/index.html) for use in ranking of posts in my [Ethereum Reddit clone](https://github.com/kaa/eth-talk).

## Usage
```javascript
// Initialize index
var ix = new BTree();

// Insert "The answer" with key 42
ix.insert(42,"The answer"); 

// Find value of key 42
var value = ix.find(42); // value == "The answer"
```