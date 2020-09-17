---
title: Autocomplete Radix Tree (Trie) in Javascript
slug: autocomplete-radix-tree
data: 2020-02-03
tag:
- javascript
- data-structures
- tutorial
author: Matthew Roseman
description: Building a Radix Tree data structure in JS for autocomplete
---

### Contents
- [Overview](#overview)
- [Prefix Trees](#prefix-trees)
- [Radix Trees](#radix-trees)
- [Adding Words](#adding-words)
- [Searching Wrods](#searching-words)
- [Event Loop Blocking](#event-loop-blocking)

## Overview

A [Radix Tree](https://en.wikipedia.org/wiki/Radix_tree) is a data structure that can be used for writing autocomplete functions.
The basic process is iterating all the autocomplete options, adding them to the tree, creating new nodes for each word. And then when
a user has typed something, you take what they type, traverse the tree, and then collect all children in the subtree you are left with.

Radix trees are actually optimized (compressed) prefix trees, so I'll explain what those are, how radix trees improve the idea.
Then I'll describe how a radix tree can be generated in JS, and then how searching for words works.

Finally I'll describe some javascript specific issues I had, and how I solved them (event loop blocking)

If you are just interested in the final code, it can be found [here](https://gist.github.com/mattroseman/bfd541d4ec98ddcd83f3845c31a69400)

## Prefix Trees

<div class="side-by-side">

<div class="toleft" style="width: 55%;">

A prefix tree is a tree datastructure with each node representing a character in a word. The root representing the beginning of a word.
If cat was added to a prefix tree it would go **root -> c -> a -> t**, and it car was added as well the a node would have a **r** and **t** child node.

</div>

<div class="toright" style="width: 40%;">

![Basic Prefix Tree](./prefix_tree_01.png)

</div>
</div>

Nodes that represent an end of a word have to be specifically marked as word nodes. So **c**, and **a** in the above example would not be word nodes, but **t**, and **r** would be.

When adding words you simply loop through the word's characters, start at root and look for the child representing the current character.<br />
If you reach the last character, and there is a node for the last character, mark it as a word.<br />
If you reach a point where the current node doesn't have a child for the next character, start adding children nodes for each remaining character.

When searching words given a prefix, you traverse the tree similar to how you did when adding words until you reach the end of the prefix, or the
tree is missing a character in the prefix. If the tree is missing a character then there are no words with the prefix.<br />
However if you reach the last character of the prefix you can then perform a search of the subtree rooted at that last characters node, and find all
child nodes that are marked as words. These will be the words that begin with the prefix.

## Radix Trees

<div class="side-by-side">

<div class="toleft" style="width: 60%;">

A radix tree takes the prefix tree and optimizes it. There are a lot of unecessary nodes in a prefix tree. In the example above, there is no need for a **c** or an **a** node, and they can be combined into one node. That node would then have the two children **r** and **t**

</div>

<div class="toright" style="width: 35%;">

![Basic Radix Tree](./radix_tree_01.png)

</div>

</div>

Radix trees typically use edges to represent a string of characters, instead of the nodes. So the radix tree of the node above has one edge coming off the root node, with the string **CA**. That means that all words in the subtree rooted at that first child begin with **CA**.

Where this gets complicated is if we wanted to add a word like **company** which would split up our **CA** edge up, and modify the already existing tree.<br />
This is the payoff of radix trees: increased complexity when inserting words for a more efficient data structure with faster lookup.


## Adding Words

I'll start with some skeleton code for the classes I'll use...

{% highlight js %}
class RadixNode {
  constructor(edgeLabel, isWord=false) {
    this.edgeLabel = edgeLabel;
    this.children = {};

    this.isWord = isWord;
  }
}

class RadixTree {
  constructor() {
    this.root = new RadixNode('');
  }

  addWord(word) {
  }

  getWords(prefix) {
  }
}
{% endhighlight %}

Each node will be initialized with the edge label that leads to it, and it will have an object of all it's children.

To make the code easier to write later, I'll store the children as a dictionary, with the key bing the first character of that child's edge label.

Now let's figure out how the first word will be added

{% highlight js %}
  addWord(word) {
    word = word.toLowerCase();

    let currentNode = this.root;

    // make a new node that's a word and has an edge label of the given word
    const newNode = new RadixNode(word, true);
    currentNode.children[word[0]] = newNode;
  }
{% endhighlight %}

So we make a new RadixNode instance, with the given word, and make it a child of the root node.<br />
The root node (currentNode) has a property children that we treat like a dictionary. We add a key **word[0]** which is the first character of the given word. We then set the value to the new node we made.

So we now have a radix tree with two nodes and one word.

Adding other words gets more complicated, because we need logic to split apart the existing nodes to make room for the new nodes.

{% highlight js %}
  addWord(word) {
    word = word.toLowerCase();

    let currentNode = this.root;

    // iterate over the characters of the given word
    for (let i = 0; i < word.length; i++) {
      const currentCharacter = word[i];

      // check to see if there is a child of the currentNode with an edge label starting with the currentCharacter
      if (currentCharacter in currentNode.children) {
        // TODO add logic to move nodes around to make room for new node
      } else {
        const newNode = new RadixNode(word.substr(i), true);
        currentNode.children[currentCharacter] = newNode;

        return;
      }
    }
  }
{% endhighlight %}

We now iterate over each character of the given word, and check to see if that character is the beginning of one of the current nodes edges.

If there isn't an edge that matches, we simply create a new child node, and make the edge label the remaining characters of the given word.

For the complicated part we'll need a helper function to get the common prefix between two strings.

{% highlight js %}
/*
 * getCommonPrefix calculates the largest common prefix of two given strings
 */
function getCommonPrefix(a, b) {
  let commonPrefix = '';
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      return commonPrefix;
    }

    commonPrefix += a[i];
  }

  return commonPrefix;
}
{% endhighlight %}

Add this function outside of both classes.

Now when the current node has an edge we can follow there are 4 scenarios.

1. The edge label is exactly the same as what's left of the word.
2. The edge label contains all of what's left of the word plus some extra. (edge label is **facebook** and the word is **face**)
3. The word contains all of the edge label plus some extra. (edge label is **face** and the word is **facebook**)
4. The edge label and the word share a common prefix, but both differ at some point. (edge label is **farm** and the word is **face**)

{% highlight js %}
  addWord(word) {
    word = word.toLowerCase();

    let currentNode = this.root;

    // iterate over the characters of the given word
    for (let i = 0; i < word.length; i++) {
      const currentCharacter = word[i];

      // check to see if there is a child of the currentNode with an edge label starting with the currentCharacter
      if (currentCharacter in currentNode.children) {
        const edgeLabel = currentNode.children[currentCharacter].edgeLabel;

        // get the common prefix of this child's edge label and what's left of the word
        const commonPrefix = getCommonPrefix(edgeLabel, word.substr(i));

        // if the edge label and what's left of the word are the same
        if (edgeLabel === word.substr(i)) {
          // TODO add new node
          return;
        }

        // if the edge label contains the entirety of what's left of the word plus some extra
        if (commonPrefix.length < edgeLabel.length && commonPrefix.length === word.substr(i).length) {
          // TODO add new node
          return;
        }

        // if the edge label and what's left of the word share a common prefix, but differ at some point
        if (commonPrefix.length < edgeLabel.length && commonPrefix.length < word.substr(i).length) {
          // TODO add new node
          return;
        }

        // the last option is what's left of the word contains the entirety of the edge label plus some extra
        // TODO follow the edge label, and increment the for loop to take off all of the edge label characters
      } else {
        const newNode = new RadixNode(word.substr(i), true);
        currentNode.children[currentCharacter] = newNode;

        return;
      }
    }
  }
{% endhighlight %}

The easiest case is if the edge label and what's left of the word are exactly the same.

{% highlight js %}
        // if the edge label and what's left of the word are the same
        if (edgeLabel === word.substr(i)) {
          // update this child's data with the given data
          currentNode.children[currentCharacter].isWord = true;

          return;
        }
{% endhighlight %}

If the what's left of the word is all contained in the edge label, we just make a new word splitting up the edge label.

{% highlight js %}
        // if the edge label contains the entirety of what's left of the word plus some extra
        if (commonPrefix.length < edgeLabel.length && commonPrefix.length == word.substr(i).length) {
          // insert a new node (that's the new word) between the current node and the child, splitting up the edge label
          const newNode = new RadixNode(word.substr(i), true);

          // move the child so it's a child of the new node instead of the current node
          newNode.children[edgeLabel[commonPrefix.length]] = currentNode.children[currentCharacter]

          // make the edge label between the new node and it's child what's left of the edge label
          newNode.children[edgeLabel[commonPrefix.length]].edgeLabel = edgeLabel.substr(commonPrefix.length);

          // make the new node a child of current node
          currentNode.children[currentCharacter] = newNode;

          return;
        }
{% endhighlight %}

The complicated one, is if what's left of the word and the edge label share a common prefix, but both differ at some point.

{% highlight js %}
        // if the edge label and what's left of the word share a common prefix, but differ at some point
        if (commonPrefix.length < edgeLabel.length && commonPrefix.length < word.substr(i).length) {
          // insert a new inbetween node between current node and it's child, that will have children for the old child and a new node for the given word.
          const inbetweenNode = new RadixNode(commonPrefix);

          // move the child so it's a child of the inbetween node instead of the current node
          inbetweenNode.children[edgeLabel[commonPrefix.length]] = currentNode.children[currentCharacter]

          // make the edge label between the inbetween node and the child what's left of the edge label
          inbetweenNode.children[edgeLabel[commonPrefix.length]].edgeLabel = edgeLabel.substr(commonPrefix.length);

          // replace the child with the new inbetween node as a child of the current node
          currentNode.children[currentCharacter] = inbetweenNode;

          // add what's left of the word as another child for the inbetween node
          inbetweenNode.children[word.substr(i)[commonPrefix.length]] = new RadixNode(word.substr(i + commonPrefix.length), true);

          return;
        }
{% endhighlight %}

<div class="side-by-side">

<div class="toleft" style="width: 45%; padding-left: 40px;">

![Radix Insert Before](./radix_insert_01.png)

</div>

<div class="toright" style="width: 45%;">

![Radix Insert After](./radix_insert_02.png)

</div>
</div>

The last option is that the edge label is entirely contained in what's left of the word, so we just follow it and update the current node, taking off the edge labels characters from what's left of the word.

{% highlight js %}
        // the last option is what's left of the word contains the entirety of the edge label plus some extra
        // follow the edge, and take off all the characters the edge has
        i += edgeLabel.length - 1;
        currentNode = currentNode.children[currentCharacter];
{% endhighlight %}

Here is what the whole addWord function looks like.

{% highlight js %}
  addWord(word) {
    word = word.toLowerCase();

    let currentNode = this.root;

    // iterate over the characters of the given word
    for (let i = 0; i < word.length; i++) {
      const currentCharacter = word[i];

      // check to see if there is a child of the currentNode with an edge label starting with the currentCharacter
      if (currentCharacter in currentNode.children) {
        const edgeLabel = currentNode.children[currentCharacter].edgeLabel;

        // get the common prefix of this child's edge label and what's left of the word
        const commonPrefix = getCommonPrefix(edgeLabel, word.substr(i));

        // if the edge label and what's left of the word are the same
        if (edgeLabel === word.substr(i)) {
          // update this child's data with the given data
          currentNode.children[currentCharacter].isWord = true;

          return;
        }

        // if the edge label contains the entirety of what's left of the word plus some extra
        if (commonPrefix.length < edgeLabel.length && commonPrefix.length == word.substr(i).length) {
          // insert a new node (that's the new word) between the current node and the child, splitting up the edge label
          const newNode = new RadixNode(word.substr(i), true);

          // move the child so it's a child of the new node instead of the current node
          newNode.children[edgeLabel[commonPrefix.length]] = currentNode.children[currentCharacter]

          // make the edge label between the new node and it's child what's left of the edge label
          newNode.children[edgeLabel[commonPrefix.length]].edgeLabel = edgeLabel.substr(commonPrefix.length);

          // make the new node a child of current node
          currentNode.children[currentCharacter] = newNode;

          return;
        }

        // if the edge label and what's left of the word share a common prefix, but differ at some point
        if (commonPrefix.length < edgeLabel.length && commonPrefix.length < word.substr(i).length) {
          // insert a new inbetween node between current node and it's child, that will have children for the old child and a new node for the given word.
          const inbetweenNode = new RadixNode(commonPrefix);

          // move the child so it's a child of the inbetween node instead of the current node
          inbetweenNode.children[edgeLabel[commonPrefix.length]] = currentNode.children[currentCharacter]

          // make the edge label between the inbetween node and the child what's left of the edge label
          inbetweenNode.children[edgeLabel[commonPrefix.length]].edgeLabel = edgeLabel.substr(commonPrefix.length);

          // replace the child with the new inbetween node as a child of the current node
          currentNode.children[currentCharacter] = inbetweenNode;

          // add what's left of the word as another child for the inbetween node
          inbetweenNode.children[word.substr(i)[commonPrefix.length]] = new RadixNode(word.substr(i + commonPrefix.length), true);

          return;
        }

        // the last option is what's left of the word contains the entirety of the edge label plus some extra
        // follow the edge, and take off all the characters the edge has
        i += edgeLabel.length - 1;
        currentNode = currentNode.children[currentCharacter];
      } else {
        const newNode = new RadixNode(word.substr(i), true);
        currentNode.children[currentCharacter] = newNode;

        return;
      }
    }
  }
{% endhighlight %}

## Searching Words

Searching for words is much simpler than adding words. We traverse the tree finding edges that match
a given prefix, and then perform a depth first search and the node we end on.

{% highlight js %}
  getWords(prefix) {
    prefix = prefix.toLowerCase();

    let word = '';  // this variable will track the edgeLables as we go, so we know what each word is
    let currentNode = this.root;

    // iterate over the characters of the given prefix, following the Radix Tree
    // to find which node it ends at
    for (let i = 0; i < prefix.length; i++) {
      const character = prefix[i];

      if (character in currentNode.children) {
        const edgeLabel = currentNode.children[character].edgeLabel;
        const commonPrefix = getCommonPrefix(edgeLabel, prefix.substr(i));

        // if the commonPrefix doesn't match the edge label or what's left of the given prefix
        // than what's left of the given prefix differs from the edgeLabel, and there aren't
        // any words in the RadixTree that begin with it.
        if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== prefix.substr(i).length) {
          return [];
        }

        // add the selected child's characters to word
        word = word.concat(currentNode.children[character].edgeLabel);
        // increment i, taking off the edge label's characters
        i += currentNode.children[character].edgeLabel.length - 1;
        // update the current node to the selected child
        currentNode = currentNode.children[character];
      } else {
        // if there isn't an edge label that begins with the next prefix character
        // there are no words in the Radix tree that begin with the given prefix
        return [];
      }
    }

    // TODO DFS starting at current node to get all possible words with the given prefix
    let words = [];

    return words;
  }
{% endhighlight %}

If we make it through traversing the tree, and making sure the edge label's match what's left of the prefix, Than we know there are some words in the tree that begin with the given prefix.

Conveniently that currentNode variable happens to be at the root of the subtree that contains all
those words, so we only need to do a depth first search to find them all.

{% highlight js %}
    // DFS starting at current node to get all possible words with the given prefix
    let words = [];
    function dfs(startingNode, word) {
      // if we are currently visitng a node that's a word
      if (startingNode.isWord) {
        // append the given prefix to the running array of words
        words.push(word);
      }

      // if there are no child nodes return
      if (Object.keys(startingNode.children).length === 0) {
        return;
      }

      // for each child of the given child node
      for (const character of Object.keys(startingNode.children)) {
        // recursively call dfs on each child, after concating that child's edge label with the given prefix
        dfs(startingNode.children[character], word.concat(startingNode.children[character].edgeLabel));
      }
    }

    dfs(word);

    return words;
{% endhighlight %}

Finally, We can make the getWords more efficient by making it asynchronous, since the order it finds words doesn't matter.

The whole file then will look like.

{% highlight js %}
class RadixNode {
  constructor(edgeLabel, isWord=false) {
    this.edgeLabel = edgeLabel;
    this.children = {};

    this.isWord = isWord;
  }
}

class RadixTree {
  constructor() {
    this.root = new RadixNode('');
  }

  addWord(word) {
    word = word.toLowerCase();

    let currentNode = this.root;

    // iterate over the characters of the given word
    for (let i = 0; i < word.length; i++) {
      const currentCharacter = word[i];

      // check to see if there is a child of the currentNode with an edge label starting with the currentCharacter
      if (currentCharacter in currentNode.children) {
        const edgeLabel = currentNode.children[currentCharacter].edgeLabel;

        // get the common prefix of this child's edge label and what's left of the word
        const commonPrefix = getCommonPrefix(edgeLabel, word.substr(i));

        // if the edge label and what's left of the word are the same
        if (edgeLabel === word.substr(i)) {
          // update this child's data with the given data
          currentNode.children[currentCharacter].isWord = true;

          return;
        }

        // if the edge label contains the entirety of what's left of the word plus some extra
        if (commonPrefix.length < edgeLabel.length && commonPrefix.length === word.substr(i).length) {
          // insert a new node (that's the new word) between the current node and the child, splitting up the edge label
          const newNode = new RadixNode(word.substr(i), true);

          // move the child so it's a child of the new node instead of the current node
          newNode.children[edgeLabel[commonPrefix.length]] = currentNode.children[currentCharacter]

          // make the edge label between the new node and it's child what's left of the edge label
          newNode.children[edgeLabel[commonPrefix.length]].edgeLabel = edgeLabel.substr(commonPrefix.length);

          // make the new node a child of current node
          currentNode.children[currentCharacter] = newNode;

          return;
        }

        // if the edge label and what's left of the word share a common prefix, but differ at some point
        if (commonPrefix.length < edgeLabel.length && commonPrefix.length < word.substr(i).length) {
          // insert a new inbetween node between current node and it's child, that will have children for the old child and a new node for the given word.
          const inbetweenNode = new RadixNode(commonPrefix);

          // move the child so it's a child of the inbetween node instead of the current node
          inbetweenNode.children[edgeLabel[commonPrefix.length]] = currentNode.children[currentCharacter]

          // make the edge label between the inbetween node and the child what's left of the edge label
          inbetweenNode.children[edgeLabel[commonPrefix.length]].edgeLabel = edgeLabel.substr(commonPrefix.length);

          // replace the child with the new inbetween node as a child of the current node
          currentNode.children[currentCharacter] = inbetweenNode;

          // add what's left of the word as another child for the inbetween node
          inbetweenNode.children[word.substr(i)[commonPrefix.length]] = new RadixNode(word.substr(i + commonPrefix.length), true);

          return;
        }

        // the last option is what's left of the word contains the entirety of the edge label plus some extra
        // follow the edge, and take off all the characters the edge has
        i += edgeLabel.length - 1;
        currentNode = currentNode.children[currentCharacter];
      } else {
        const newNode = new RadixNode(word.substr(i), true);
        currentNode.children[currentCharacter] = newNode;

        return;
      }
    }
  }

  async getWords(prefix) {
    prefix = prefix.toLowerCase();

    let word = '';
    let currentNode = this.root;

    // iterate over the characters of the given prefix, following the Radix Tree
    // to find which node it ends at
    for (let i = 0; i < prefix.length; i++) {
      const character = prefix[i];

      if (character in currentNode.children) {
        const edgeLabel = currentNode.children[character].edgeLabel;
        const commonPrefix = getCommonPrefix(edgeLabel, prefix.substr(i));

        // if the commonPrefix doesn't match the edge label or what's left of the given prefix
        // than what's left of the given prefix differs from the edgeLabel, and there aren't
        // any words in the RadixTree that begin with it.
        if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== prefix.substr(i).length) {
          return [];
        }

        // add the selected child's characters to word
        word = word.concat(currentNode.children[character].edgeLabel);
        // increment i, taking off the edge label's characters
        i += currentNode.children[character].edgeLabel.length - 1;
        // update the current node to the selected child
        currentNode = currentNode.children[character];
      } else {
        // if there isn't an edge label that begins with the next prefix character
        // there are no words in the Radix tree that begin with the given prefix
        return [];
      }
    }

    // DFS starting at current node to get all possible words with the given prefix
    let words = [];
    async function dfs(startingNode, word) {
      // if we are currently visitng a node that's a word
      if (startingNode.isWord) {
        // append the given prefix to the running array of words
        words.push(word);
      }

      // if there are no child nodes return
      if (Object.keys(startingNode.children).length === 0) {
        return;
      }

      // for each child of the given child node
      for (const character of Object.keys(startingNode.children)) {
        // recursively call dfs on each child, after concating that child's edge label with the given prefix
        await dfs(startingNode.children[character], word.concat(startingNode.children[character].edgeLabel));
      }
    }

    await dfs(currentNode, word);

    return words;
  }
}

/*
 * getCommonPrefix calculates the largest common prefix of two given strings
 */
function getCommonPrefix(a, b) {
  let commonPrefix = '';
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      return commonPrefix;
    }

    commonPrefix += a[i];
  }

  return commonPrefix;
}
{% endhighlight %}

And if we run it...

{% highlight js %}
let radixTree = new RadixTree();

radixTree.addWord('facebook');
radixTree.addWord('fantastic');
radixTree.addWord('cantalope');
radixTree.addWord('zebra');
radixTree.addWord('keyboard');
radixTree.getWords('f').then(words => {
  console.log(`words with prefix 'f': ${words.join(', ')}`);
});
radixTree.getWords('fan').then(words => {
  console.log(`words with prefix 'fan': ${words.join(', ')}`);
});
radixTree.getWords('').then(words => {
  console.log(`all words: ${words.join(', ')}`);
});
{% endhighlight %}

We'll get the output...

{% highlight js %}
words with prefix 'fan': fantastic
words with prefix 'f': facebook, fantastic
all words: facebook, fantastic, cantalope, zebra, keyboard
{% endhighlight %}

## Event Loop Blocking

When I was implementing this code, I was building an Express endpoint that would take a prefix a user had typed and return autocomplete suggestions for movie titles.

There are a little over 500,000 movie titles according to IMDb, and that's a lot of words to fill a Radix Tree. Luckily it was very fast except in a few edgecases.

If the prefix was only one or two characters, or was the beginning of 'the ' (lots of movie titles start with 'the '), the tree that was searched using depth first search was particularly big, and took up to a few seconds.

It turned out that my code was blocking the event loop. This was noticable because as a user typed the first character would trigger a search and block the event loop, preventing the next search once the user had typed more characters.

The solution to this wasn't that complicated, I simply had to use node's setImmediate function to tell the getWords function to allow the event loop to continue, freeing up other asyncronous code (in this case Express).

To start, I'll use Node's promisify function to make setImmediate easier to use.

{% highlight js %}
const util = require('util');
const setImmediatePromise = util.promisify(setImmediate);
{% endhighlight %}

Reight before the recursive call to the dfs function, we can await the setImmediate function.

{% highlight js %}
await setImmediatePromise()
await dfs(startingNode.children[character], word.concat(startingNode.children[character].edgeLabel));
{% endhighlight %}

This will make each recursive call happen on the next event loop iteration. Thus allowing other asyncronous code to be able to execute.

This will slow the getWords function down a bit, so I ended up only awaiting the setImmediate call on prefixes I could predict being expensive (the edge cases I describe above).
But that's a decision that will have to be made depending on the needs of your code.
