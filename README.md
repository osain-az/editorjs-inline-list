# Editorjs plugin for adding inline or nested list.
<!-- markdownlint-disable first-line-h1 -->

<h1 align="center">Welcome to editorjs-Inlinelist 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/editorjs-inlinelist" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/editorjs-inlinelist.svg">
  </a>
  <a href="https://github.com/osain-az/editorjs-comment/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>

</p>

## Motivation
Editorjs already have a tool for List https://github.com/editor-js/list  but sometime someone may need have a nested list or create an inline list which can done with the `InlineList` <br> `InlineList` is not an alternative  to  https://github.com/editor-js/list  but could be use alone  for those that need a nested or inline block. As the name implies, it wont create a new block but just an line  which means it can used with any tool (paragraph, table, text). 

### Issue
* When using with `List`, if the current list is an ordered list then to add a nested list using `InlineList` it should be an unordered list else it will cause an error.  <br> If you want the parent and children list to be these same then  change `List` to different  then after adding the nested list  then change parent list to what use need. 

## Installation

### Install via NPM

```sh
npm install editorjs-inlinelist

```

### Load from CDN

```html
<script src="https://cdn.jsdelivr.net/npm/editorjs-inlinelist@latest"></script>
```


### Usage
```typescript
import InlineList from "editorjs-inlinelist";

const EDITOR_JS_TOOL = {
 inlineList: InlineList,
   //add  others
   list: List
   ....
}
```

##### note: This  project is still in beta so  breaking changes may occur often 
## 🤝 Contributing



Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/osain-az/editorjs-inline-list/issues).

## Show your support

Give a ⭐️ if this project helped you!