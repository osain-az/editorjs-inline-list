/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as EditorJS from "@editorjs/editorjs";

export default class InlineList implements EditorJS.InlineTool {
  api: EditorJS.API;
  /**
   * Toolbar Button
   *
   * @type {HTMLElement|null}
   */
  button: HTMLElement | null = null;
  range: Range | null = null;
  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  public static isInline = true;

  tag: string = "UL";

  iconClasses: {
    base: string;
    active: string;
  };
  /**
   * Class name for term-tag
   *
   * @type {string}
   */
  static get CSS() {
    return "inline-list";
  }

  containerId: string = "inlineList-con-id";
  /**
   * @param {{api: object}}  - Editor.js API
   */
  constructor({ api }: { api: EditorJS.API }) {
    this.api = api;

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive,
    };
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLButtonElement}
   */
  render() {
    this.button = document.createElement("button") as HTMLButtonElement;
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;
    this.button.addEventListener("click", () => {
      const actionEltContainer = document.getElementById(this.containerId);
      const btnList = document.getElementById("btn-list_id");
      if (btnList) {
        btnList.remove();
        return;
      }
      if (!actionEltContainer) return;
      this.showListType(actionEltContainer);
    });
    return this.button;
  }

  renderActions() {
    // render a placeholder div  for the comment  component
    const commentContainer = document.createElement("div");
    // commentContainer.hidden = true;
    commentContainer.id = this.containerId;
    return commentContainer;
  }

  showListType(actionEle: HTMLElement) {
    const orderedListBtn = document.createElement(
      "button"
    ) as HTMLButtonElement;
    const width = "83px";
    orderedListBtn.type = "button";
    orderedListBtn.innerText = "order list";
    orderedListBtn.style.display = "block";
    orderedListBtn.style.margin = "7px auto";
    orderedListBtn.style.width = width;
    orderedListBtn.addEventListener("click", () => {
      this.tag = "OL";
      this.customSurround();
    });
    const unorderedListBtn = document.createElement(
      "button"
    ) as HTMLButtonElement;

    unorderedListBtn.type = "button";
    unorderedListBtn.innerText = "unorder list";
    unorderedListBtn.style.display = "block";
    unorderedListBtn.style.margin = "0 auto";
    unorderedListBtn.style.width = width;

    unorderedListBtn.addEventListener("click", () => {
      this.tag = "UL";
      this.customSurround();
    });
    const commentContainer = document.createElement("div");
    commentContainer.id = "btn-list_id";

    commentContainer.appendChild(unorderedListBtn);
    commentContainer.appendChild(orderedListBtn);

    actionEle.appendChild(commentContainer);
  }

  /**
   * Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range: Range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag("LI", InlineList.CSS);
    console.log("first", termWrapper);
    if (termWrapper) {
      this.unwrap(termWrapper);
      return;
    }

    this.range = range;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  customSurround() {
    const tag1 = "UL";
    const tag2 = "OL";

    let termWrapper = this.api.selection.findParentTag(
      this.tag,
      InlineList.CSS
    );
   
    /**
     * If start or end of selection is in the highlighted block
     */

    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      if (!this.range) return;
      this.wrap(this.range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range: Range) {
    /**
     * Create a wrapper for given tagName
     */
    const listElement = document.createElement(this.tag);
    const listItem = document.createElement("li");
    listItem.classList.add(InlineList.CSS);

    listElement.appendChild(listItem);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     */

    listItem.appendChild(range.extractContents());

    range.insertNode(listElement);
    this.api.selection.expandToTag(listElement);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper: HTMLElement) {
    //Todo: Unwrapping is not removing the `ul/ol, fixed it.
    
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    const sel = window.getSelection();
    if (!sel) return;
    const range = sel.getRangeAt(0);

    const unwrappedContent = range.extractContents();

    if (termWrapper.parentNode)
      /**
       * Remove empty term-tag
       */
      termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();

    //sel.anchorNode?.parentElement?.remove();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag);

    if (!this.button) return false;
    this.button.classList.toggle(this.iconClasses.active, !!termTag);

    return !!termTag;
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon() {
    return `<?xml version="1.0" ?><svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M20 4H4C3.44771 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V5C21 4.44771 20.5523 4 20 4ZM4 2C2.34315 2 1 3.34315 1 5V19C1 20.6569 2.34315 22 4 22H20C21.6569 22 23 20.6569 23 19V5C23 3.34315 21.6569 2 20 2H4ZM6 7H8V9H6V7ZM11 7C10.4477 7 10 7.44772 10 8C10 8.55228 10.4477 9 11 9H17C17.5523 9 18 8.55228 18 8C18 7.44772 17.5523 7 17 7H11ZM8 11H6V13H8V11ZM10 12C10 11.4477 10.4477 11 11 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H11C10.4477 13 10 12.5523 10 12ZM8 15H6V17H8V15ZM10 16C10 15.4477 10.4477 15 11 15H17C17.5523 15 18 15.4477 18 16C18 16.5523 17.5523 17 17 17H11C10.4477 17 10 16.5523 10 16Z" fill="currentColor" fill-rule="evenodd"/></svg>`;
  }

  /**
   * Sanitizer rule
   * @return {Object.<string>} {Object.<string>}
   */
  static get sanitize() {
    return {
      ul: true,
      ol: true,
      li: true,
    };
  }

  /* 
  public get shortcut() {
    return shortcut;
  } */
}

export { InlineList };
