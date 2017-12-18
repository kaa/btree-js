import { BTree, Node } from "../btree";
import * as assert from "assert";
import { inspect } from 'util';

describe("btree", function () {
  it("returns null when tree is empty", function () {
    const btree = new BTree();
    assert.equal(null, btree.find(1, 42));
  })
  it("null when item is not found", function () {
    const btree = new BTree();
    btree.insert(1, 42);
    assert.equal(null, btree.find(2));
  })
  it("inserted item can be found", function () {
    const btree = new BTree();
    btree.insert(1, 42);
    assert.equal(42, btree.find(1));
  })
  it("degree inserted items can be found", function () {
    const btree = new BTree();
    btree.insert(1, 42);
    btree.insert(2, 43);
    btree.insert(3, 44);
    assert.equal(42, btree.find(1));
    assert.equal(43, btree.find(2));
    assert.equal(44, btree.find(3));
  })
  it("insertion with root split can find item", function () {
    /*
    [1]

    [13]

    [134]

      [3]
    [12][4]
    */
    const btree = new BTree();
    btree.insert(1, 42);
    btree.insert(3, 44);
    btree.insert(4, 45);
    btree.insert(2, 43);
    assert.equal(43, btree.find(2));
  });
  /*
             [24]
        [12]       [36]
    [3 5 11] [15] [26 31][42 44 49]

         [12 24 36]
    [3 5][15][26 31][42 44 49]
  */
  it("insertion of 500 items find all", function () {
    const btree = new BTree();
    var keys = Array.from({ length: 500 }, (value, key) => key);
    shuffle(keys, random(4242));
    keys.forEach(t => {
      btree.insert(t, t);
    })
    keys.forEach((t, ix) => {
      assert.equal(btree.find(t), t, "failed key " + t + " at " + ix);
    })
  });

  describe("_splitRoot", function () {
    //   [123]
    //   [abc]
    //
    //     V
    //
    //    [2]
    //    [b]
    //   /   \
    // [1]   [3]
    // [a]   [c]

    const btree = new BTree();
    btree.root = Node.make(3, [1, 2, 3], ["a", "b", "c"]);
    btree._splitRoot();

    it("root is no longer leaf", function () {
      assert.equal(btree.root.isLeaf, false);
    });
    it("median in root", function ()  {
      var root = btree.root;
      assert.equal(root.size, 1);
      assert.equal(root.keys[0], 2);
      assert.equal(root.data[0], "b");
    });
    it("left half in first child", function ()  {
      var left = btree.root.children[0];
      assert.equal(left.size, 1);
      assert.equal(left.keys[0], 1);
      assert.equal(left.data[0], "a");
    });
    it("right half in second child", function ()  {
      var right = btree.root.children[1];
      assert.equal(right.size, 1);
      assert.equal(right.keys[0], 3);
      assert.equal(right.data[0], "c");
    });
  })

  describe("leaf _splitNode", function () {
    //      [26]
    //      [bf]
    //     /  \ \__
    //    /   |    \
    // [1]   [345] [7]
    // [a]   [cde] |g]
    //
    //       V
    //
    //     [246]
    //     [bdf]__
    //    / | \   \
    // [1] [3] [5] [7]
    // [a] [c] [e] [g]

    const btree = new BTree();
    btree.root = Node.make(3, [2, 6], ["b", "f"]);
    btree.root.children[0] = Node.make(3, [1], ["a"])
    btree.root.children[1] = Node.make(3, [3, 4, 5], ["c", "d", "e"]);
    btree.root.children[2] = Node.make(3, [7], ["g"]);

    btree._splitNode(btree.root.children[1], btree.root);
    var left = btree.root.children[1];
    var right = btree.root.children[2];
    var root = btree.root;

    it("left and right are leaf", function () {
      assert.equal(left.isLeaf, true);
      assert.equal(right.isLeaf, true);
    });
    it("splits keys and data", function () {
      assert.equal(left.size, 1);
      assert.equal(left.keys[0], 3);
      assert.equal(left.data[0], "c");
      assert.equal(right.size, 1);
      assert.equal(right.keys[0], 5);
      assert.equal(right.data[0], "e");
    })
    it("inserts median in parent", function () {
      assert.equal(root.size, 3);
      assert.equal(root.keys[1], 4);
      assert.equal(root.data[1], "d");
    });
  })
  describe("node _splitNode", function () {
    /*

          [2]
          [b]
      [1]     [468]
      [a]     [dfh]
           [3][5][7][9]
           [c][e][g][i]

           [26]
           [bf]
      [1]   [4]   [8]
      [a]   [d]   [h]
          [3][5] [7][9]
          [c][e] [g][i]
    */
    var tree = new BTree();
    var root = tree.root = Node.make(3, [2], ["b"]);
    root.children[0] = Node.make(3, [1], ["a"]);
    var node = root.children[1] = Node.make(3, [4, 6, 8], ["d", "f", "h"]);
    node.children[0] = Node.make(3, [3], ["c"]);
    node.children[1] = Node.make(3, [5], ["e"]);
    node.children[2] = Node.make(3, [7], ["g"]);
    node.children[3] = Node.make(3, [9], ["i"]);

    tree._splitNode(node, root);

    var left = root.children[1];
    var right = root.children[2];

    it("splits keys and data", function () {
      assert.equal(left.size, 1);
      assert.equal(left.keys[0], 4);
      assert.equal(left.data[0], "d");
      assert.equal(right.size, 1);
      assert.equal(right.keys[0], 8);
      assert.equal(right.data[0], "h");
    })
    it("inserts median in root", function () {
      assert.equal(root.size, 2);
      assert.equal(root.keys[1], 6);
      assert.equal(root.data[1], "f");
    })
  })
});

/*

  [123]

   [2]
  [1][3]

   [2]
  [1][345]

    [24]
  [1][3][5]

    [24]
  [1][3][567]

     [246]
  [1][3][5][7]

     [246]
  [1][3][5][789]

      [246]
  [1][3][5][789]
  
*/

function shuffle(array, rnd) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(rnd() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function random(seed) {
  return function () {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
}